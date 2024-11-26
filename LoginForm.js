import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

const LoginForm = ({ setLoggedIn, setShowLogin }) => {
const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);

const handleChange = (e) => {
  const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData, { withCredentials: true });
      console.log("Login successful:", response.data); 
      setSuccess("Login successful!");
      setError(null);      
      setLoggedIn(true); 
    } catch (error) {
      console.error("Login error:", error.response?.data); 
      setError(error.response?.data?.message || "Login failed. Please try again.");
      setSuccess(null);
    }
  };

const handleRegisterClick = () => {
  setShowLogin(false); 
};

return (
    <div className="login-container">
      <h1>Welcome to the Website</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>User Login</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <div>
           <p>
         Don't have an account? <span className="link" onClick={() => setShowLogin(false)}>Register here</span>.
       </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
