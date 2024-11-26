import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import Profile from './components/Profile';
import Task from './components/Task';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile');
  const [showLogin, setShowLogin] = useState(true); 

   if (!loggedIn) {
    return showLogin ? (
      <LoginForm setLoggedIn={setLoggedIn} setShowLogin={setShowLogin} />
    ) : (
      <Register setShowLogin={setShowLogin} />
    );
  }

  return (
    <div>
      <nav className="sidebar">
        <button onClick={() => setCurrentPage('profile')}>Dashboard</button>
        <button onClick={() => setCurrentPage('task')}>Task</button>
      </nav>
      <main>
        {currentPage === 'profile' && <Profile setLoggedIn={setLoggedIn} />}
        {currentPage === 'task' && <Task />}
      </main>
    </div>
  );
}

export default App;
