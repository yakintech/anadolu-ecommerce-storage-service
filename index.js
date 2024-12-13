const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const { uploadToAzureBlob } = require('./service/azureBlobService');

require('dotenv').config()

const PORT = process.env.PORT || 3200;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.get("/health", (req, res) => {
    res.json({ message: "storage-service is running" });
})

app.post("/storage",upload.array("files", 10), async (req, res) => {

    const folder = req.body.folder;
    const files = req.body.files; 
    const blobNames = [];

    for (const file of files) {
        const blobName = await uploadToAzureBlob(folder, file);
        blobNames.push(blobName);
    }

    console.log("blobNames:", blobNames);
    res.json({ blobNames });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})