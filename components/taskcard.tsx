import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="border p-4 mb-4 rounded shadow-md bg-white">
      <h3 className="font-bold mb-2">{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
