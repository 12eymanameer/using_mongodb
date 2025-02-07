# Stress Management System

## Description
The **Stress Management System** is a web application designed to help users track their stress levels, engage in stress-relieving activities, and record their mood. The system supports both **structured data** (numerical stress levels, activities, and moods) and **unstructured data** (text descriptions and audio recordings of stress experiences). The backend is built with **Node.js, Express, and MongoDB**, while the frontend provides a simple and user-friendly interface.

## Features
- **Structured Data**: Users can log their stress levels, activities, and moods.
- **Unstructured Data**: Users can provide descriptions and upload audio recordings.
- **Data Retrieval**: View all structured and unstructured data entries.
- **Data Management**: Update or delete stored records.
- **Audio File Handling**: Supports file uploads for stress-related recordings.
- **User Authentication**: Signup/Login for personalized stress tracking.
- **Data Visualization**: Interactive charts for stress level trends.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Middleware**: CORS, Body-parser, Multer
- **Frontend**: HTML, CSS, JavaScript

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/stress-management-system.git
   cd stress-management-system
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start MongoDB** (if not running already):
   ```bash
   mongod --dbpath /your/db/path
   ```
4. **Run the server**:
   ```bash
   node server.js
   ```
5. Open your browser and go to `http://localhost:5000`.


## Folder Structure
```
📂 stress-management-system
├── 📂 uploads          # Stores uploaded audio files
├── 📜 html.html        # Frontend HTML
├── 📜 server.js        # Main backend file
├── 📜 package.json     # Dependencies and scripts
└── 📜 README.md        # Documentation
```

## Future Enhancements
- **AI-based Stress Analysis**
- **Integration with Wearable Devices**
- **Mobile App Development**

## License
This project is licensed under the MIT License.

