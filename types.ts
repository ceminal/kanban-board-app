export interface Task {
  _id: string;
  title: string;
  description: string;
  status: keyof TaskState;
  boardId: string;
  order: number;
}

export interface TaskState {
  backlog: Task[];
  todo: Task[];
  inProgress: Task[];
  designed: Task[];
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: keyof TaskState;
  boardId: string;
}
