import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import './DataImporter.css';

const DataImporter = () => {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('csv');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [importStats, setImportStats] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
      setPreview(null);
      
      // Preview file
      if (selectedFile.type.includes('csv') || selectedFile.name.endsWith('.csv')) {
        previewCSV(selectedFile);
      }
    }
  };

  const previewCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split('\n').slice(0, 5);
      setPreview(lines);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a file');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 30;
          return next > 90 ? 90 : next;
        });
      }, 200);

      const response = await axios.post(
        `${API_URL}/api/admin/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.success) {
        setMessage(
          `✅ Import successful! \n${response.data.stats.created} players created, ${response.data.stats.updated} updated`
        );
        setImportStats(response.data.stats);
        setFile(null);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,team,role,totalRuns,matches,average,strikeRate,wickets,economy
Phoebe Litchfield,GGTW,Batter,500,15,33.33,125.5,0,0
Smriti Mandhana,RCBW,Batter,480,15,32.0,128.0,0,0
Kiran Navgire,UPW,All-rounder,400,14,28.57,120.0,8,7.5`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${encodeURIComponent(template)}`
    );
    element.setAttribute('download', 'players_template.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="data-importer">
      <div className="importer-header">
        <h1>📤 Data Importer</h1>
        <p>Import player data from CSV or Excel files</p>
      </div>

      <div className="importer-container">
        {/* FILE TYPE SELECTION */}
        <div className="file-type-selector">
          <h3>Select File Type</h3>
          <div className="type-options">
            <label className={`type-option ${fileType === 'csv' ? 'active' : ''}`}>
              <input
                type="radio"
                name="fileType"
                value="csv"
                checked={fileType === 'csv'}
                onChange={(e) => setFileType(e.target.value)}
              />
              📄 CSV File
            </label>
            <label className={`type-option ${fileType === 'excel' ? 'active' : ''}`}>
              <input
                type="radio"
                name="fileType"
                value="excel"
                checked={fileType === 'excel'}
                onChange={(e) => setFileType(e.target.value)}
              />
              📊 Excel File (.xlsx)
            </label>
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div className="file-upload-section">
          <h3>Upload File</h3>
          <div className="file-upload-box">
            <input
              type="file"
              id="fileInput"
              onChange={handleFileSelect}
              accept={fileType === 'csv' ? '.csv' : '.xlsx,.xls'}
              disabled={uploading}
            />
            <label htmlFor="fileInput" className="file-label">
              <div className="upload-icon">📁</div>
              <p>Click to select file or drag and drop</p>
              <small>
                {fileType === 'csv'
                  ? 'Supported format: .csv'
                  : 'Supported formats: .xlsx, .xls'}
              </small>
            </label>
          </div>

          {file && (
            <div className="file-info">
              <p>
                <strong>Selected File:</strong> {file.name}
              </p>
              <p>
                <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        {/* UPLOAD PROGRESS */}
        {uploading && (
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{Math.round(progress)}% uploading...</p>
          </div>
        )}

        {/* FILE PREVIEW */}
        {preview && (
          <div className="preview-section">
            <h3>File Preview</h3>
            <div className="preview-table">
              {preview.map((line, idx) => (
                <p key={idx} className="preview-line">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div className={`message-box ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* IMPORT STATS */}
        {importStats && (
          <div className="import-stats">
            <h3>Import Summary</h3>
            <div className="stats-grid">
              <div className="stat">
                <p className="stat-label">Created</p>
                <p className="stat-value">{importStats.created}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Updated</p>
                <p className="stat-value">{importStats.updated}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Failed</p>
                <p className="stat-value">{importStats.failed || 0}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Total</p>
                <p className="stat-value">{importStats.created + importStats.updated}</p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="action-buttons">
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : '📤 Import Data'}
          </button>
          <button className="template-btn" onClick={downloadTemplate}>
            📥 Download Template
          </button>
        </div>

        {/* HELP SECTION */}
        <div className="help-section">
          <h3>📋 How to Import Data</h3>
          <div className="help-steps">
            <div className="step">
              <h4>Step 1: Download Template</h4>
              <p>Download the CSV or Excel template to see the required format</p>
            </div>
            <div className="step">
              <h4>Step 2: Fill in Data</h4>
              <p>Add your player data following the template structure</p>
            </div>
            <div className="step">
              <h4>Step 3: Upload File</h4>
              <p>Select your completed file and click "Import Data"</p>
            </div>
            <div className="step">
              <h4>Step 4: Verify Results</h4>
              <p>Check the import summary to confirm all data was imported</p>
            </div>
          </div>

          <div className="required-fields">
            <h4>Required Fields</h4>
            <ul>
              <li><strong>name</strong> - Player name</li>
              <li><strong>team</strong> - Team name (e.g., GGTW, UPW)</li>
              <li><strong>role</strong> - Batter, Bowler, or All-rounder</li>
              <li><strong>totalRuns</strong> - Total runs scored</li>
              <li><strong>matches</strong> - Matches played</li>
              <li><strong>average</strong> - Batting average</li>
              <li><strong>strikeRate</strong> - Strike rate</li>
              <li><strong>wickets</strong> - Wickets taken (for bowlers)</li>
              <li><strong>economy</strong> - Economy rate (for bowlers)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImporter;