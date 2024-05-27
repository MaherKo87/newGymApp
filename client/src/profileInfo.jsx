import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileInfo = () => {
  const [profile, setProfile] = useState({
    username: '',
    age: '',
    sex: '',
    height: '',
    weight: ''
  });

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        try {
          const response = await fetch(`http://localhost:3000/profile/${storedUser._id}`);
          if (response.ok) {
            const userProfile = await response.json();
            setProfile({
              username: userProfile.username,
              age: userProfile.age || '',
              sex: userProfile.sex || '',
              height: userProfile.height || '',
              weight: userProfile.weight || ''
            });
          } else {
            console.error('Failed to fetch profile');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      try {
        const response = await fetch(`http://localhost:3000/profile/${storedUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profile)
        });
        if (response.ok) {
          const updatedUser = await response.json();
          console.log('Profile updated:', updatedUser);

          // Optionally, update local storage with the updated user information
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

   const goHome = () => {
    navigate ('/homePage')
  } 

  return (
    <div id="profile-component-template">
      <h1>GymApp</h1>
      <div id="profile-container">
        <h2>Profile Information</h2>
        <p>Username: {profile.username}</p>
        <form>
          <div>
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="sex">Sex:</label>
            <select id="sex" name="sex" value={profile.sex} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="height">Height (cm):</label>
            <input
              type="number"
              id="height"
              name="height"
              value={profile.height}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="weight">Weight (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
            />
          </div>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={goHome}>Home</button>
        </form>
      </div>
      <footer>
        <p>&copy; 2024 Gym Log</p>
      </footer>
    </div>
  );
};

export default ProfileInfo;
