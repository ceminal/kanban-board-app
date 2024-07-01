'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { BoardContext } from '../../../context/BoardContext';
import TaskModal from '../../../components/taskmodal';
import TaskList from '../../../components/tasklist';
import { Task, TaskState, CreateTaskPayload } from '../../../types';
import { getTasks, createTask, updateTask, deleteTask } from '../../../lib/api';
import { LIST_NAMES } from '@/lib/constants';
import Link from 'next/link';

const BoardPage = ({ params }: { params: { id: string } }) => {
  const { id: boardId } = params;
  const router = useRouter();
  const { state, dispatch } = useContext(BoardContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<keyof TaskState>('backlog');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<TaskState>({
    backlog: [],
    todo: [],
    inProgress: [],
    designed: [],
  });

  // Fetch tasks when the board ID changes
  useEffect(() => {
    if (boardId) {
      const fetchTasks = async () => {
        try {
          const data = await getTasks(boardId);
          if (data && Array.isArray(data)) {
            const groupedTasks = data.reduce(
              (acc: TaskState, task: Task) => {
                acc[task.status as keyof TaskState].push(task);
                return acc;
              },
              { backlog: [], todo: [], inProgress: [], designed: [] } as TaskState
            );
            setTasks(groupedTasks);
          } else {
            console.error('Data is not in expected format:', data);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId) {
      dispatch({ type: 'SET_BOARD', payload: { id: boardId, name: 'Unknown Board' } });
    }
  }, [boardId, dispatch]);


  const openModal = (list: keyof TaskState, task?: Task) => {
    setSelectedList(list);
    setIsModalOpen(true);
    setEditingTask(task ? task : null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedList('backlog');
    setEditingTask(null);
  };

  // Handle task creation
  const handleAddTask = async (title: string, description: string) => {
    const newTask: CreateTaskPayload = { title, description, status: selectedList, boardId: boardId };
    try {
      const addedTask = await createTask(newTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedList]: [...prevTasks[selectedList], addedTask],
      }));
    } catch (error) {
      console.error('Error creating task:', error);
    }
    closeModal();
  };

  // Handle task update
  const handleUpdateTask = async (id: string, title: string, description: string) => {
    try {
      const updatedTask = await updateTask(id, { title, description, status: selectedList });
      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedList]: prevTasks[selectedList].map(task => task._id === id ? updatedTask : task),
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
    closeModal();
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string, status: keyof TaskState) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: prevTasks[status].filter(task => task._id !== taskId),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle drag and drop event for reordering tasks
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceList = tasks[source.droppableId as keyof TaskState];
    const destinationList = tasks[destination.droppableId as keyof TaskState];
    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId as keyof TaskState]: sourceList,
      [destination.droppableId as keyof TaskState]: destinationList,
    }));

    try {
      await updateTask(movedTask._id, { status: destination.droppableId as keyof TaskState, order: destination.index });

      await Promise.all(
        destinationList.map((task, index) =>
          updateTask(task._id, { order: index })
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (!state.id || !state.name) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className='px-8 my-6 flex justify-between items-center' style={{ maxWidth: "1200px", width: '100%' }}>
        <Link href="/" className="text-gray-800 mr-4">
          <FaHome size={30} />
        </Link>
        <h4 className="text-xl text-gray-800"><b>Board ID:</b> {boardId}</h4>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-8" style={{ maxWidth: "1200px" }}>
          {(['backlog', 'todo', 'inProgress', 'designed'] as (keyof TaskState)[]).map((status) => (
            <TaskList key={status} status={status} tasks={tasks[status]} openModal={openModal} listName={LIST_NAMES[status]} onDeleteTask={handleDeleteTask} />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAddTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default BoardPage;
