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

// Initialize counter based on existing entries in users.csv
let userCounter = 0;

// Read existing entries in users.csv to initialize the counter
const rl = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    crlfDelay: Infinity,
});

rl.on('line', (line) => {
    // Increment the counter for each line (assuming each line represents a user)
    userCounter++;
});

rl.on('close', () => {
    console.log(`Initialized userCounter to ${userCounter} based on existing entries in users.csv`);
});

app.post('/register', async (req, res) => {
    const { username, email, city } = req.body;

    // Format data as CSV
    const userData = `${username},${email},${city}\n`;

    // Save data to CSV file
    fs.appendFile(csvFilePath, userData, (err) => {
        if (err) throw err;
        console.log('saved to users.csv');

        // Increment the counter
        userCounter++;

        // Send a response
        res.redirect('/index.html');
    });

});

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
