const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const { googleAuth } = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

async function uploadFile(filePath, folderId) {
  const auth = await authorize();

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: generateFileName(), // Implement a function to generate the file name
    parents: [folderId],
  };

  const media = {
    mimeType: 'application/csv',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  console.log('File ID:', response.data.id);
}

function authorize() {
  const credentials = require('path/to/your/credentials.json');

  const { client_email, private_key } = credentials;
  const auth = new googleAuth();
  const jwtClient = new auth.JWT({
    email: client_email,
    key: private_key,
    scopes: SCOPES,
  });

  return jwtClient.authorize();
}

function generateFileName() {
  // Implement a function to generate the file name based on the date and time
  const now = new Date();
  const formattedDate = `${now.toLocaleString('default', { month: 'short' })}${now.getDate()}_${now.getHours()}`;
  return `${formattedDate}.csv`;
}

// Provide the path to your users.csv file and the ID of the Google Drive folder
const csvFilePath = 'path/to/your/users.csv';
const driveFolderId = 'yourGoogleDriveFolderId';

uploadFile(csvFilePath, driveFolderId);
