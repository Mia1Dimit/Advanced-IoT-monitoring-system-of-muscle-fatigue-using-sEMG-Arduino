import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AccessHistory.css';
const moment = require('moment');

function AccessHistory() {
  const [formData, setFormData] = useState({
    name: '',
    surname: ''
  });
  const [message, setMessage] = useState('');
  const [dates, setDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      const { name, surname } = formData;
      const date = new Date().toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, surname, date })
      });

      const data = await response.json();
      if (response.ok) {
        setDates(data.history.map(item => item.date_of_test)); // Ensure dates are properly populated
        setShowModal(true);
      } else {
        setMessage(data.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setShowModal(true);
    }
  };

  const handleDateSelection = async (date) => {
    try {
      const { name, surname } = formData;
  
      const response = await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, surname })
      });
  
      const data = await response.json();
      if (response.ok) {
        // Find the document corresponding to the selected date
        const selectedDocument = data.history.find(item => item.date_of_test === date);
        if (selectedDocument) {
          // Redirect to history-results page with the selected document
          history.push({
            pathname: '/history-results',
            state: { selectedDocument, formData }
          });
        } else {
          console.error('Document not found for selected date:', date);
        }
      } else {
        setMessage(data.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setShowModal(true);
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="access-history-container">
      <h1>Access History</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
      {showModal && (
        <div className="popup">
          <div className="popup-content">
            <ul>
              {dates.map((date, index) => (
                <li key={index} onClick={() => handleDateSelection(date)}>{formatDate(date)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessHistory;
