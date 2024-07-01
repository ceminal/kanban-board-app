'use client';

import { createContext, useReducer, ReactNode } from 'react';

interface BoardState {
  id: string | null;
  name: string | null;
}

type BoardAction =
  | { type: 'SET_BOARD'; payload: { id: string; name: string } }
  | { type: 'CLEAR_BOARD' };

const initialState: BoardState = {
  id: null,
  name: null,
};

const BoardContext = createContext<{
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'SET_BOARD':
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
      };
    case 'CLEAR_BOARD':
      return initialState;
    default:
      return state;
  }
};

const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export { BoardContext, BoardProvider };
