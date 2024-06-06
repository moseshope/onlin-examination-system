const express = require('express');
const cors = require("cors");
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require("path");
require('dotenv').config()


const api = require("./routes/");

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.use(express.static(`${__dirname}/public`));
app.use("/api", api);

app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "public/index.html"));
});
// Handle errors.
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
