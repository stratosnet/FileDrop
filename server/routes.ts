import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import multer from "multer";
import { storage } from "./storage";
import { fileUploadResponseSchema } from "@shared/schema";
import { access } from "fs/promises";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

if (!process.env.SDS_GATEWAY_ACCESS_TOKEN) {
  throw new Error("Environment variable SDS_GATEWAY_ACCESS_TOKEN is not set or is empty");
}

const config = {
  baseUrl: "https://sds-gateway-uswest.thestratos.org",
  path: "/spfs",
  accessToken: process.env.SDS_GATEWAY_ACCESS_TOKEN,
  endpoint: "/api/v0/add"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for file uploads
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    console.log('Request received'); // Check if route is triggered
    console.log('Headers:', req.headers); // View all request headers
    console.log('Body:', req.body); // View request body
    console.log('File:', req.file); // View file information

    
    const kuboApiUrl = `${config.baseUrl}${config.path}/${config.accessToken}/api/v0/add`;
    console.log('Generated URL:', kuboApiUrl); // Debug log

    try {
      // Send request using axios
      // const formData = new FormData();
      // formData.append('file', req.file.buffer);

      const file = req.file;
      // Create a FormData object to send to the SPFS API
      const formData = new FormData();
      // Convert buffer to blob
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append('file', blob, file.originalname);



      
      const response = await axios({
        method: 'post',
        url: kuboApiUrl,
        data: formData,
        // headers: {
        //   ...formData.getHeaders(),
        // },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      res.json(response.data);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ 
        error: 'Upload failed',
        url: kuboApiUrl  // Add generated URL to error response
      });
    }
  });

  // Route handler
  app.post('/api/your-endpoint', async (req, res) => {
    const { accessToken } = req.body;
    
    // Combine full URL
    const kuboApiUrl = `${config.baseUrl}${config.path}/${accessToken}${config.endpoint}`;
    
    try {
      // Use the combined URL for your API calls
      // ... your business logic
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
