

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } = require('@azure/storage-blob');
const cors = require('cors');

const app = express();
const port = 4000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/AzurePdfLinks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const pdfSchema = new mongoose.Schema({
  filename: String,
  downloadLink: String,
});

const PdfModel = mongoose.model('Pdf', pdfSchema);

// Azure Storage configuration
const accountName = 'esignpdfs';
const accountKey = 'Bcsr0XLYS8/9ZdMtzT2KMdk8tOTHKwc+ST/kuib6+GFk81DJvmy6rMDQNMLVZV0X15P/U7oSL169+AStVydeIg=='; // Replace with your actual account key
// const containerName = 'pdf-esign';
// const containerName = 'esignc';
// const unsignedContainerName = 'pdf-esign';
// const signedContainerName = 'esignc';

const regularContainerName = 'pdf-esign';  // Change this to your regular container name
const signedContainerName = 'esignc';



const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
// const containerClient = blobServiceClient.getContainerClient(containerName);





const containerClientRegular = blobServiceClient.getContainerClient(regularContainerName);
const containerClientSigned = blobServiceClient.getContainerClient(signedContainerName);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Enable CORS
app.use(cors());
// Enable CORS
app.use(cors({
  origin: '*', // You may want to restrict this to a specific origin in a production environment
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "edutestmail12@gmail.com",
    pass: "wwau cpvr elxw gesc",
  },
});

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const blobName = `${Date.now()}-${req.file.originalname}`;
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blockBlobClient = containerClientRegular.getBlockBlobClient(blobName);
    await blockBlobClient.upload(req.file.buffer, req.file.size);

    // Generate SAS token for the blob
    const expiresOn = new Date(Date.now() + 3600 * 1000); // 1 hour validity
    const permissions = BlobSASPermissions.parse('r');
    const sasToken = generateBlobSASQueryParameters(
      {
       
        // containerName: containerClient.containerName,
        containerName: containerClientRegular.containerName,
        blobName: blobName,
        permissions,
        startsOn: new Date(),
        expiresOn: expiresOn,
        protocol: SASProtocol.HttpsAndHttp,
        ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
        contentType: 'application/octet-stream',
      },
      sharedKeyCredential
    ).toString();

    const url = `${blockBlobClient.url}?${sasToken}`;

    // Save the download link in the database
    const pdfRecord = new PdfModel({
      filename: blobName,
      downloadLink: url,
    });
    await pdfRecord.save();

    // Send email with download link
    const email = 'samiranb806@gmail.com';  // Replace with the recipient's email
    const mailOptions = {
      from: 'edutestmail12@gmail.com',
      to: email,
      subject: 'Download Link for PDF',
      text: `Click the link to download the PDF: ${url}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------signed pdf------
// ... (previous code)

app.post('/saveSignedPdf', upload.single('signedPdf'), async (req, res) => {
  try {
    const blobName = `${Date.now()}-signed-document.pdf`;
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // await blockBlobClient.upload(req.file.buffer, req.file.size);
    const blockBlobClient = containerClientSigned.getBlockBlobClient(blobName);
    await blockBlobClient.upload(req.file.buffer, req.file.size);
    // Generate SAS token for the blob
    const expiresOn = new Date(Date.now() + 3600 * 1000); // 1 hour validity
    const permissions = BlobSASPermissions.parse('r');
    const sasToken = generateBlobSASQueryParameters(
      {
        // containerName: containerClient.containerName,
        containerName: containerClientSigned.containerName,
        blobName: blobName,
        permissions,
        startsOn: new Date(),
        expiresOn: expiresOn,
        protocol: SASProtocol.HttpsAndHttp,
        ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
        contentType: 'application/pdf',
      },
      sharedKeyCredential
    ).toString();

    const url = `${blockBlobClient.url}?${sasToken}`;
    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// --------------------------

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});





















// const express = require('express');
// const multer = require('multer');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } = require('@azure/storage-blob');
// const cors = require('cors');

// const app = express();
// const port = 4000;

// // MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/AzurePdfLinks', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// const pdfSchema = new mongoose.Schema({
//   filename: String,
//   downloadLink: String,
// });

// const PdfModel = mongoose.model('Pdf', pdfSchema);

// // Azure Storage configuration
// const accountName = 'esignpdfs';
// const accountKey = 'Bcsr0XLYS8/9ZdMtzT2KMdk8tOTHKwc+ST/kuib6+GFk81DJvmy6rMDQNMLVZV0X15P/U7oSL169+AStVydeIg=='; // Replace with your actual account key
// const containerName = 'pdf-esign';
// // const containerName = 'esignc';

// const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
// const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
// const containerClient = blobServiceClient.getContainerClient(containerName);






// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Enable CORS
// app.use(cors());
// // Enable CORS
// app.use(cors({
//   origin: '*', // You may want to restrict this to a specific origin in a production environment
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// }));
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "edutestmail12@gmail.com",
//     pass: "wwau cpvr elxw gesc",
//   },
// });

// app.post('/upload', upload.single('pdf'), async (req, res) => {
//   try {
//     const blobName = `${Date.now()}-${req.file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(req.file.buffer, req.file.size);

//     // Generate SAS token for the blob
//     const expiresOn = new Date(Date.now() + 3600 * 1000); // 1 hour validity
//     const permissions = BlobSASPermissions.parse('r');
//     const sasToken = generateBlobSASQueryParameters(
//       {
//         containerName: containerClient.containerName,
//         blobName: blobName,
//         permissions,
//         startsOn: new Date(),
//         expiresOn: expiresOn,
//         protocol: SASProtocol.HttpsAndHttp,
//         ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
//         contentType: 'application/octet-stream',
//       },
//       sharedKeyCredential
//     ).toString();

//     const url = `${blockBlobClient.url}?${sasToken}`;

//     // Save the download link in the database
//     const pdfRecord = new PdfModel({
//       filename: blobName,
//       downloadLink: url,
//     });
//     await pdfRecord.save();

//     // Send email with download link
//     const email = 'samiranb806@gmail.com';  // Replace with the recipient's email
//     const mailOptions = {
//       from: 'edutestmail12@gmail.com',
//       to: email,
//       subject: 'Download Link for PDF',
//       text: `Click the link to download the PDF: ${url}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.json({ url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });





// --------------------

// -----------------------








// app.get('/api/getPdf', async (req, res) => {
//   try {
//     // Fetch the PDF from the original source
//     const pdfUrl = 'https://esignpdfs.blob.core.windows.net/pdf-esign/1696228353084-laptop-agreement-1696228352863.pdf';
//     const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    
//     // Set the appropriate headers for CORS
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(Buffer.from(response.data, 'binary'));
//   } catch (error) {
//     console.error('Error fetching PDF:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// ------------------------------------------------
// // server.js
// const express = require('express');
// const multer = require('multer');
// const nodemailer = require('nodemailer');
// const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } = require('@azure/storage-blob');
// const cors = require('cors');

// const app = express();
// const port = 4000;

// const accountName = 'esignpdfs';
// const accountKey = 'Bcsr0XLYS8/9ZdMtzT2KMdk8tOTHKwc+ST/kuib6+GFk81DJvmy6rMDQNMLVZV0X15P/U7oSL169+AStVydeIg=='; // Replace with your actual account key
// const containerName = 'pdf-esign';

// const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
// const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Enable CORS
// app.use(cors());
// app.use(express.json());

// app.post('/upload', upload.single('pdf'), async (req, res) => {
//   try {
//     const { email, name } = req.body;

//     if (!email || !name) {
//       return res.status(400).json({ error: 'Email and name are required' });
//     }

//     const blobName = `${email}-${Date.now()}-${name}-${req.file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(req.file.buffer, req.file.size);

//     // Generate SAS token for the blob
//     const expiresOn = new Date(Date.now() + 3600 * 1000); // 1 hour validity
//     const permissions = BlobSASPermissions.parse('r');
//     const sasToken = generateBlobSASQueryParameters(
//       {
//         containerName: containerClient.containerName,
//         blobName: blobName,
//         permissions,
//         startsOn: new Date(),
//         expiresOn: expiresOn,
//         protocol: SASProtocol.HttpsAndHttp,
//         ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
//       },
//       sharedKeyCredential
//     ).toString();

//     const url = `${blockBlobClient.url}?${sasToken}`;

//     // Send email with the link
//     await sendEmail(email, url);

//     res.json({ message: 'PDF uploaded and link sent to email' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// async function sendEmail(email, pdfLink) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // Use a valid email service provider like Gmail, Outlook, etc.
//     auth: {
//       user: "edutestmail12@gmail.com", // Your email address
//       pass: "wwau cpvr elxw gesc", // Your email password
//     },
//   });

//   const mailOptions = {
//     from: 'edutestmail12@gmail.com',
//     to: email,
//     subject: 'PDF Link',
//     text: `Here is your PDF link: ${pdfLink}`,
//   };

//   await transporter.sendMail(mailOptions);
// }

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });







