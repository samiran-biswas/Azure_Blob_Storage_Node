// PdfViewer.js
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';

const PdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(
    'https://esignpdfs.blob.core.windows.net/pdf-esign/1696228353084-laptop-agreement-1696228352863.pdf'
  );

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };



  const fetchPdf = async () => {
    try {
      // Change the URL to your Node.js server endpoint
      const response = await axios.get('/api/getPdf', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };
  
//   const fetchPdf = async () => {
//     try {
//       const response = await axios.get(pdfUrl, { responseType: 'blob' });
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);
//     } catch (error) {
//       console.error('Error fetching PDF:', error);
//     }
//   };

  return (
    <div>
      <button onClick={fetchPdf}>Load PDF</button>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default PdfViewer;
