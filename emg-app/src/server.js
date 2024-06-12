const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');
const cors = require('cors');
const PersonalDetailsSchema = require('./PersonalDetailsSchema'); // Import the PersonalDetails schema
const TestDetailsSchema = require('./TestDetailsSchema'); // Import the TestDetails schema
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://jimiaoul:***@cluster0.rxwufw8.mongodb.net/EMGdata?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create the models
const PersonalDetails = mongoose.model('PersonalDetails', PersonalDetailsSchema);
const TestDetails = mongoose.model('TestDetails', TestDetailsSchema);

// API endpoint to register a new patient
app.post('/api/register', async (req, res) => {
    try {
      // Check if patient already exists
      const existingPatient = await PersonalDetails.findOne({ name: req.body.name, surname: req.body.surname });
      if (existingPatient) {
        return res.status(409).json({ message: 'Patient already exists' });
      }
  
      // Create a new patient entry
      const newPatient = new PersonalDetails(req.body);
      await newPatient.save();
  
      res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// API endpoint to retrieve test history
app.post('/api/history', async (req, res) => {
  try {
    const { name, surname } = req.body;
    
    // Find the patient
    const patient = await PersonalDetails.findOne({ name, surname });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find all documents related to the patient
    const history = await TestDetails.find({ individ_id: patient._id });
    console.log('History:', history);

    if (history.length === 0) {
      return res.status(404).json({ message: 'Test history not found for the patient' });
    }

    // Send all test history data for the patient to the frontend
    res.status(200).json({ history });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to run Python script
app.post('/api/run-script', (req, res) => {
  const pythonProcess = spawn('python', ['file path for BLE_envelope_v4.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      res.status(200).json({ message: 'Script executed successfully' });
    } else {
      res.status(500).json({ message: 'Script execution failed' });
    }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});