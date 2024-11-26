import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';

const Profile = ({ setLoggedIn }) => {
const [profile, setProfile] = useState(null);
const [error, setError] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({});

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', { withCredentials: true });
      setProfile(response.data);
      setFormData(response.data); 
    } catch (error) {
      console.error('Error fetching profile:', error);           
      if ( error.response?.status === 403) {
        setError('Session expired. Please log in again.');
        setTimeout(() => setLoggedIn(false), 2000); 
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }                                
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile/update',
        formData,
        { withCredentials: true }
      );
      alert(response.data.message);
      setProfile({ ...formData }); 
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <div className="spinner">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {isEditing ? (
        <>
          <label>
            Full Name: 
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Branch: 
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Year: 
            <input
              type="text"
              name="year_of_degree"
              value={formData.year_of_degree}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Degree: 
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
            />
          </label>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>Full Name: {profile.full_name}</p>
          <p>Email: {profile.email}</p>
          <p>Branch: {profile.branch}</p>
          <p>Year: {profile.year_of_degree}</p>
          <p>Degree: {profile.degree}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </>
      )}
      <button onClick={() => setLoggedIn(false)}>Logout</button>
    </div>
  );
};
  
export default Profile;
