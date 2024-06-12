import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import CSS file for styling

function Home() {
  const runTest = async () => {
    try {
      const response = await fetch('/api/run-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>EMG Fatigue Monitoring</h1>
      <div className="options-container">
        <Link to="/register-patient" className="option-box">Register Athlete</Link>
        <button onClick={runTest} className="option-box">Start Test</button>
        <Link to="/access-history" className="option-box">Access History of Athlete</Link>
      </div>
    </div>
  );
}

export default Home;
