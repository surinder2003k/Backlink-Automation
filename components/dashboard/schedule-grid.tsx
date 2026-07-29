"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORMS = [
  { id: "devto", label: "Dev.to" },
  { id: "blogger", label: "Blogger" },
  { id: "tumblr", label: "Tumblr" },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

interface Schedule {
  id: string;
  time_slot: string;
  platforms: string[];
  is_active: boolean;
}

interface ScheduleGridProps {
  schedules: Schedule[];
  onToggle: (id: string, active: boolean) => Promise<void>;
  onUpdate: (id: string, platforms: string[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: (timeSlot: string, platforms: string[]) => Promise<void>;
}

export function ScheduleGrid({
  schedules,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
}: ScheduleGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4 text-cyber-cyan" />
          Posting Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-cyber-text-muted mb-4">
              No schedules configured yet
            </p>
            <AddScheduleRow onAdd={onAdd} />
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center gap-4 rounded-md border border-cyber-border bg-cyber-bg/50 p-4"
              >
                <div className="flex items-center gap-3 min-w-[100px]">
                  <Switch
                    checked={schedule.is_active}
                    onCheckedChange={(checked) =>
                      onToggle(schedule.id, checked)
                    }
                  />
                  <span className="font-mono text-sm text-cyber-text font-medium">
                    {schedule.time_slot}
                  </span>
                </div>

                <div className="flex-1 flex gap-2 flex-wrap">
                  {PLATFORMS.map((platform) => {
                    const isSelected = schedule.platforms.includes(platform.id);
                    return (
                      <Button
                        key={platform.id}
                        variant={isSelected ? "default" : "secondary"}
                        size="sm"
                        onClick={async () => {
                          const newPlatforms = isSelected
                            ? schedule.platforms.filter(
                                (p) => p !== platform.id
                              )
                            : [...schedule.platforms, platform.id];
                          await onUpdate(schedule.id, newPlatforms);
                        }}
                        className={
                          isSelected ? "bg-cyber-cyan text-black" : ""
                        }
                      >
                        {platform.label}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(schedule.id)}
                  className="text-cyber-text-muted hover:text-cyber-red shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="pt-2">
              <AddScheduleRow onAdd={onAdd} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddScheduleRow({
  onAdd,
}: {
  onAdd: (timeSlot: string, platforms: string[]) => Promise<void>;
}) {
  const handleSubmit = async (formData: FormData) => {
    const timeSlot = formData.get("time_slot") as string;
    if (timeSlot) await onAdd(timeSlot, []);
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-3">
      <Select name="time_slot">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {TIME_SLOTS.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Add Schedule
      </Button>
    </form>
  );
}
