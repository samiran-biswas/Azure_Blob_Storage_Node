import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import jsPDF from 'jspdf';

import './FileUpload.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [url, setUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSignatureChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const onUpload = async () => {
    try {
      if (!file) {
        setError('No file selected!');
        return;
      }

      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('pdf', file);

      if (signature) {
        formData.append('signature', signature);
      }

      const response = await axios.post('http://localhost:4000/upload', formData);
      setUrl(response.data.url);
    } catch (error) {
      console.error(error);
      setError('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDownload = async () => {
    try {
      if (!url) {
        console.error('URL is not initialized.');
        return;
      }
  
      const pdfDoc = new jsPDF({ format: 'a4' });
  
      for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
        const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);
  
        // Calculate scale factor to fit the PDF page
        const scaleFactor = pdfDoc.internal.pageSize.width / canvas.width;
  
        // Add a new page if not the first page
        if (pageIndex > 1) {
          pdfDoc.addPage();
        }
  
        // Add the current page as an image to the center of the PDF
        pdfDoc.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          (pdfDoc.internal.pageSize.width - canvas.width * scaleFactor) / 2,
          (pdfDoc.internal.pageSize.height - canvas.height * scaleFactor) / 2,
          canvas.width * scaleFactor,
          canvas.height * scaleFactor
        );
  
        // Add signature image if available
        if (signature) {
          const signatureImgData = await fetch(URL.createObjectURL(signature)).then((res) => res.blob());
          const signatureBlob = await signatureImgData.arrayBuffer();
          const signatureImg = new Uint8Array(signatureBlob);
  
          // Calculate position for signature in the bottom right corner
          const signatureX = pdfDoc.internal.pageSize.width - 60;
          const signatureY = pdfDoc.internal.pageSize.height - 30;
  
          // Add the signature image to the PDF
          pdfDoc.addImage(signatureImg, 'PNG', signatureX, signatureY, 50, 20); // Adjust the size as needed
        }
      }
  
      // Save the combined PDF with signature images
      pdfDoc.save('signed_document.pdf');
    } catch (error) {
      console.error(error);
    }
  };
  
  // ------------------signed pdf------
  const onSaveSignedPdf = async () => {
    try {
      if (!url) {
        console.error('URL is not initialized.');
        return;
      }
  
      // const pdfDoc = new jsPDF({ format: 'a4' });
  
      // for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
      //   // Add a new page if not the first page

      //   if (pageIndex > 1) {
      //     pdfDoc.addPage();
      //   }
      //   const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);

      //         // Add the current page as an image to the PDF
      //         const imgData = canvas.toDataURL('image/png');
      //         pdfDoc.addImage(imgData, 'PNG', 0, 0);
  
      //   // // Get the canvas for the current page
      //   // const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);
  
      //   // // Calculate scale factor to fit the PDF page
      //   // const scaleFactor = pdfDoc.internal.pageSize.width / canvas.width;
  
      //   // // Add the current page as an image to the PDF, scaling to fit A4 size
      //   // pdfDoc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfDoc.internal.pageSize.width, canvas.height * scaleFactor);
  
      //   // Add signature image if available
      //   if (signature) {
      //     const signatureImgData = await fetch(URL.createObjectURL(signature)).then((res) => res.blob());
      //     const signatureBlob = await signatureImgData.arrayBuffer();
      //     const signatureImg = new Uint8Array(signatureBlob);
  
      //     // Calculate position for signature in the bottom right corner
      //     const signatureX = pdfDoc.internal.pageSize.width - 60;
      //     const signatureY = pdfDoc.internal.pageSize.height - 30;
  
      //     // Add the signature image to the PDF
      //     pdfDoc.addImage(signatureImg, 'PNG', signatureX, signatureY, 50, 20); // Adjust the size as needed
      //   }
      // }
      const pdfDoc = new jsPDF({ format: 'a4' });
  
      for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
        const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);
  
        // Calculate scale factor to fit the PDF page
        const scaleFactor = pdfDoc.internal.pageSize.width / canvas.width;
  
        // Add a new page if not the first page
        if (pageIndex > 1) {
          pdfDoc.addPage();
        }
  
        // Add the current page as an image to the center of the PDF
        pdfDoc.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          (pdfDoc.internal.pageSize.width - canvas.width * scaleFactor) / 2,
          (pdfDoc.internal.pageSize.height - canvas.height * scaleFactor) / 2,
          canvas.width * scaleFactor,
          canvas.height * scaleFactor
        );
  
        // Add signature image if available
        if (signature) {
          const signatureImgData = await fetch(URL.createObjectURL(signature)).then((res) => res.blob());
          const signatureBlob = await signatureImgData.arrayBuffer();
          const signatureImg = new Uint8Array(signatureBlob);
  
          // Calculate position for signature in the bottom right corner
          const signatureX = pdfDoc.internal.pageSize.width - 60;
          const signatureY = pdfDoc.internal.pageSize.height - 30;
  
          // Add the signature image to the PDF
          pdfDoc.addImage(signatureImg, 'PNG', signatureX, signatureY, 50, 20); // Adjust the size as needed
        }
      }
      // Save the signed PDF to Azure Blob Storage
      const formData = new FormData();
      formData.append('signedPdf', new Blob([pdfDoc.output('blob')], { type: 'application/pdf' }));
  
      const response = await axios.post('http://localhost:4000/saveSignedPdf', formData);
      console.log('Signed PDF saved successfully:', response.data.url);
    } catch (error) {
      console.error(error);
    }
  };
 
  // --------------------

  return (

    <div>
      <input type="file" onChange={onFileChange} />
      <input type="file" onChange={onSignatureChange} />
      <button onClick={onUpload} disabled={loading}>
        Upload
      </button>
      <button onClick={onDownload} disabled={!url}>
        Download
      </button>


      <button onClick={onSaveSignedPdf} disabled={!url || !signature}>
        Save Signed Pdf
      </button>
      

    <div>
      <div className="pdf-container">
        {loading && <p>Uploading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {url && (
          <div className="pdf-viewer">
            <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
              {[...Array(numPages)].map((_, index) => (
                <div key={`page_${index + 1}`} className="pdf-page">
                  <Page pageNumber={index + 1} />
                  {signature && (
                    <img
                      className="signature-image"
                      src={URL.createObjectURL(signature)}
                      alt="Signature"
                    />
                  )}
                </div>
              ))}
            </Document>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default FileUpload;




   
  // const onSaveSignedPdf = async () => {
  //   try {
  //     if (!url) {
  //       console.error('URL is not initialized.');
  //       return;
  //     }

  //     const pdfDoc = new jsPDF();

  //     for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
  //       // Get the canvas for the current page
  //       const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);

  //       // Add the current page as an image to the PDF
  //       const imgData = canvas.toDataURL('image/png');
  //       pdfDoc.addImage(imgData, 'PNG', 0, 0);

  //       // Add signature image if available
  //       if (signature) {
  //         const signatureImgData = await fetch(URL.createObjectURL(signature)).then((res) => res.blob());
  //         const signatureBlob = await signatureImgData.arrayBuffer();
  //         const signatureImg = new Uint8Array(signatureBlob);
  //         pdfDoc.addImage(signatureImg, 'PNG', 10, 10, 50, 20); // Adjust the position and size
  //       }

  //       // Add a new page if not the last page
  //       if (pageIndex < numPages) {
  //         pdfDoc.addPage();
  //       }
  //     }

  //     // Save the signed PDF to Azure Blob Storage
  //     const formData = new FormData();
  //     formData.append('signedPdf', new Blob([pdfDoc.output('blob')], { type: 'application/pdf' }));

  //     const response = await axios.post('http://localhost:4000/saveSignedPdf', formData);
  //     console.log('Signed PDF saved successfully:', response.data.url);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const onDownload = async () => {
  //   try {
  //     if (!url) {
  //       console.error('URL is not initialized.');
  //       return;
  //     }
  
  //     const pdfDoc = new jsPDF({ format: 'a4' });
  
  //     for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
  //       // Add a new page if not the first page
  //       if (pageIndex > 1) {
  //         pdfDoc.addPage();
  //       }
  
  //       const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);
  
  //       // Calculate scale factor to fit the PDF page
  //       const scaleFactor = pdfDoc.internal.pageSize.width / canvas.width;
  
  //       // Add the current page as an image to the center of the PDF
  //       pdfDoc.addImage(
  //         canvas.toDataURL('image/png'),
  //         'PNG',
  //         (pdfDoc.internal.pageSize.width - canvas.width * scaleFactor) / 2,
  //         (pdfDoc.internal.pageSize.height - canvas.height * scaleFactor) / 2,
  //         canvas.width * scaleFactor,
  //         canvas.height * scaleFactor
  //       );
  
  //       // Add signature image if available
  //       if (signature) {
  //         const signatureImgData = await fetch(URL.createObjectURL(signature)).then((res) => res.blob());
  //         const signatureBlob = await signatureImgData.arrayBuffer();
  //         const signatureImg = new Uint8Array(signatureBlob);
  
  //         // Calculate position for signature in the bottom right corner
  //         const signatureX = pdfDoc.internal.pageSize.width - 60;
  //         const signatureY = pdfDoc.internal.pageSize.height - 30;
  
  //         // Add the signature image to the PDF
  //         pdfDoc.addImage(signatureImg, 'PNG', signatureX, signatureY, 50, 20); // Adjust the size as needed
  //       }
  //     }
  
  //     // Save the combined PDF with signature images
  //     pdfDoc.save('signed_document.pdf');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  // const onDownload = async () => {
  //   try {
  //     if (!url) {
  //       console.error('URL is not initialized.');
  //       return;
  //     }
  
  //     const pdfDoc = new jsPDF({ format: 'a4' });
  
  //     for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
  //       // Add a new page if not the first page
  //       if (pageIndex > 1) {
  //         pdfDoc.addPage();
  //       }
  
  //       const canvas = document.querySelector(`.pdf-viewer .pdf-page:nth-child(${pageIndex}) canvas`);

  //       // Add the current page as an image to the PDF
  //       const imgData = canvas.toDataURL('image/png');
  //       pdfDoc.addImage(imgData, 'PNG', 0, 0);
  //       // const response = await axios.get(url, {
  //       //   responseType: 'blob',
  //       //   headers: { 'Content-Type': 'application/octet-stream' },
  //       // });
  
  //       // // Create a blob from the response
  //       // const blob = new Blob([response.data], { type: 'application/pdf' });
  
  //       // // Add the downloaded page as an image to the PDF
  //       // pdfDoc.addImage(URL.createObjectURL(blob), 'JPEG', 0, 0, pdfDoc.internal.pageSize.width, pdfDoc.internal.pageSize.height);
  
  //       // Add signature image if available
  //       if (signature) {
  //         const signatureImgData = await fetch(URL.createObjectURL(signature)).then((res) => res.blob());
  //         const signatureBlob = await signatureImgData.arrayBuffer();
  //         const signatureImg = new Uint8Array(signatureBlob);
  
  //         // Calculate position for signature in the bottom right corner
  //         const signatureX = pdfDoc.internal.pageSize.width - 60;
  //         const signatureY = pdfDoc.internal.pageSize.height - 30;
  
  //         // Add the signature image to the PDF
  //         pdfDoc.addImage(signatureImg, 'PNG', signatureX, signatureY, 50, 20); // Adjust the size as needed
  //       }
  //     }
  
  //     // Save the combined PDF with signature images
  //     pdfDoc.save('signed_document.pdf');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  // const onDownload = async () => {
  //   try {
  //     if (!url) {
  //       console.error('URL is not initialized.');
  //       return;
  //     }

  //     const response = await axios.get(url, {
  //       responseType: 'blob', // Important for handling binary data
  //       headers: { 'Content-Type': 'application/octet-stream' },
  //     });

  //     // Create a blob from the response and initiate a download
  //     const blob = new Blob([response.data], { type: 'application/pdf' });
  //     const downloadUrl = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = downloadUrl;
  //     a.download = 'signed_document.pdf';
  //     a.click();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
// -----------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';
// import jsPDF from 'jspdf';

// import './FileUpload.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [signature, setSignature] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onSignatureChange = (e) => {
//     setSignature(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError('No file selected!');
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       if (signature) {
//         formData.append('signature', signature);
//       }

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during upload.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };
//   // const onDownload = async () => {
//   //   try {
//   //     if (!url) {
//   //       console.error('URL is not initialized.');
//   //       return;
//   //     }
  
//   //     const response = await axios.get(url, {
//   //       responseType: 'arraybuffer',
//   //       headers: { 'Content-Type': 'application/octet-stream' },
//   //     });
  
//   //     const pdfData = new Uint8Array(await response.data);
//   //     const pdf = await pdfjs.getDocument(pdfData).promise;
  
//   //     // Convert the signature image to base64
//   //     const signatureImageBase64 = await new Promise((resolve) => {
//   //       const reader = new FileReader();
//   //       reader.onloadend = () => resolve(reader.result.split(',')[1]);
//   //       reader.readAsDataURL(signature);
//   //     });
  
//   //     // Create a canvas for each page, draw the PDF content, and add the signature
//   //     const canvasArray = await Promise.all(
//   //       Array.from({ length: pdf.numPages }, async (_, index) => {
//   //         const page = await pdf.getPage(index + 1);
//   //         const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
  
//   //         const canvas = document.createElement('canvas');
//   //         canvas.width = viewport.width;
//   //         canvas.height = viewport.height;
  
//   //         const context = canvas.getContext('2d');
//   //         await page.render({ canvasContext: context, viewport }).promise;
  
//   //         // Calculate the position for the signature (adjust as needed)
//   //         const x = 100; // Example x-coordinate
//   //         const y = 100; // Example y-coordinate
  
//   //         // Draw the signature image on the canvas
//   //         const img = new Image();
//   //         img.src = signatureImageBase64;
//   //         context.drawImage(img, x, y);
  
//   //         return canvas;
//   //       })
//   //     );
  
//   //     // Combine canvas images into a single PDF
//   //     const combinedPdf = new jsPDF();
//   //     canvasArray.forEach((canvas, index) => {
//   //       if (index > 0) {
//   //         combinedPdf.addPage();
//   //       }
//   //       combinedPdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
//   //     });
  
//   //     // Save the combined PDF
//   //     combinedPdf.save('signed_document.pdf');
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };
  
  
//   // const onDownload = async () => {
//   //   try {
//   //     if (!url) {
//   //       console.error('URL is not initialized.');
//   //       return;
//   //     }
  
//   //     const response = await axios.get(url, {
//   //       responseType: 'arraybuffer',
//   //       headers: { 'Content-Type': 'application/octet-stream' },
//   //     });
  
//   //     // Convert the signature image to base64
//   //     const signatureImageBase64 = await new Promise((resolve) => {
//   //       const reader = new FileReader();
//   //       reader.onloadend = () => resolve(reader.result.split(',')[1]);
//   //       reader.readAsDataURL(signature);
//   //     });
  
//   //     const pdfData = new Uint8Array(response.data);
//   //     const pdf = await pdfjs.getDocument(pdfData).promise;
  
//   //     // Create a canvas for each page, draw the PDF content, and add the signature
//   //     const canvasArray = await Promise.all(
//   //       Array.from({ length: pdf.numPages }, async (_, index) => {
//   //         const page = await pdf.getPage(index + 1);
//   //         const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
  
//   //         const canvas = document.createElement('canvas');
//   //         canvas.width = viewport.width;
//   //         canvas.height = viewport.height;
  
//   //         const context = canvas.getContext('2d');
//   //         await page.render({ canvasContext: context, viewport }).promise;
  
//   //         // Calculate the position for the signature (adjust as needed)
//   //         const x = 100; // Example x-coordinate
//   //         const y = 100; // Example y-coordinate
  
//   //         // Draw the signature image on the canvas
//   //         const img = new Image();
//   //         img.src = signatureImageBase64;
//   //         context.drawImage(img, x, y);
  
//   //         return canvas;
//   //       })
//   //     );
  
//   //     // Combine canvas images into a single PDF
//   //     const combinedPdf = new jsPDF();
//   //     canvasArray.forEach((canvas, index) => {
//   //       if (index > 0) {
//   //         combinedPdf.addPage();
//   //       }
//   //       combinedPdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
//   //     });
  
//   //     // Save the combined PDF
//   //     combinedPdf.save('signed_document.pdf');
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };
 
//   // const onDownload = async () => {
//   //   try {
//   //     if (!url || !signature) {
//   //       console.error('URL or signature is not initialized.');
//   //       return;
//   //     }
  
//   //     const response = await axios.get(url, {
//   //       responseType: 'arraybuffer',
//   //       headers: { 'Content-Type': 'application/octet-stream' },
//   //     });
  
//   //     const pdfData = new Uint8Array(response.data);
//   //     const pdf = await pdfjs.getDocument(pdfData).promise;
  
//   //     // Convert the signature image to base64
//   //     const signatureImageBase64 = await new Promise((resolve) => {
//   //       const reader = new FileReader();
//   //       reader.onloadend = () => resolve(reader.result.split(',')[1]);
//   //       reader.readAsDataURL(signature);
//   //     });
  
//   //     // Create a canvas for each page, draw the PDF content, and add the signature
//   //     const canvasArray = await Promise.all(
//   //       Array.from({ length: pdf.numPages }, async (_, index) => {
//   //         const page = await pdf.getPage(index + 1);
//   //         const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
  
//   //         const canvas = document.createElement('canvas');
//   //         canvas.width = viewport.width;
//   //         canvas.height = viewport.height;
  
//   //         const context = canvas.getContext('2d');
//   //         await page.render({ canvasContext: context, viewport }).promise;
  
//   //         // Calculate the position for the signature (adjust as needed)
//   //         const x = 100; // Example x-coordinate
//   //         const y = 100; // Example y-coordinate
  
//   //         // Draw the signature image on the canvas
//   //         const img = new Image();
//   //         img.src = signatureImageBase64;
//   //         context.drawImage(img, x, y);
  
//   //         return canvas;
//   //       })
//   //     );
  
//   //     // Combine canvas images into a single PDF
//   //     const combinedPdf = new jsPDF();
//   //     canvasArray.forEach((canvas, index) => {
//   //       if (index > 0) {
//   //         combinedPdf.addPage();
//   //       }
//   //       combinedPdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
//   //     });
  
//   //     // Save the combined PDF
//   //     combinedPdf.save('signed_document.pdf');
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };
  

//   const onDownload = async () => {
//     try {
//       if (!url) {
//         console.error('URL is not initialized.');
//         return;
//       }

//       const response = await axios.get(url, {
//         responseType: 'blob', // Important for handling binary data
//         headers: { 'Content-Type': 'application/octet-stream' },
//       });

//       // Create a blob from the response and initiate a download
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const downloadUrl = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = downloadUrl;
//       a.download = 'signed_document.pdf';
//       a.click();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <input type="file" onChange={onSignatureChange} />
//       <button onClick={onUpload} disabled={loading}>
//         Upload
//       </button>
//       <button onClick={onDownload} disabled={!url}>
//         Download
//       </button>
//       <div className="pdf-container">
//         {loading && <p>Uploading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {url && (
//           <div className="pdf-viewer">
//             <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//               {[...Array(numPages)].map((_, index) => (
//                 <div key={`page_${index + 1}`} className="pdf-page">
//                   <Page pageNumber={index + 1} />
//                   {signature && (
//                     <img
//                       className="signature-image"
//                       src={URL.createObjectURL(signature)}
//                       alt="Signature"
//                     />
//                   )}
//                 </div>
//               ))}
//             </Document>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;














// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';

// import './FileUpload.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [signature, setSignature] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onSignatureChange = (e) => {
//     setSignature(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError('No file selected!');
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       if (signature) {
//         formData.append('signature', signature);
//       }

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during upload.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const onDownload = async () => {
//     try {
//       const response = await axios.get(url, {
//         responseType: 'blob', // Important for handling binary data
//         headers: { 'Content-Type': 'application/octet-stream' },
//       });

//       // Create a blob from the response and initiate a download
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'signed_document.pdf';
//       a.click();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <input type="file" onChange={onSignatureChange} />
//       <button onClick={onUpload} disabled={loading}>
//         Upload
//       </button>
//       <button onClick={onDownload} disabled={!url}>
//         Download
//       </button>
//       <div className="pdf-container">
//         {loading && <p>Uploading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {url && (
//           <div className="pdf-viewer">
//             <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//               {[...Array(numPages)].map((_, index) => (
//                 <div key={`page_${index + 1}`} className="pdf-page">
//                   <Page pageNumber={index + 1} />
//                   {signature && (
//                     <img
//                       className="signature-image"
//                       src={URL.createObjectURL(signature)}
//                       alt="Signature"
//                     />
//                   )}
//                 </div>
//               ))}
//             </Document>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';

// import './FileUpload.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [signature, setSignature] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onSignatureChange = (e) => {
//     setSignature(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError('No file selected!');
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       if (signature) {
//         formData.append('signature', signature);
//       }

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during upload.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <input type="file" onChange={onSignatureChange} />
//       <button onClick={onUpload} disabled={loading}>
//         Upload
//       </button>
//       <div className="pdf-container">
//         {loading && <p>Uploading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {url && (
//           <div className="pdf-viewer">
//             <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//               {[...Array(numPages)].map((_, index) => (
//                 <div key={`page_${index + 1}`} className="pdf-page">
//                   <Page pageNumber={index + 1} />
//                   {signature && (
//                     <img
//                       className="signature-image"
//                       src={URL.createObjectURL(signature)}
//                       alt="Signature"
//                     />
//                   )}
//                 </div>
//               ))}
//             </Document>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';

// import './FileUpload.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError('No file selected!');
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during upload.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
// <div>

//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload} disabled={loading}>
//         Upload
//       </button>
//     <div className="pdf-container">

//       {loading && <p>Uploading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {url && (
//         <div className="pdf-viewer">
//           <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//             {[...Array(numPages)].map((_, index) => (
//               <div key={`page_${index + 1}`} className="pdf-page">
//                 <Page pageNumber={index + 1} />
//               </div>
//             ))}
//           </Document>
//         </div>
//       )}
//     </div>
// </div>
//               // {/* <Page key={`page_${index + 1}`} pageNumber={index + 1} /> */}
    
//   );
// };

// export default FileUpload;




















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';

// import './FileUpload.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError('No file selected!');
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during upload.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload} disabled={loading}>
//         Upload
//       </button>

//       {loading && <p>Uploading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {url && (
//         <div>
//           <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//             {[...Array(numPages)].map((_, index) => (
//               <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//             ))}
//           </Document>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';

// import "./FileUpload.css"

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError("No file selected!");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred during upload.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload} disabled={loading}>Upload</button>


//       {/* <iframe
//                   title="PDF Viewer"
                  
//                   src={url}
//                   width="100%"
//                   height="500px"
//                   style={{ border: "none" }}
//                 ></iframe> */}

      
//       {loading && <p>Uploading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {url && (
//         <div>
//           {/* <Document file={url} onLoadSuccess={onDocumentLoadSuccess}> */}
//           <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//             <Page pageNumber={pageNumber} />
//           </Document>
         
//         </div>
//       )}

//       {numPages && (
//         <div>
//           <p>Page {pageNumber} of {numPages}</p>
//           <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
//             Previous
//           </button>
//           <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;




















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Document, Page, pdfjs } from 'react-pdf';

// import "./FileUpload.css"

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         setError("No file selected!");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred during upload.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload} disabled={loading}>Upload</button>


