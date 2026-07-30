"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

interface DateTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  min?: string;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export function DateTimePicker({ value, onChange, min }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [timeH, setTimeH] = useState("12");
  const [timeM, setTimeM] = useState("00");
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const minDate = min ? new Date(min) : null;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      if (panelRef.current) {
        panelRef.current.style.top = `${rect.bottom + 4}px`;
        panelRef.current.style.left = `${rect.left}px`;
      }
    }
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else { setViewMonth(viewMonth - 1); }
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else { setViewMonth(viewMonth + 1); }
  };

  const isToday = (d: number) => {
    const t = new Date();
    return d === t.getDate() && viewMonth === t.getMonth() && viewYear === t.getFullYear();
  };

  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    return d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();
  };

  const isDisabled = (d: number) => {
    if (!minDate) return false;
    const date = new Date(viewYear, viewMonth, d);
    return date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  };

  const applyDate = (d: number) => {
    const h = timeH.padStart(2, "0");
    const m = timeM.padStart(2, "0");
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}T${h}:${m}`;
    onChange(iso);
  };

  const applyTime = (h: string, m: string) => {
    setTimeH(h);
    setTimeM(m);
    if (!selectedDate) return;
    const iso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}T${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    onChange(iso);
  };

  const formatDisplay = () => {
    if (!value) return "";
    const d = new Date(value);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 rounded-md border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text hover:border-cyber-cyan/50 transition-colors text-left"
      >
        <Calendar className="h-4 w-4 text-cyber-cyan shrink-0" />
        <span className={value ? "text-cyber-text" : "text-cyber-text-muted"}>
          {value ? formatDisplay() : "Select date & time"}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9999] w-72 rounded-md border border-cyber-border bg-cyber-bg shadow-2xl"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-border">
            <button type="button" onClick={prevMonth} className="text-cyber-text-muted hover:text-cyber-cyan text-lg leading-none">&lsaquo;</button>
            <span className="text-sm font-mono text-cyber-text">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="text-cyber-text-muted hover:text-cyber-cyan text-lg leading-none">&rsaquo;</button>
          </div>

          <div className="grid grid-cols-7 px-2 pt-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-mono text-cyber-text-muted py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 px-2 pb-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const disabled = isDisabled(d);
              return (
                <button
                  key={d}
                  type="button"
                  disabled={disabled}
                  onClick={() => applyDate(d)}
                  className={`text-center text-sm py-1.5 rounded-md transition-colors font-mono ${
                    isSelected(d)
                      ? "bg-cyber-cyan text-black font-bold"
                      : isToday(d)
                      ? "text-cyber-cyan border border-cyber-cyan/50"
                      : disabled
                      ? "text-cyber-border cursor-not-allowed"
                      : "text-cyber-text hover:bg-cyber-card-hover"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border-t border-cyber-border">
            <Clock className="h-4 w-4 text-cyber-cyan shrink-0" />
            <select
              value={timeH}
              onChange={(e) => applyTime(e.target.value, timeM)}
              className="bg-cyber-card border border-cyber-border rounded text-sm text-cyber-text px-2 py-1 font-mono"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>{String(i).padStart(2, "0")}</option>
              ))}
            </select>
            <span className="text-cyber-text-muted">:</span>
            <select
              value={timeM}
              onChange={(e) => applyTime(timeH, e.target.value)}
              className="bg-cyber-card border border-cyber-border rounded text-sm text-cyber-text px-2 py-1 font-mono"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={String(i * 5).padStart(2, "0")}>{String(i * 5).padStart(2, "0")}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto text-xs font-mono text-cyber-cyan hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
