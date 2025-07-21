#!/usr/bin/env node
// This is a Node.js script to read the DXF version code from a file.
const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node read-dxf-version.js <path-to-dxf-file>');
  process.exit(1);
}

try {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  let data = '';
  stream.on('data', chunk => {
    data += chunk;
    const split = data.split(/\r?\n/);
    if (split.length > 40) {
      stream.close();
      const first40 = split.slice(0, 40);
      const versionLine = first40.find(line => /^AC\d{4}/.test(line.trim()));
      if (versionLine) {
        console.log('DXF version code:', versionLine.trim());
      } else {
        console.log('DXF version code not found in first 40 lines.');
      }
    }
  });
  stream.on('close', () => {
    if (!data) {
      console.log('File is empty or could not be read.');
    }
  });
  stream.on('error', err => {
    console.error('Error reading file:', err.message);
  });
} catch (err) {
  console.error('Error:', err.message);
} 