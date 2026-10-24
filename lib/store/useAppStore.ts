import { create } from "zustand";
import { format, addDays } from "date-fns";
import { Task, TaskColor, RecurrenceRule } from "../types/task";
import {
  calculateTaskCompletionPoints,
  POINTS_START_TASK,
  POINTS_COMPLETE_SUBTASK,
} from "../gamification/points";

export type TabType = "today" | "calendar" | "tribe" | "spark";

interface AppState {
  theme: "light" | "dark" | "auto";
  setTheme: (theme: "light" | "dark" | "auto") => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  user: {
    displayName: string;
    points: number;
    streak: number;
    streakFreezes: number;
    badDayMode: boolean;
  };
  addPoints: (amount: number, reason: string) => void;
  toggleBadDayMode: () => void;

  // Task Management
  tasks: Task[];
  activeTaskId: string | null;
  selectedTaskId: string | null;
  isQuickAddOpen: boolean;

  setIsQuickAddOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  setActiveTaskId: (id: string | null) => void;

  addTask: (task: Omit<Task, "id" | "createdAt" | "status" | "subtasks"> & { subtasks?: string[] }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  startTask: (id: string) => void;
  moveTaskToTomorrow: (id: string) => void;

  // Subtask Management
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
}

const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Write outline for project architecture",
    notes: "Break down core components and server routes. Keep it simple.",
    date: "2026-10-24",
    time: "10:30",
    durationMin: 30,
    color: "violet",
    status: "doing",
    subtasks: [
      { id: "sub-1", title: "Review requirements brief", completed: true },
      { id: "sub-2", title: "Draft high-level modules", completed: false },
      { id: "sub-3", title: "Write Next.js route handlers", completed: false },
    ],
    hasAlarm: true,
    recurrence: "none",
    createdAt: 1729780000000,
  },
  {
    id: "task-2",
    title: "Afternoon hydration & quick stretch",
    notes: "Get up from desk, drink 1 full glass of water.",
    date: "2026-10-24",
    time: "15:30",
    durationMin: 10,
    color: "amber",
    status: "todo",
    subtasks: [],
    hasAlarm: true,
    recurrence: "daily",
    createdAt: 1729770000000,
  },
  {
    id: "task-3",
    title: "Review and send team summary",
    notes: "3 bullet points on what was accomplished today.",
    date: "2026-10-24",
    time: "17:00",
    durationMin: 25,
    color: "violet",
    status: "todo",
    subtasks: [],
    hasAlarm: false,
    recurrence: "none",
    createdAt: 1729760000000,
  },
  {
    id: "task-4",
    title: "Evening unwind & screen disconnect",
    notes: "Listen to music or read for 15 minutes before bed.",
    date: "2026-10-24",
    time: "21:00",
    durationMin: 20,
    color: "green",
    status: "todo",
    subtasks: [],
    hasAlarm: false,
    recurrence: "daily",
    createdAt: 1729750000000,
  },
];

