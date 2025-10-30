import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChatPage({ user }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch old messages
    const fetchMessages = async () => {
      const res = await axios.get('http://localhost:3000/api/chats', { withCredentials: true });
      setMessages(res.data.reverse());
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000', { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => console.log('Socket connected', socket.id));

    socket.on('receiveMessage', (msg) => setMessages(prev => [...prev, msg]));

    return () => socket.disconnect();
  }, []);

  const send = () => {
    if (!message.trim()) return;
    socketRef.current.emit('sendMessage', { message });
    setMessage('');
  };

  const logout = async () => {
    try {
      // Remove cookie
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      // Remove user info from localStorage
      localStorage.removeItem('user');
      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Global Chat</h2>
          <button onClick={logout} className="text-red-600">Logout</button>
        </div>

        <div className="border rounded h-[60vh] p-3 overflow-auto bg-white">
          {messages.map(m => (
            <div key={m._id || Math.random()} className="mb-3">
              <div className="text-sm text-slate-600">{m.sender?.name || 'Unknown'} · {new Date(m.createdAt).toLocaleTimeString()}</div>
              <div className="bg-slate-100 p-2 rounded mt-1 inline-block">{m.message}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input value={message} onChange={e => setMessage(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type a message" />
          <button onClick={send} className="bg-blue-600 text-white px-4 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
