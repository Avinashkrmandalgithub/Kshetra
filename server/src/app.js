import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())
app.use(express.static("public"))

import aadharRouter from "./routes/aadhar.route.js";
import errorHandler from "./middlewares/error.middleware.js";

app.use("/api/aadhar", aadharRouter)

app.get("/", (req, res) => {
    res.json({ message: "api util server" })
})

app.use(errorHandler);

export { app }