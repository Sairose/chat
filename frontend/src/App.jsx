import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <ChatPage user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
