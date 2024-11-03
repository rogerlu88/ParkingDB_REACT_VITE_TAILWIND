import dotenv from 'dotenv'; 
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors'; // Added CORS import

// Load environment variables from .env file
dotenv.config();
console.log('Environment variables loaded');

// Get current directory for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Current directory:', __dirname);

// MongoDB connection URI
const uri = `mongodb+srv://${encodeURIComponent(process.env.VITE_MONGO_USER)}:${encodeURIComponent(process.env.VITE_MONGO_PASSWORD)}@cluster0.h907f.mongodb.net/myDatabase?retryWrites=true&w=majority`;

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });

const dbName = 'myDatabase';
const collectionName = 'parking_zones';

const app = express();

// Added CORS middleware to allow cross-origin requests
app.use(cors()); // Allows all origins
// For more restrictive control, use: app.use(cors({ origin: 'http://localhost:5173' }));

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));
console.log('Serving static files from:', path.join(__dirname, 'public'));

// Added root route for confirmation
app.get('/', (req, res) => {
    res.send('Server is running and ready to handle requests.');
});

app.post('/upload', upload.single('csvFile'), async (req, res) => {
    console.log('Received file upload request');
    const filePath = req.file.path;
    console.log('File path:', filePath);
    let results = [];

    try {
        console.log('Starting to read CSV file...');
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                console.log('Read row:', data);
                results.push(data);
            })
            .on('end', async () => {
                console.log('Finished reading CSV file');
                try {
                    const db = mongoose.connection;
                    const collection = db.collection(collectionName);
                    console.log('Inserting data into MongoDB...');
                    await collection.insertMany(results);
                    console.log('Data inserted successfully');
                    res.json({ message: 'CSV file uploaded and data stored in MongoDB successfully!' });
                } catch (err) {
                    console.error("Failed to store data in MongoDB:", err);
                    res.status(500).json({ message: 'Failed to store data in MongoDB', error: err });
                }
                fs.unlinkSync(filePath);
                console.log('Temporary CSV file deleted');
            });
    } catch (error) {
        console.error('Error processing the CSV file:', error);
        res.status(500).json({ message: 'Error processing the CSV file', error: error });
    }
});

app.get('/data', async (req, res) => {
    console.log('Received request to fetch data');
    try {
        const db = mongoose.connection;
        const collection = db.collection(collectionName);
        console.log('Fetching data from MongoDB...');
        const data = await collection.find().toArray();
        console.log('Data fetched:', data);
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ message: 'Failed to fetch data', error: error });
    }
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
