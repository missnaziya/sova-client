import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ExportPage.css';

const ExportPage = ({ walls = [], models = [], screenshot2D = '', screenshot3D = '', onBack }) => {
  const exportRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Function to preload images
  const preloadImages = async () => {
    const images = [];
    if (screenshot2D) images.push(screenshot2D);
    if (screenshot3D) images.push(screenshot3D);
    
    const promises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    });
    
    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  };

  const handleImageError = (type) => {
    setImageErrors(prev => ({ ...prev, [type]: true }));
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const input = exportRef.current;
    
    try {
      // Preload images to ensure they're fully loaded
      await preloadImages();
      
      // Capture the content with high quality
      const canvas = await html2canvas(input, { 
        scale: 2, // High quality 2x scale
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        logging: false,
        removeContainer: true
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with A4 format
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      // Calculate how many pages we need
      const pagesNeeded = Math.ceil(imgHeight / pageHeight);
      
      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the source Y position for this page
        const sourceY = i * pageHeight * (imgProps.height / imgHeight);
        const sourceHeight = Math.min(
          pageHeight * (imgProps.height / imgHeight),
          imgProps.height - sourceY
        );
        
        // Add the image slice for this page
        pdf.addImage(
          imgData, 
          'PNG', 
          0, // x position on page
          0, // y position on page
          pageWidth, // width on page
          pageHeight, // height on page
          undefined, // alias
          'FAST', // compression
          0, // rotation
          0, // source x
          imgProps.width, // source width
          sourceHeight, // source height
          undefined, // alias
          undefined, // compression
          sourceY // source y
        );
      }

      pdf.save('project-export.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-content">
        <button className="export-modal-close" onClick={onBack} title="Close">&times;</button>
        
        {/* PDF content only - this is what gets captured */}
        <div ref={exportRef} className="pdf-content">
          <div className="export-header">
            <h1>Project Export Report</h1>
            <p className="export-subtitle">Complete project overview and visual documentation</p>
          </div>

          <div className="export-sections">
            <div className="export-section">
              <h2>Project Summary</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-icon">🏗️</div>
                  <div className="summary-content">
                    <h3>Walls</h3>
                    <p>{walls.length} walls</p>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">📦</div>
                  <div className="summary-content">
                    <h3>Objects</h3>
                    <p>{models.length} objects</p>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">📋</div>
                  <div className="summary-content">
                    <h3>Object Types</h3>
                    <p>{models.map(m => m.name || m.type).join(', ') || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="export-section">
              <h2>2D Floor Plan</h2>
              <div className="screenshot-container">
                {screenshot2D ? (
                  <img 
                    src={screenshot2D} 
                    alt="2D Floor Plan" 
                    className="screenshot-image"
                    onError={() => handleImageError('2D')}
                    onLoad={() => console.log('2D image loaded successfully')}
                  />
                ) : (
                  <div className="no-screenshot">No 2D screenshot available</div>
                )}
                {imageErrors['2D'] && (
                  <div className="image-error">
                    Failed to load 2D screenshot. URL: {screenshot2D}
                  </div>
                )}
              </div>
            </div>

            <div className="export-section">
              <h2>3D Visualization</h2>
              <div className="screenshot-container">
                {screenshot3D ? (
                  <img 
                    src={screenshot3D} 
                    alt="3D Visualization" 
                    className="screenshot-image"
                    onError={() => handleImageError('3D')}
                    onLoad={() => console.log('3D image loaded successfully')}
                  />
                ) : (
                  <div className="no-screenshot">No 3D screenshot available</div>
                )}
                {imageErrors['3D'] && (
                  <div className="image-error">
                    Failed to load 3D screenshot. URL: {screenshot3D}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Button outside the PDF area */}
        <div className="export-modal-actions">
          <button 
            className={`export-btn primary ${isGeneratingPDF ? 'loading' : ''}`} 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <span className="btn-icon">⏳</span>
                Generating PDF...
              </>
            ) : (
              <>
                <span className="btn-icon">📄</span>
                Download PDF Report
              </>
            )}
          </button>
          <button className="export-btn secondary" onClick={onBack} disabled={isGeneratingPDF}>
            <span className="btn-icon">←</span>
            Back to Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage; 