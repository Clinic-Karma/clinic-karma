import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { router } from "./src/routes/authRouter.js"


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

