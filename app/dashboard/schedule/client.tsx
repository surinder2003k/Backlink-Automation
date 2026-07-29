"use client";

import { useRouter } from "next/navigation";
import { ScheduleGrid } from "@/components/dashboard/schedule-grid";
import { ScheduleProgress } from "@/components/dashboard/schedule-progress";

interface Schedule {
  id: string;
  time_slot: string;
  platforms: string[];
  is_active: boolean;
}

interface ScheduleClientProps {
  schedules: Schedule[];
}

export function ScheduleClient({ schedules }: ScheduleClientProps) {
  const router = useRouter();

  const handleToggle = async (id: string, active: boolean) => {
    await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: active }),
    });
    router.refresh();
  };

  const handleUpdate = async (id: string, platforms: string[]) => {
    await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, platforms }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleAdd = async (timeSlot: string, platforms: string[]) => {
    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time_slot: timeSlot, platforms }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-cyber-text">
          Schedule
        </h2>
        <p className="text-sm text-cyber-text-muted mt-1">
          Configure automated posting schedules
        </p>
      </div>

      <ScheduleProgress schedules={schedules} />

      <ScheduleGrid
        schedules={schedules}
        onToggle={handleToggle}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
}
