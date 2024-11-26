import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const Task = () => {
const [tasks, setTasks] = useState([]);
const [newTask, setNewTask] = useState('');
const [error, setError] = useState(null);

useEffect(() => { fetchTasks();}, []);

const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

const handleAddTask = async () => {
    if (!newTask.trim()) {
      alert('Task cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { task: newTask },
        { withCredentials: true }
      );
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { withCredentials: true });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

return (
    <div className="task-container">
      <h2>Task List</h2>
      {error && <p className="error">{error}</p>}
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.task}</td>
              <td>
                <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Task;
