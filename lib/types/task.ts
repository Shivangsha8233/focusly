export type TaskColor = "amber" | "violet" | "green";
export type TaskStatus = "todo" | "doing" | "done" | "skipped";
export type RecurrenceRule = "none" | "daily" | "weekly";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  color: TaskColor;
  status: TaskStatus;
  subtasks: Subtask[];
  hasAlarm: boolean;
  recurrence: RecurrenceRule;
  createdAt: number;
  completedAt?: number;
}