// Helper to load/save from localStorage
function getStoredTasks(): Task[] {
  if (typeof window === "undefined") return INITIAL_DEMO_TASKS;
  try {
    const raw = localStorage.getItem("focusly_tasks_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_DEMO_TASKS;
}

function persistTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("focusly_tasks_v1", JSON.stringify(tasks));
  } catch {}
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: "light",
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      const isDark =
        theme === "dark" ||
        (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark);
    }
    set({ theme });
  },
  activeTab: "today",
  setActiveTab: (activeTab) => set({ activeTab }),

  user: {
    displayName: "Alex",
    points: 120,
    streak: 4,
    streakFreezes: 1,
    badDayMode: false,
  },
  addPoints: (amount) =>
    set((state) => ({
      user: {
        ...state.user,
        points: state.user.points + amount,
      },
    })),
  toggleBadDayMode: () =>
    set((state) => ({
      user: {
        ...state.user,
        badDayMode: !state.user.badDayMode,
      },
    })),

  // Task State
  tasks: typeof window !== "undefined" ? getStoredTasks() : INITIAL_DEMO_TASKS,
  activeTaskId: "task-1",
  selectedTaskId: null,
  isQuickAddOpen: false,

  setIsQuickAddOpen: (isQuickAddOpen) => set({ isQuickAddOpen }),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  setActiveTaskId: (activeTaskId) => set({ activeTaskId }),

  addTask: (taskInput) => {
    const newTask: Task = {
      id: "task-" + Date.now(),
      title: taskInput.title,
      notes: taskInput.notes || "",
      date: taskInput.date || format(new Date(), "yyyy-MM-dd"),
      time: taskInput.time || "12:00",
      durationMin: Number(taskInput.durationMin) || 20,
      color: taskInput.color || "violet",
      status: "todo",
      hasAlarm: !!taskInput.hasAlarm,
      recurrence: taskInput.recurrence || "none",
      subtasks: (taskInput.subtasks || []).map((subTitle, idx) => ({
        id: "sub-" + Date.now() + "-" + idx,
        title: subTitle,
        completed: false,
      })),
      createdAt: Date.now(),
    };

    set((state) => {
      const updated = [newTask, ...state.tasks];
      persistTasks(updated);
      return {
        tasks: updated,
        isQuickAddOpen: false,
        // If no active task is set, make this new one active
        activeTaskId: state.activeTaskId || newTask.id,
      };
    });
  },

  updateTask: (id, updates) => {
    set((state) => {
      const updated = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      persistTasks(updated);
      return { tasks: updated };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const updated = state.tasks.filter((t) => t.id !== id);
      persistTasks(updated);
      return {
        tasks: updated,
        activeTaskId: state.activeTaskId === id ? (updated[0]?.id || null) : state.activeTaskId,
        selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
      };
    });
  },

  completeTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task || task.status === "done") return;

    const points = calculateTaskCompletionPoints(task);
    get().addPoints(points, `Completed task: ${task.title}`);

    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, status: "done" as const, completedAt: Date.now() } : t
      );
      persistTasks(updated);

      // Find next todo task to activate
      const nextTask = updated.find((t) => t.status !== "done" && t.id !== id);

      return {
        tasks: updated,
        activeTaskId: nextTask?.id || null,
      };
    });
  },

  startTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    // Award starting points (+1) per Section 5 rules
    get().addPoints(POINTS_START_TASK, `Started task: ${task.title}`);

    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, status: "doing" as const } : t
      );
      persistTasks(updated);
      return {
        tasks: updated,
        activeTaskId: id,
        selectedTaskId: null,
        activeTab: "today",
      };
    });
  },

  moveTaskToTomorrow: (id) => {
    const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, date: tomorrowStr, status: "todo" as const } : t
      );
      persistTasks(updated);
      const nextTask = updated.find((t) => t.date === format(new Date(), "yyyy-MM-dd") && t.status !== "done");
      return {
        tasks: updated,
        selectedTaskId: null,
        activeTaskId: state.activeTaskId === id ? (nextTask?.id || null) : state.activeTaskId,
      };
    });
  },

  addSubtask: (taskId, title) => {
    if (!title.trim()) return;
    const newSub: { id: string; title: string; completed: boolean } = {
      id: "sub-" + Date.now(),
      title: title.trim(),
      completed: false,
    };
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSub] } : t
      );
      persistTasks(updated);
      return { tasks: updated };
    });
  },

  toggleSubtask: (taskId, subtaskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;
    const sub = task.subtasks.find((s) => s.id === subtaskId);
    if (!sub) return;

    const willBeCompleted = !sub.completed;
    if (willBeCompleted) {
      get().addPoints(POINTS_COMPLETE_SUBTASK, "Completed subtask");
    }

    set((state) => {
      const updated = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: willBeCompleted } : s
          ),
        };
      });
      persistTasks(updated);
      return { tasks: updated };
    });
  },

  deleteSubtask: (taskId, subtaskId) => {
    set((state) => {
      const updated = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
        };
      });
      persistTasks(updated);
      return { tasks: updated };
    });
  },
}));
