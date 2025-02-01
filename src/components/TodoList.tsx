import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '../lib/firebase';
import { Todo } from '../types/todo';
import { Clock, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData: Todo[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only add todos that have valid timestamps
        if (data.timestamp) {
          todosData.push({
            id: doc.id,
            text: data.text,
            category: data.category,
            timestamp: data.timestamp.toDate(),
            completed: data.completed,
          });
        }
      });
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [todos]);

  const toggleTodoCompletion = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, { completed: !completed });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const formatTimestamp = (date: Date) => {
    try {
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[740px]">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={clsx(
            'flex flex-col p-4 rounded-lg max-w-[80%] relative',
            todo.category === '🦎' ? 'ml-auto bg-black text-white' : 'bg-gray-100'
          )}
        >
          <button
            onClick={() => toggleTodoCompletion(todo.id, todo.completed)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black transition"
          >
            {todo.completed ? <CheckCircle size={20} className="text-green-500" /> : <Circle size={20} />}
          </button>
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-opacity-20 bg-white">
              {todo.category}
            </span>
          </div>
          <p className={`mt-2 `}>{todo.text}</p>
          <div className="flex items-center gap-2 mt-2 text-sm opacity-70">
            <Clock size={14} />
            <time>{formatTimestamp(todo.timestamp)}</time>
          </div>
        </div>
      ))}
    </div>
  );
}
