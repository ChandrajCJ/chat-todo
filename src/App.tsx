import React from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 z-50 p-4 sticky top-0">
        <h1 className="text-xl font-bold text-center">Community Medicine</h1>
      </header>
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <TodoList />
        <TodoInput />
      </main>
    </div>
  );
}

export default App;