// ---------------------------Azure Connection Successfully Done-----------------------------------------
// // server.js
// const express = require('express');
// const multer = require('multer');
// const nodemailer = require('nodemailer');
// const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } = require('@azure/storage-blob');
// const cors = require('cors');

// const app = express();
// const port = 4000;

// const accountName = 'esignpdfs';
// const accountKey = 'Bcsr0XLYS8/9ZdMtzT2KMdk8tOTHKwc+ST/kuib6+GFk81DJvmy6rMDQNMLVZV0X15P/U7oSL169+AStVydeIg=='; // Replace with your actual account key
// const containerName = 'pdf-esign';

// const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
// const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Enable CORS
// app.use(cors());

// const transporter = nodemailer.createTransport({
//   service: "gmail", // Use a valid email service provider like Gmail, Outlook, etc.
//     auth: {
//       user: "edutestmail12@gmail.com", // Your email address
//       pass: "wwau cpvr elxw gesc", // Your email password
//     },
// });


// app.post('/upload', upload.single('pdf'), async (req, res) => {
//   try {
//     const blobName = `${Date.now()}-${req.file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(req.file.buffer, req.file.size);

//     // Generate SAS token for the blob
//     const expiresOn = new Date(Date.now() + 3600 * 1000); // 1 hour validity
//     const permissions = BlobSASPermissions.parse('r');
//     const sasToken = generateBlobSASQueryParameters(
//       {
//         containerName: containerClient.containerName,
//         blobName: blobName,
//         permissions,
//         startsOn: new Date(),
//         expiresOn: expiresOn,
//         protocol: SASProtocol.HttpsAndHttp,
//         ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
//       },
//       sharedKeyCredential
//     ).toString();

