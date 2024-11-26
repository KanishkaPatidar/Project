import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

const Register = ({ setShowLogin }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    yearOfDegree: "",
    branch: "",
    degree: "",
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
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setSuccess(response.data.message);
      setError(null);
      setTimeout(() => setShowLogin(true), 2000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Try again.');
      setSuccess(null);
    }
  };

return (
  <div className="login-container"> 
    <h1>Create an Account</h1>
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="degree"
        placeholder="Degree (e.g., B.Tech, M.Tech)"
        value={formData.degree}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="branch"
        placeholder="Branch"
        value={formData.branch}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="yearOfDegree"
        placeholder="Year (e.g., 1st, 2nd)"
        value={formData.yearOfDegree}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
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
      <button type="submit">Register</button>
      <p>
        Already have an account? 
        <span className="link" onClick={() => setShowLogin(true)}>Login here</span>
      </p>
    </form>
  </div>
);
};

export default Register;
