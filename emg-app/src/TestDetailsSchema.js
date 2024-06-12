// TestDetailsSchema.js

const mongoose = require('mongoose');

const TestDetailsSchema = new mongoose.Schema({
  date_of_test: {
    type: String,
    required: true
  },
  mnf_values: {
    type: [Number], // Array of numbers
    required: true
  },
  mpf_values: {
    type: [Number], // Array of numbers
    required: true
  },
  fatigue_A_values: {
    type: [Number], // Array of numbers
    required: true
  },
  fatigue_B_values: {
    type: [Number], // Array of numbers
    required: true
  },
  individ_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalDetails', 
    required: true
  }
}, { collection: 'TestDetails' });

module.exports = TestDetailsSchema;

