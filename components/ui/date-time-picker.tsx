"use client";

import { Calendar } from "lucide-react";

interface DateTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  min?: string;
}

export function DateTimePicker({ value, onChange, min }: DateTimePickerProps) {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-cyan pointer-events-none z-10" />
      <input
        type="datetime-local"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        min={min || undefined}
        className="w-full rounded-md border border-cyber-border bg-cyber-bg pl-10 pr-3 py-2 text-sm text-cyber-text font-mono hover:border-cyber-cyan/50 focus:border-cyber-cyan focus:outline-none transition-colors [color-scheme:dark]"
      />
    </div>
  );
}
