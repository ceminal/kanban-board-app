import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Task, TaskState } from '../types';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface TaskListProps {
  status: keyof TaskState;
  tasks: Task[];
  openModal: (status: keyof TaskState, task?: Task) => void;
  onDeleteTask: (taskId: string, status: keyof TaskState) => void;
  listName: string;
}

const TaskList: React.FC<TaskListProps> = ({ status, tasks, openModal, onDeleteTask, listName }) => {
  const statusColors: Record<keyof TaskState, string> = {
    backlog: 'bg-red-500',
    todo: 'bg-blue-500',
    inProgress: 'bg-yellow-500',
    designed: 'bg-green-500',
  };

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="bg-white rounded-md shadow-md w-full">
          <div className={`${statusColors[status]} p-2 rounded-t-md mb-2`}>
            <h2 className="text-lg font-bold text-center text-white">{listName}</h2>
          </div>
          <div className="space-y-2 p-4 custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
                    onClick={() => openModal(status, task)}
                  >
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm font-bold">{task.title}</h3>
                      <p className="text-xs text-gray-600" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task._id, status);
                      }}
                      className="ml-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => openModal(status)}
                className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                title="Add Task"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
