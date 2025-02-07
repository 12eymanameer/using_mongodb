const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads')); // to serve static files (audio files)

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stress-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for DB connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Define schemas for structured and unstructured data
const structuredDataSchema = new mongoose.Schema({
  stressLevel: { type: Number, required: true },
  activity: { type: String, required: true },
  mood: { type: String, required: true },
});

const unstructuredDataSchema = new mongoose.Schema({
  description: { type: String },
  audioFilePath: { type: String, required: true },
});

// Create models for both types of data
const StructuredData = mongoose.model('StructuredData', structuredDataSchema);
const UnstructuredData = mongoose.model('UnstructuredData', unstructuredDataSchema);

// Multer setup for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to add structured data (stress level, activity, mood)
app.post('/addStructuredData', async (req, res) => {
  const { stressLevel, activity, mood } = req.body;

  try {
    const newStructuredData = new StructuredData({ stressLevel, activity, mood });
    await newStructuredData.save();
    res.status(201).json({ message: 'Structured data added successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error adding structured data' });
  }
});

// Route to add unstructured data (audio file and description)
app.post('/addUnstructuredData', upload.single('audioFile'), async (req, res) => {
  const { unstructuredData } = req.body; // Get text data from body
  let audioFilePath = '';

  // If there's an audio file, get its path
  if (req.file) {
    audioFilePath = req.file.path;
  }

  try {
    const newUnstructuredData = new UnstructuredData({
      description: unstructuredData, // Store the description if provided
      audioFilePath: audioFilePath, // Store the audio file path if uploaded
    });
    await newUnstructuredData.save();
    res.status(201).json({ message: 'Data saved successfully', filePath: audioFilePath });
  } catch (err) {
    res.status(400).json({ error: 'Error saving unstructured data' });
  }
});

// Route to view all structured data
app.get('/viewStructuredData', async (req, res) => {
  try {
    const data = await StructuredData.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching structured data' });
  }
});

// Route to view all unstructured data
app.get('/viewUnstructuredData', async (req, res) => {
  try {
    const data = await UnstructuredData.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching unstructured data' });
  }
});

// Route to update structured data by ID
app.put('/updateStructuredData/:id', async (req, res) => {
  const { id } = req.params;
  const { stressLevel, activity, mood } = req.body;

  try {
    const updatedData = await StructuredData.findByIdAndUpdate(
      id,
      { stressLevel, activity, mood },
      { new: true } // Return the updated document
    );
    if (!updatedData) {
      return res.status(404).json({ error: 'Structured data not found' });
    }
    res.json({ message: 'Structured data updated successfully', updatedData });
  } catch (err) {
    res.status(400).json({ error: 'Error updating structured data' });
  }
});

// Route to delete structured data by ID
app.delete('/deleteStructuredData/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedData = await StructuredData.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: 'Structured data not found' });
    }
    res.json({ message: 'Structured data deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting structured data' });
  }
});

// Route to update structured data by ID
app.put('/updateStructuredData/:id', async (req, res) => {
  const { id } = req.params;
  const { stressLevel, activity, mood } = req.body;

  if (!stressLevel || !activity || !mood) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedData = await StructuredData.findByIdAndUpdate(
      id,
      { stressLevel, activity, mood },
      { new: true } // Return the updated document
    );
    if (!updatedData) {
      return res.status(404).json({ error: 'Structured data not found' });
    }
    res.json({ message: 'Structured data updated successfully', updatedData });
  } catch (err) {
    res.status(400).json({ error: 'Error updating structured data' });
  }
});

// Route to delete unstructured data by ID
app.delete('/deleteUnstructuredData/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedData = await UnstructuredData.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: 'Unstructured data not found' });
    }
    res.json({ message: 'Unstructured data deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting unstructured data' });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
