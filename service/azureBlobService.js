const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

require('dotenv').config();


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

async function uploadToAzureBlob(folder, file) {
    const containerName = "anadolu-ecommerce"
    const accountName = "nevera"

    try {
        

        console.log("Uploading to Azure Blob",AZURE_STORAGE_CONNECTION_STRING);

        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        await containerClient.createIfNotExists();

        const blobName = `${folder}/${uuidv4()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log("blockBlobClient:", blockBlobClient); 

        // Upload the file as a blob
        await blockBlobClient.upload(file.buffer, file.buffer.length);
        console.log(`https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`);
        return blobName;
    } catch (error) {
        console.log("Error uploading to Azure Blob", error);
        return null;
    }


}

module.exports = { uploadToAzureBlob };