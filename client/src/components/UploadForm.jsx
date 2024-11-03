import React, { useState } from 'react';

const UploadForm = () => {
    const [status, setStatus] = useState('');

    const handleFileUpload = async (event) => {
        event.preventDefault();
        console.log('Form submission initiated');

        const file = event.target.elements.csvFile.files[0];
        console.log('Selected file:', file);

        if (!file) {
            alert('Please select a CSV file.');
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);
        console.log('FormData prepared with file:', file.name);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            console.log('Fetch response:', response);

            if (!response.ok) {
                console.error('Upload failed with status:', response.status);
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Upload result:', result);
            setStatus(result.message);
        } catch (error) {
            console.error('Error during file upload:', error);
            setStatus('Upload failed: ' + error.message);
        }
    };

    console.log('Rendering UploadForm component');

    return (
        <div>
            <h2>Upload CSV File</h2>
            <form onSubmit={handleFileUpload} encType="multipart/form-data">
                <input type="file" name="csvFile" accept=".csv" required />
                <button type="submit">Upload</button>
            </form>
            <p>{status}</p>
        </div>
    );
};

export default UploadForm;
