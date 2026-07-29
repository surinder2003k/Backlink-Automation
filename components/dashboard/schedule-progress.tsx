"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";

interface ScheduleProgressProps {
  schedules: Array<{
    id: string;
    time_slot: string;
    platforms: string[];
    is_active: boolean;
  }>;
}

export function ScheduleProgress({ schedules }: ScheduleProgressProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(time);

      const active = schedules.find(
        (s) => s.is_active && s.time_slot === time
      );
      if (active && !posting) {
        setActiveSlot(active.time_slot);
        triggerScheduledPost(active);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [schedules, posting]);

  const triggerScheduledPost = async (schedule: any) => {
    setPosting(true);
    setResults({});
    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time_slot: schedule.time_slot }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || {});
      }
    } catch (e) {
      console.error("Scheduled post error:", e);
    }
    setTimeout(() => {
      setPosting(false);
      setActiveSlot(null);
    }, 5000);
  };

  const activeSchedules = schedules.filter((s) => s.is_active);

  if (activeSchedules.length === 0) return null;

  return (
    <Card className="border-cyber-cyan/30 bg-cyber-cyan/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyber-cyan" />
            <span className="text-sm font-mono text-cyber-text">
              Schedule Active — <span className="text-cyber-cyan">{currentTime}</span>
            </span>
          </div>
          {posting && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-cyber-cyan" />
              <span className="text-xs font-mono text-cyber-text-muted">
                Posting to {activeSlot}...
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {activeSchedules.map((s) => (
            <div key={s.id} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-cyber-text-muted w-12">{s.time_slot}</span>
              <div className="flex gap-1">
                {s.platforms.map((p) => (
                  <span
                    key={p}
                    className={`font-mono uppercase ${
                      posting && activeSlot === s.time_slot
                        ? "text-cyber-cyan animate-pulse"
                        : "text-cyber-text-muted"
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
              {results[s.time_slot] && (
                <CheckCircle2 className="h-3 w-3 text-green-400" />
              )}
            </div>
          ))}
        </div>

        {posting && (
          <div className="mt-3">
            <div className="w-full bg-cyber-border rounded-full h-1.5">
              <div className="bg-cyber-cyan h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
