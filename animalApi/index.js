const express = require("express");
const app = express();

const fs = require("fs");

app.use(express.json());

app.get("/", (req, res) => {
  fs.readFile("animals.json", (err, data) => {
    if (err) {
      res.status(500).send("Fehler beim Lesen der Datei");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.get("/tiere/search", (req, res) => {
  fs.readFile("animals.json", (err, data) => {
    if (err) {
      res.status(500).send("Fehler beim Lesen der Datei");
      return;
    }
    const animals = JSON.parse(data);
    const art = req.query.art;
    const foundAnimal = animals.filter((animal) => animal.art == art);
    res.json(foundAnimal);
  });
});

app.get("/tiere/:id", (req, res) => {
  fs.readFile("animals.json", (err, data) => {
    if (err) {
      res.status(500).send("Fehler beim Lesen der Datei");
      return;
    }
    const animals = JSON.parse(data);
    const id = req.params.id;
    const foundAnimal = animals.find((animal) => animal.id == id);
    res.json(foundAnimal);
  });
});

app.post("/tiere", (req, res) => {
  fs.readFile("animals.json", (err, data) => {
    if (err) {
      res.status(500).send("Fehler beim Lesen der Datei");
      return;
    }
    const animals = JSON.parse(data);
    const { name, art, alter } = req.body;
    const newAnimal = {
      id: animals.length + 1,
      name: name,
      art: art,
      alter: alter,
    };
    animals.push(newAnimal);

    fs.writeFile("animals.json", JSON.stringify(animals, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Fehler beim Speichern der Datei");
      }
      res
        .status(201)
        .json([
          { message: "Sucessfully Created a new Animal" },
          { DataSaved: newAnimal },
        ]);
    });
  });
});

app.listen(5000, () => {
  console.log("AnimalAPI läuft auf Port 5000");
});
