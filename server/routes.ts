import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import multer from "multer";
import { storage } from "./storage";
import { fileUploadResponseSchema } from "@shared/schema";
import fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';

// Create temporary upload directory
const uploadDir = path.join(process.cwd(), 'temp-uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to use disk storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// !!! important:
// please check if you have the Access Token
// if not, please contact the team to get the Access Token
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
  // Upload route handler
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const kuboApiUrl = `${config.baseUrl}${config.path}/${config.accessToken}/api/v0/add`;
    console.log('Generated URL:', kuboApiUrl); // Debug log

    try {
      // Create file stream for upload
      const file = req.file;
      const formData = new FormData();

      // Read file content
      const fileBuffer = await fsPromises.readFile(filePath);
      const blob = new Blob([fileBuffer], { type: file.mimetype });
      formData.append('file', blob, file.originalname);

      const response = await axios({
        method: 'post',
        url: kuboApiUrl,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      res.json(response.data);
    } catch (error) {
      
      console.error('Server error:', error);
      res.status(500).json({ 
        error: 'Upload failed',
        url: kuboApiUrl
      });
    }finally{
      // Cleanup function for temporary files
      if (req.file) {
        try {
          await fsPromises.unlink(req.file.path);
          console.error('Succes deleting temp file:', req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }

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




