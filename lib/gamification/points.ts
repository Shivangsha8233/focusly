import { Task } from "../types/task";

export function calculateTaskCompletionPoints(task: Task): number {
  if (task.durationMin >= 25) {
    return 20;
  }
  return 10;
}

export const POINTS_START_TASK = 1;
export const POINTS_COMPLETE_SUBTASK = 2;
export const POINTS_BONUS_ALL_PLANNED = 5;
export const POINTS_FINISH_BODY_DOUBLE = 15;
export const MAX_POINTS_PER_DAY = 300;
