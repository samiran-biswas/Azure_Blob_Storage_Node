// In your Node.js server file
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // or any port you prefer

app.get('/api/getPdf', async (req, res) => {
  try {
    // Fetch the PDF from the original source
    const pdfUrl = 'https://esignpdfs.blob.core.windows.net/pdf-esign/1696228353084-laptop-agreement-1696228352863.pdf';
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    
    // Set the appropriate headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
