// RegisterPatient.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './RegisterPatient.css'; // Import CSS file for styling

function RegisterPatient() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    height: '',
    weight: '',
    age: '',
    gender: ''
  });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for popup window
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      setMessage(data.message);
  
      if (response.ok) {
        // Registration successful, show popup window
        setShowPopup(true);
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          setShowPopup(false);
          history.push('/');
        }, 2000);
      } else if (response.status === 409) {
        // Patient already exists, show popup window
        setShowPopup(true);
        // Hide popup window after 2 seconds
        setTimeout(() => {
          setShowPopup(false);
          history.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };
  

  useEffect(() => {
    if (!showPopup) {
      setMessage(''); // Clear message when hiding the popup
    }
  }, [showPopup]);

  return (
    <div className="register-container">
      <h1>Register Athlete</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} />
        <input type="text" name="height" placeholder="Height" value={formData.height} onChange={handleChange} />
        <input type="text" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
        <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPatient;
