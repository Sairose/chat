import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [stats, setStats] = useState({ totalUsers: 0, totalChats: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  const nav = useNavigate();

  const fetchStats = async () => {
    try {
      const statsRes = await axios.get('http://localhost:3000/api/admin/stats', {
        withCredentials: true,
      });
      setStats(statsRes.data);

      const usersRes = await axios.get('http://localhost:3000/api/users', {
        withCredentials: true,
      });
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      nav('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (user) => {
    setEditUserId(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, editForm, { withCredentials: true });
      fetchStats(); // refresh users
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, { withCredentials: true });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2 text-lg">Total Users</h2>
            <div className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2 text-lg">Total Chats</h2>
            <div className="text-3xl font-bold text-indigo-600">{stats.totalChats}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4 text-lg">Users</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Name</th>
                <th className="text-left py-2 px-2">Email</th>
                <th className="text-left py-2 px-2">Role</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-2">
                    {editUserId === user._id ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editUserId === user._id ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editUserId === user._id ? (
                      <select
                        className="border p-1 rounded w-full"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editUserId === user._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(user._id)}
                          className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(user)}
                          className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
