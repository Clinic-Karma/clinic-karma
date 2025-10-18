import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router as authRouter } from "./src/routes/authRouter.js"
import { router as patientRouter } from "./src/routes/patientRouter.js"
import { router as doctorRouter } from "./src/routes/doctorRouter.js"
import { router as appointmentRouter } from "./src/routes/appointmentRouter.js"
import topmanagerRouter from "./src/routes/topmanagerRouter.js"
import branchmanagerRouter from "./src/routes/branchmanagerRouter.js"

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:8080', 
      'http://localhost:8081',
      'http://192.168.209.1:8080',
      'http://192.168.209.1:8081',
      'http://192.168.209.1:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, you can also allow any local network IP
      if (origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000; // Changed to 5000 to match frontend expectation

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Example (add in server.js or app.js)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});


// Route Middlewares
app.use("/api/auth", authRouter);
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointments", appointmentRouter); // Added appointment routes
app.use("/api/topmanagers", topmanagerRouter);
app.use("/api/branchmanagers", branchmanagerRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for origins: http://localhost:5173, http://localhost:8080, http://localhost:8081, http://192.168.209.1:8080, http://192.168.209.1:8081, http://192.168.209.1:5173`);
  console.log(`Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No (Missing DATABASE_URL)'}`);
});