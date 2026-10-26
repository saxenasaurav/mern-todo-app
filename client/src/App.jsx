import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // 1. Backend se tasks lana
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. Naya task add karna
  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axios.post(API_URL, { text });
      setTodos([res.data, ...todos]);
      setText('');
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  // 3. Status toggle karna (Done / Not Done)
  const toggleTodo = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { completed: !currentStatus });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // 4. Task Edit Save karna
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`${API_URL}/${id}`, { text: editText });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  // 5. Task Delete karna
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Yeh line miss ho gayi thi: Filter Logic
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '12px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>🎯 Pro Todo App</h2>

      {/* Form */}
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Naya task likhein..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: '12px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '12px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add
        </button>
      </form>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {['all', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #007bff',
              backgroundColor: filter === tab ? '#007bff' : 'transparent',
              color: filter === tab ? '#fff' : '#007bff',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li
            key={todo._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: todo.completed ? '#e8f5e9' : '#fafafa',
              borderRadius: '6px',
              marginBottom: '8px'
            }}
          >
            {editingId === todo._id ? (
              <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #007bff' }}
                />
                <button onClick={() => saveEdit(todo._id)} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo._id, todo.completed)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : '#333',
                    flex: 1,
                    fontSize: '15px'
                  }}
                >
                  {todo.completed ? '✅ ' : '⭕ '} {todo.text}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => { setEditingId(todo._id); setEditText(todo.text); }}
                    style={{ background: '#ffc107', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', margin: '20px 0' }}>Koi task nahi mila!</p>
      )}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        Total Tasks: {todos.length} | Pending: {todos.filter(t => !t.completed).length}
      </div>
    </div>
  );
}

export default App;