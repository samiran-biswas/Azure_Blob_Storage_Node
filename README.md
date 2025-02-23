# 📂 File Upload & Storage with Azure Blob Storage (Node.js + React.js)  

## 🚀 Overview  
This project demonstrates **file upload and retrieval** using **Node.js**, **Express.js**, and **Azure Blob Storage**, with a **React.js frontend** to handle file uploads and display links. Additionally, the project integrates **MongoDB** to store file metadata and **Nodemailer** to send download links via email.

---

## 🛠 Tech Stack  
### **Backend (Node.js + Express.js)**  
- **Multer**: Handles file uploads.  
- **Azure Blob Storage SDK**: Stores and retrieves files.  
- **Mongoose**: Stores file metadata in MongoDB.  
- **Nodemailer**: Sends emails with download links.  
- **CORS**: Enables cross-origin requests.  

### **Frontend (React.js)**  
- **Axios**: Handles API requests.  
- **React Hooks**: Manages component state.  
- **Bootstrap/Material UI**: UI styling (optional).  

---

## ⚙️ Features  
✅ **Upload PDFs/Images to Azure Blob Storage**  
✅ **Generate secure download links with SAS token**  
✅ **Store file metadata in MongoDB**  
✅ **Send download links via email using Nodemailer**  
✅ **Retrieve and list uploaded files in React.js frontend**  

---

## 📦 Backend Setup (Node.js + Express)  

### 1️⃣ **Clone Repository**  

git clone https://github.com/your-repo-name.git
cd Azure_Blob_Storage_Node
2️⃣ Install Dependencies

npm install express multer mongoose nodemailer cors dotenv @azure/storage-blob
3️⃣ Set Up MongoDB
Ensure you have MongoDB running. If using MongoDB Atlas, get your connection string.
Modify server.js to use your database:


mongoose.connect('mongodb://127.0.0.1:27017/AzurePdfLinks', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
4️⃣ Configure Azure Storage
Update .env with your Azure account details:

env

AZURE_STORAGE_ACCOUNT=your_account_name
AZURE_STORAGE_ACCESS_KEY=your_account_key
AZURE_CONTAINER_NAME=pdf-esign
AZURE_SIGNED_CONTAINER=esignc
5️⃣ Start the Server

node server.js
Your backend should now be running on http://localhost:4000 🎉

🎨 Frontend Setup (React.js)
1️⃣ Create a React App

npx create-react-app azure-file-upload
cd azure-file-upload
npm install axios
2️⃣ Upload File Component (UploadFile.js)
javascript
Copy
Edit
import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadedUrl(response.data.url);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
      {uploadedUrl && <p>File uploaded: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">Download</a></p>}
    </div>
  );
};

export default UploadFile;
3️⃣ Integrate Component in App.js
javascript
Copy
Edit
import React from 'react';
import UploadFile from './UploadFile';

function App() {
  return (
    <div>
      <h1>Upload Files to Azure Blob Storage</h1>
      <UploadFile />
    </div>
  );
}

export default App;
4️⃣ Run the React App

npm start
Visit http://localhost:3000 and upload files! 🚀

📩 Email Notification Setup
To send email notifications with download links, update your server.js with:

javascript
Copy
Edit
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password",
  },
});
Then, modify the /upload route to send an email:

javascript
Copy
Edit
const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'recipient-email@example.com',
  subject: 'Download Link for PDF',
  text: `Click the link to download: ${url}`,
};
await transporter.sendMail(mailOptions);
Note: Use an App Password instead of your real email password.

🔥 API Endpoints
Method	Endpoint	Description
POST	/upload	Upload a file to Azure Blob
POST	/saveSignedPdf	Upload signed PDF to Azure Blob
🚀 Deployment
To deploy your Node.js backend, use:

Render / Heroku / AWS EC2
Ensure MongoDB Atlas is configured
Set environment variables in .env
For React frontend, deploy using:

Netlify / Vercel / Firebase Hosting
🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

📞 Contact

LinkedIn: linkedin.com/in/samiran-biswas
🎯 Let's build something awesome together! 🚀


This README provides a clear **setup guide**, **code snippets**, and **API documentation** to help others understand and use your project. Let me know if you need any modifications! 🚀
