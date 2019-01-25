const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const index = require("./routes/index");
const sqlite = require("sqlite3").verbose();

let db = new sqlite.Database('database/Kalend', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the Kalend SQLite Database');
});

const app = express();
const port = 3000;

const socket_io = require("socket.io");
const io = socket_io();

//views
app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//Body parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//Routes
app.use("/", index);
// app.use("/api", bookings);
// app.use("/api", driverLocation);
// app.use("/api", drivers);

io.listen(app.listen(port, () => {
    console.log("Server running on port", port);
}));

app.io = io.on("connection", (socket) => {
	console.log("Socket connected: " + socket.id);

	socket.on("sendData", (obj) => {
		console.log("Recieved in the server", obj)
	})
});

