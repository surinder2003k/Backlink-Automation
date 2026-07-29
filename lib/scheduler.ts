import cron from "node-cron";

const scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

export function registerSchedule(
  id: string,
  timeSlot: string,
  callback: () => Promise<void>
) {
  const [hour, minute] = timeSlot.split(":");
  const cronExpression = `${minute} ${hour} * * *`;

  if (scheduledJobs.has(id)) {
    scheduledJobs.get(id)!.stop();
  }

  const task = cron.schedule(cronExpression, async () => {
    console.log(`[Scheduler] Running scheduled job ${id} at ${timeSlot}`);
    try {
      await callback();
    } catch (error) {
      console.error(`[Scheduler] Job ${id} failed:`, error);
    }
  });

  scheduledJobs.set(id, task);
  console.log(`[Scheduler] Registered job ${id} at ${timeSlot} (${cronExpression})`);
  return task;
}

export function unregisterSchedule(id: string) {
  const task = scheduledJobs.get(id);
  if (task) {
    task.stop();
    scheduledJobs.delete(id);
    console.log(`[Scheduler] Unregistered job ${id}`);
  }
}

export function clearAllSchedules() {
  scheduledJobs.forEach((task) => task.stop());
  scheduledJobs.clear();
  console.log("[Scheduler] All jobs cleared");
}