//       {/* <iframe
//                   title="PDF Viewer"
                  
//                   src={url}
//                   width="100%"
//                   height="500px"
//                   style={{ border: "none" }}
//                 ></iframe> */}

      
//       {loading && <p>Uploading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {url && (
//         <div>
//           {/* <Document file={url} onLoadSuccess={onDocumentLoadSuccess}> */}
//           <Document file={{ url, httpHeaders: { 'Content-Type': 'application/octet-stream' } }} onLoadSuccess={onDocumentLoadSuccess}>
//             <Page pageNumber={pageNumber} />
//           </Document>
         
//         </div>
//       )}

//       {numPages && (
//         <div>
//           <p>Page {pageNumber} of {numPages}</p>
//           <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
//             Previous
//           </button>
//           <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;














// ------------------------------------------------
// import React, { useState } from 'react';
// import axios from 'axios';

// import "./FileUpload.css"
// import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState('');
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         console.error("No file selected!");
//         return;
//       }

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload}>Upload</button>
//       {url && <a href={url} download="downloaded.pdf">Download PDF</a>}
//       {/* <iframe
//                 title="PDF Viewer"
//                 src={url}
//                 width="100px"
//                 height="500px"
//                 style={{ border: "none" }}
//               ></iframe>  */}


//       {url && (
//         <div>
//           <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
//             <Page pageNumber={pageNumber} />
//           </Document>
//           <p>
//             Page {pageNumber} of {numPages}
//           </p>
//         </div>
//       )}



