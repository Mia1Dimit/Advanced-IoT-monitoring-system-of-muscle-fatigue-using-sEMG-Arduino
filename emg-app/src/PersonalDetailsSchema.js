// personalDetailsSchema.js
const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
  name: String,
  surname: String,
  height: Number,
  weight: Number,
  age: Number,
  gender: String
}, { collection: 'PersonalDetails' });

module.exports = personalDetailsSchema;
