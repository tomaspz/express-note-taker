// Require the necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");

// 
// express.static('public')

// Create an app instance of express
const app = express();

// Establish the port to run in Heroku and Localhost
const PORT = process.env.PORT || 3000;

// Middleware to help POSTs generate the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add directories to avoid the server to refuese to serve these files
app.use('/css', express.static(path.join(__dirname, './public/assets/css')));
app.use('/js', express.static(path.join(__dirname, './public/assets/js')));

// Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

// app.get("/api/notes", function(req, res) {
//   fs.readFile("/db/db.json", function(err, data) {
//     if (err) {
//       res.status(500);
//       return res.send("Error retrieving notes.");
//     }
//     const retrievedNotesArray = JSON.parse(data);
//     res.json(retrievedNotesArray);
//   });
// });

// app.get("/api/notes/:id", function(req, res) {
//   const index = parseInt(req.params.id);
//   console.log(index);

//   if (isNaN(index)) {
//     res.status(400);
//     return res.send("Please enter a valid id");
//   }

//   fs.readFile("/db/db.json", function(err, data) {
//     if (err) {
//       res.status(500);
//       return res.send("Error retrieving notes.");
//     }
//     const retrievedNotesArray = JSON.parse(data);
//     if (index >= 0 && index < retrievedNotesArray.length) {
//       res.json(retrievedNotesArray[index]);
//     } else {
//       res.status(404);
//       return res.send("No joke with that ID. Please try another ID");
//     }
//   });
// });

// app.post("/api/notes", function(req, res) {
//   console.log(req.body);
//   fs.readFile("/db/db.json", function(err, data) {
//     if (err) {
//       res.status(500);
//       return res.send("Error retrieving notes.");
//     }
//     const notesArray = JSON.parse(data);
//     notesArray.push(req.body);
//     console.log(notesArray);
//     fs.writeFile("/db/db.json", JSON.stringify(notesArray), function(err) {
//       if (err) {
//         res.status(500);
//         return res.send("Error saving your note.");
//       }
//       res.send("Note successfully created!");
//     });
//   });
// });

// The app will listen in the port
app.listen(PORT, () => {
  console.log(`Application running on http://localhost:${PORT}`);
});