//        {/* Additional controls for navigating through pages if needed */}
//        {numPages && (
//         <div>
//           <p>Page {pageNumber} of {numPages}</p>
//           <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
//             Previous
//           </button>
//           <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;









// ------------------------------------------------------
// // // src/components/FileUpload.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState('');

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file) {
//         console.error("No file selected!");
//         return;
//       }

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData);
//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload}>Upload</button>
//       {url && <a href={url} download="downloaded.pdf">Download PDF</a>}
//     </div>
//   );
// };

// export default FileUpload;



















// -------------------------------------------------------------------------
// src/components/FileUpload.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [url, setUrl] = useState('');

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const onNameChange = (e) => {
//     setName(e.target.value);
//   };

//   const onUpload = async () => {
//     try {
//       if (!file || !email || !name) {
//         console.error("All fields are required!");
//         return;
//       }

//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: { email, name }, // Pass email and name in the data property
//       });

//       setUrl(response.data.url);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <input type="text" placeholder="Email" onChange={onEmailChange} />
//       <input type="text" placeholder="Name" onChange={onNameChange} />
//       <button onClick={onUpload}>Upload</button>
//       {url && <a href={url} download="downloaded.pdf">Download PDF</a>}
//     </div>
//   );
// };

// export default FileUpload;









// ---------------------------------------------------------
