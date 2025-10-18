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
// Allow multiple origins safely
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:8080', 
  'http://localhost:8081',
  "https://clinic-karma.vercel.app",              // your final production frontend
  /\.vercel\.app$/,                               // any temporary vercel deployment
  "http://localhost:5173",                        // local dev
  "https://clinic-karma-production.up.railway.app" // backend itself (optional)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((pattern) => {
        if (pattern instanceof RegExp) return pattern.test(origin);
        return origin === pattern;
      })) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed for this origin: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


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
  console.log(`CORS enabled for origins: http://localhost:5173, http://localhost:8080, http://localhost:8081, http://192.168.209.1:8080, http://192.168.209.1:8081, http://192.168.209.1:5173, ${process.env.FRONTEND_URL}`);
  console.log(`Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No (Missing DATABASE_URL)'}`);
});