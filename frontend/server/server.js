import express from "express";
import cors from "cors";
import { Storage } from "@google-cloud/storage";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
});

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

app.post("/getSignedUrl", async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        const file = bucket.file(fileName);

        const [url] = await file.getSignedUrl({
            action: "write",
            expires: Date.now() + 15 * 60 * 1000,
            contentType: fileType,
        });

        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/getRecordings", async (req, res) => {
    try {
        const [files] = await bucket.getFiles({ prefix: "recording-" });

        // Generate signed URLs for each file
        const signedUrls = await Promise.all(
            files.map(async (file) => {
                const [url] = await file.getSignedUrl({
                    action: "read",
                    expires: Date.now() + 60 * 60 * 1000, // 1 hour expiry
                });
                return { name: file.name, url };
            })
        );

        res.json(signedUrls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
