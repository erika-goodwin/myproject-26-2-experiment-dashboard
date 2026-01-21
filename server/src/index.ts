import "dotenv/config";
import express from "express";
import type { Application, Request, Response } from "express";
import { connectDB } from "./db/index.js";
import experiments_route from './routes/experiments_route.js';
import auth_route from './routes/auth_route.js';


const app: Application = express();
const PORT = 3000;

// Global Middleware
app.use(express.json());

// Routes
app.use('/experiments', experiments_route);
app.use('/auth', auth_route);

// Database
await connectDB();


// Examples
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});
app.post('/', (req, res) => {
  res.send('Got a POST request!!!')
})

// Server Start!! 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



// app.post('/', (req, res) => {
//   res.send('Got a POST request')
// })

// >> put(update)
// app.put('/user', (req, res) => {
//   res.send('Got a PUT request at /user')
// })

// app.delete('/user', (req, res) => {
//   res.send('Got a DELETE request at /user')
// })

// app.all()

// >> Static files - images, js files
// express.static(root, [options])

// app.use(express.static('public'))
// >> load the files that are in the public directory:
// http://localhost:3000/images/kitten.jpg
// http://localhost:3000/css/style.css

