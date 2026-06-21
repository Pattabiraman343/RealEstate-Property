// src/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import { apiLimiter } from "./middleware/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadsPath = path.join(__dirname, '..', 'uploads');

console.log('📁 Uploads path:', uploadsPath);
console.log('📁 Uploads exists:', fs.existsSync(uploadsPath));

if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  console.log('📄 Files:', files);
}

// ✅ Updated CORS - Allow all origins for testing
app.use(cors({
  origin: '*',  // ✅ Allow all origins (fix for Vercel)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsPath));

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, filename);
  
  console.log('📍 Serving file:', filePath);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ 
          success: false, 
          message: 'Error serving file',
          error: err.message
        });
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: `File ${filename} not found`,
      path: filePath
    });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', apiLimiter, inquiryRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uploads: {
      path: uploadsPath,
      exists: fs.existsSync(uploadsPath)
    }
  });
});

app.use((req, res) => {
  console.log('404 Not Found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`📁 Uploads path: ${uploadsPath}`);
});

export default app;