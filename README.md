# This repository containts the files for the HoC2023 KZ site

The site features a counter that gets updated regularly.
Database is implemented as a .csv file for simplicity. Backend passes data to this .csv file and it gets saved there. For better security and data-saving measures,file access is done through an asynchronous queue.

- server.js is the main backend files
