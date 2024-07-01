import { TaskState } from "@/types";

export const LIST_NAMES:{[key in keyof TaskState]:string} ={
    backlog: 'Backlog',
    todo: 'To Do',
    inProgress: 'In Progress',
    designed: 'Designed',
}