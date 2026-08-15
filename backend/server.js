import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validateEnvironment } from './src/config/env.js';

const environment = validateEnvironment();

// Validate configuration before importing route modules that initialize the DB client.
const [
  { router: authRouter },
  { router: patientRouter },
  { router: doctorRouter },
  { router: appointmentRouter },
  { default: topmanagerRouter },
  { default: branchmanagerRouter },
] = await Promise.all([
  import('./src/routes/authRouter.js'),
  import('./src/routes/patientRouter.js'),
  import('./src/routes/doctorRouter.js'),
  import('./src/routes/appointmentRouter.js'),
  import('./src/routes/topmanagerRouter.js'),
  import('./src/routes/branchmanagerRouter.js'),
]);

const app = express();

// Middleware
// Allow multiple origins safely
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:8080', 
  'http://localhost:8081',
  "https://clinic-karma.vercel.app",              // your final production frontend
   /\.vercel\.app$/,                               // any temporary vercel deployment
  "https://clinic-karma-production.up.railway.app", // backend itself (optional)
  environment.frontendUrl
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
app.use(express.json());
  
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

const PORT = environment.port;

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
  console.log(`Configured frontend origin: ${environment.frontendUrl}`);
  console.log('Database URL configured: Yes');
  // Warm up Neon connection (non-blocking)
  import('./src/db_utils/db.js').then(async ({ sql }) => {
    try {
      await sql`SELECT 1`;
      console.log('Database warm-up successful');
    } catch (e) {
      console.warn('Database warm-up failed:', e?.message || e);
    }
  });
});
