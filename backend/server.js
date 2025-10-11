import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { router as authRouter } from "./src/routes/authRouter.js"
import { router as patientRouter } from "./src/routes/patientRouter.js"
import { router as doctorRouter } from "./src/routes/doctorRouter.js"

const app = express();

// Middleware
app.use(cors({
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRouter);
app.use("/api/patient", patientRouter); // Use the patientRouter
app.use("/api/doctor", doctorRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

