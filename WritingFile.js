const fs = require('fs');
const path = require('path');

// File path
const filePath = path.join(__dirname, 'example.txt');

// Data to write
const data = Buffer.from('Hello, world!');

// Byte offset
const offset = 5;

// Open the file
fs.open(filePath, 'r+', (err, fd) => {
  if (err) {
    console.error('Failed to open file:', err);
    return;
  }

  // Write the data at the specified offset
  fs.write(fd, data, 0, data.length, offset, (err, written, buffer) => {
    if (err) {
      console.error('Failed to write to file:', err);
      return;
    }

    console.log(`Wrote ${written} bytes to the file`);

    // Close the file
    fs.close(fd, (err) => {
      if (err) {
        console.error('Failed to close file:', err);
      } else {
        console.log('File closed successfully');
      }
    });
  });
});
