const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const csvFilePath = path.join(__dirname, 'users.csv');
const logFilePath = path.join(__dirname, 'registration.log'); 

// Initialize counter based on existing entries in users.csv
let userCounter = 0;

// Queue to manage simultaneous requests
const requestQueue = [];
let isProcessing = false;

// Read existing entries in users.csv to initialize the counter
const rl = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    crlfDelay: Infinity,
});

rl.on('line', () => {
    // Increment the counter for each line (assuming each line represents a user)
    userCounter++;
});

rl.on('close', () => {
    console.log(`Initialized userCounter to ${userCounter} based on existing entries in users.csv`);
});

// Function to write registration attempts to the log file
function writeToLog(timestamp, userId) {
    const logEntry = `${timestamp.toISOString()} - ID: ${userId}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}



app.post('/register', async (req, res) => {
    const timestamp = new Date();
    const currentDate = new Date().toLocaleDateString(); 
    const currentTimestamp = new Date().toISOString()
    const userId = userCounter;
    writeToLog(timestamp, userId);

    const { username, email, region, place, role, language, gender, age, school } = req.body;

    // Format data as CSV
    const userData = `${username},${email},${region}, ${place}, ${role},${language},${gender},${age},${school}, ${currentDate}, ${currentTimestamp}\n`;

    // Enqueue the request
    requestQueue.push({ userData, res });

    // Process the queue if not already processing
    processQueue();
});

function processQueue() {
    // If already processing or the queue is empty, return
    if (isProcessing || requestQueue.length === 0) {
        return;
    }

    // Mark as processing
    isProcessing = true;

    // Dequeue the request
    const { userData, res } = requestQueue.shift();

    // Save data to CSV file
    fs.appendFile(csvFilePath, userData, (err) => {
        if (err) {
            console.error('Error saving data:', err);
            res.status(500).send('Error saving data');
        } else {
            console.log('Data saved to users.csv');
            res.redirect('/index.html');
        }

        // Mark as not processing
        isProcessing = false;

        // Process the next request in the queue
        processQueue();

        userCounter++;
    });
}

// Counter endpoint
app.get('/counter', (req, res) => {
    res.json({ userCounter });
});

// Redirect route for success
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
