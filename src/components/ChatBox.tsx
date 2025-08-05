import React, { useState } from 'react';

interface Message {
  id: number;
  author: string;
  text: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');

  const send = () => {
    if (!value) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: 'me', text: value },
    ]);
    setValue('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-1 p-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-semibold mr-1">{m.author}:</span>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-700">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 bg-gray-800 p-1 text-sm"
          placeholder="Type message"
        />
        <button className="px-3 bg-pink-500" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