//     const url = `${blockBlobClient.url}?${sasToken}`;




//     // Send email with download link
//     const email = 'samiranb806@gmail.com';  // Replace with the recipient's email
//     const mailOptions = {
//       from: 'edutestmail12@gmail.com',  // Replace with your email
//       to: email,
//       subject: 'Download Link for PDF',
//       text: `Click the link to download the PDF: ${url}`,
//     };

//     await transporter.sendMail(mailOptions);





//     res.json({ url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


// ---------------------------------------------------------------------------------------------------

















// // server.js
// const express = require('express');
// const multer = require('multer');
// const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
// const cors = require('cors');

// const app = express();
// const port = 4000;

// const accountName = 'esignpdfs';
// const accountKey = 'Bcsr0XLYS8/9ZdMtzT2KMdk8tOTHKwc+ST/kuib6+GFk81DJvmy6rMDQNMLVZV0X15P/U7oSL169+AStVydeIg=='; // Replace with your actual account key
// const containerName = 'pdf-esign';

// const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
// const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Enable CORS
// app.use(cors());

// app.post('/upload', upload.single('pdf'), async (req, res) => {
//   try {
//     const blobName = `${Date.now()}-${req.file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(req.file.buffer, req.file.size);

//     // Generate SAS token for the blob
//     const sasToken = await blockBlobClient.generateSasUrl({
//       permissions: 'r', // 'r' for read access
//       expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour validity
//     });

//     const url = `${blockBlobClient.url}?${sasToken}`;
//     res.json({ url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });











// // server.js
// const express = require('express');
// const multer = require('multer');
// const { BlobServiceClient } = require('@azure/storage-blob');
// const cors = require('cors');

// const app = express();
// const port = 4000;

// const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=esignpdfs;AccountKey=Bcsr0XLYS8/9ZdMtzT2KMdk8tOTHKwc+ST/kuib6+GFk81DJvmy6rMDQNMLVZV0X15P/U7oSL169+AStVydeIg==;EndpointSuffix=core.windows.net';
// const containerName = 'pdf-esign';

// const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Enable CORS
// app.use(cors());

// app.post('/upload', upload.single('pdf'), async (req, res) => {
//   try {
//     const blobName = `${Date.now()}-${req.file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(req.file.buffer, req.file.size);

//     const url = blockBlobClient.url;
//     res.json({ url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
