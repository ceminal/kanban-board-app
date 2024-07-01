'use client';

import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { BoardContext } from '../context/BoardContext';
import { createBoard } from '../lib/api';
import Image from 'next/image';

type Inputs = {
  name: string;
};

export default function Home() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const router = useRouter();
  const { dispatch } = useContext(BoardContext);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const board = await createBoard(data.name);
      dispatch({ type: 'SET_BOARD', payload: { id: board._id, name: board.name } });
      reset();
      router.push(`/board/${board._id}`);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/rastmobile.jpg" alt="Rastmobile Logo" width={100} height={100} priority/>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Dashboard</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name', { required: true })}
            placeholder="Board Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}
