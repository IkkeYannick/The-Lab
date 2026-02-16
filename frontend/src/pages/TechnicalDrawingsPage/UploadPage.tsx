import React, { useState } from "react";
import "./UploadDrawing.css";

const BACKEND_URL = "http://localhost:5000";

const UploadDrawing = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            // Step 1: Request a signed URL from the backend
            const response = await fetch(`${BACKEND_URL}/getSignedUrl`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to get signed URL");

            // Step 2: Upload file to GCS using signed URL
            await fetch(data.url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            setMessage("File uploaded successfully!");
            setUploading(false);
            setFile(null);
        } catch (error: any) {
            setMessage("Error uploading file: " + error.message);
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h3>Upload Technical Drawing</h3>
            <div className="upload-form">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    accept="application/pdf"
                />
                {file && <p className="file-name">Selected file: {file.name}</p>}
                <button className="upload-button" onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>
            <p className={`message ${message ? "active" : ""}`}>{message}</p>
        </div>
    );
};

export default UploadDrawing;
