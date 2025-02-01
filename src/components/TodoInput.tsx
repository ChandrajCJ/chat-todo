import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function TodoInput() {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'🦎' | '🐞'>('🦎');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'todos'), {
        text,
        category,
        timestamp: serverTimestamp(),
        completed: false,
      });
      setText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCategory('🦎')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === '🦎'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🦎
          </button>
          <button
            type="button"
            onClick={() => setCategory('🐞')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === '🐞'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🐞
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </form>
  );
}