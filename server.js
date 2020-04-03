// Require the necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");

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
// app.use('/db', express.static(path.join(__dirname, './db')));

// Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

app.get("/api/notes", function(req, res) {
  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
      console.log(err);
      res.status(500);
      return res.send("Error retrieving notes.");
    }
    res.json(JSON.parse(data));
  });
});

app.get("/api/notes/:id", function(req, res) {
  const noteId = req.params.id;

  if (!noteId) {
    res.status(400);
    return res.send("There is no note with such a title!");
  }

  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
      res.status(500);
      return res.send("Error retrieving notes.");
    }
    if (data) {
      const notes = JSON.parse(data);
      const filteredNote = notes.filter(note=> note.id === noteId);
      res.json(filteredNote);
    } else {
      res.status(404);
      return res.send("No notes found!");
    }
  });
});

app.post("/api/notes", function(req, res) {
  
  const note = req.body;
  
  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
      res.status(204);
      return res.send("Error reading file!");
    }

    var obj = JSON.parse(data);
    obj.push(note);

    fs.writeFile("./db/db.json", JSON.stringify(obj), function(err) {
      if (err) {
        console.log(err);
        res.status(500);
        return res.send("Error saving the note!");
      }
      res.send("Note successfully created!");
    });
});
});

app.get("*", function(req,res){
  res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.delete("/api/notes/:id", function(req,res){
  const noteId = req.params.id;

  if (!noteId) {
    res.status(400);
    return res.send("There is no note with such a title!");
  }

  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
      res.status(500);
      return res.send("Error retrieving notes.");
    }
    if (data) {

      const notes = JSON.parse(data);

      for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === noteId) {
          notes.splice(i, 1);
        }
      }

      fs.writeFile("./db/db.json", JSON.stringify(notes),function (err, data) {
        if (err) {
          console.log(err);
          res.status(500);
          return res.send("Error deleting the note!");
        }
        res.send("Note successfully deleted!");
      })

      console.log(notes);

      res.status(204).send();
    } else {
      res.status(404);
      return res.send("No notes found!");
    }
  });
})

// The app will listen in the port
app.listen(PORT, () => {
  console.log(`Application running on http://localhost:${PORT}`);
});
