const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const csvFilePath = path.join(__dirname, 'cleaned_data.csv');

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

app.post('/register', async (req, res) => {
    const { username, email, region, place, role, language, gender, age, school } = req.body;

    // Format data as CSV
    const userData = `${username},${email},${region}, ${place}, ${role},${language},${gender},${age},${school}\n`;

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

// Endpoint to get data for the bar chart
app.get('/barChartData', (req, res) => {
    // Read the users.csv file
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.csv:', err);
            res.status(500).send('Error reading data');
            return;
        }

        // Parse CSV data
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const regionIndex = headers.indexOf('region');
        // console.log(regionIndex)

        // Count occurrences of each region
        const regionCounts = {};
        for (let i = 1; i < lines.length - 1; i++) {
            const values = lines[i].split(',');
            // console.log(values[regionIndex])
            // console.log(i)
            const region = values[regionIndex].trim();
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        }

        // Prepare data for the bar chart
        const labels = Object.keys(regionCounts);
        const chartData = Object.values(regionCounts);

        const barChartData = {
            labels: labels,
            datasets: [{
                label: '',
                data: chartData,
                backgroundColor: 'rgba(27, 172, 187, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        res.json(barChartData);
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
