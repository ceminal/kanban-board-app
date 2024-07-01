import axios from 'axios';
import { Task, CreateTaskPayload } from '../types';

const API_URL = '/api/tasks';
const BOARD_API_URL = '/api/boards';

export const getTasks = async (boardId: string): Promise<Task[]> => {
  try {
    const response = await axios.get<{ success: boolean; data: Task[] }>(API_URL, { params: { boardId } });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task: CreateTaskPayload): Promise<Task> => {
  const response = await axios.post<{ success: boolean; data: Task }>(API_URL, task);
  return response.data.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await axios.put<{ success: boolean; data: Task }>(`${API_URL}/${id}`, task);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete<{ success: boolean; data: null }>(`${API_URL}/${id}`);
};

export const createBoard = async (name: string): Promise<{ _id: string; name: string }> => {
  const response = await axios.post<{ success: boolean; data: { _id: string; name: string } }>(BOARD_API_URL, { name });
  return response.data.data;
};
