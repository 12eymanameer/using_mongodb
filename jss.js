const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eyman', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for DB connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Define the Sensor Schema
const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, unique: true },
  reading: { type: String, required: true },
});

// Create the Sensor model
const Sensor = mongoose.model('Sensor', sensorSchema);

// Route to add sensor data
app.post('/add', async (req, res) => {
  const { sensorId, reading } = req.body;
  try {
    const newSensor = new Sensor({ sensorId, reading });
    await newSensor.save();
    res.status(201).json({ message: 'Sensor data added successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error adding sensor data' });
  }
});

// Route to update sensor data
app.put('/update', async (req, res) => {
  const { sensorId, newReading } = req.body;
  try {
    const updatedSensor = await Sensor.findOneAndUpdate(
      { sensorId },
      { reading: newReading },
      { new: true }
    );
    if (!updatedSensor) {
      return res.status(404).json({ error: 'Sensor ID not found' });
    }
    res.json({ message: 'Sensor data updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error updating sensor data' });
  }
});

// Route to delete sensor data
app.delete('/delete', async (req, res) => {
  const { sensorId } = req.body;
  try {
    const deletedSensor = await Sensor.findOneAndDelete({ sensorId });
    if (!deletedSensor) {
      return res.status(404).json({ error: 'Sensor ID not found' });
    }
    res.json({ message: 'Sensor data deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting sensor data' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
