const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

function readFile() {
  const data = fs.readFileSync("films.json", "utf-8");
  return JSON.parse(data);
}

function writeFile(data) {
  fs.writeFileSync("films.json", JSON.stringify(data, null, 2));
}

app.get("/films", (req, res) => {
  try {
    const films = readFile();
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
});

app.get("/films/search", (req, res) => {
  try {
    const films = readFile();
    const { title, year, genre, director } = req.query;

    let filteredFilms = films;

    if (title) {
      filteredFilms = filteredFilms.filter((film) =>
        film.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (year) {
      const yearNumber = parseInt(year);
      if (!isNaN(yearNumber)) {
        filteredFilms = filteredFilms.filter(
          (film) => film.year === yearNumber
        );
      } else {
        return res.status(400).json({ error: "Year must be a number!" });
      }
    }

    if (genre) {
      filteredFilms = filteredFilms.filter((film) =>
        film.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase()))
      );
    }

    if (director) {
      filteredFilms = filteredFilms.filter((film) =>
        film.director.toLowerCase().includes(director.toLowerCase())
      );
    }

    if (filteredFilms.length === 0) {
      return res
        .status(404)
        .json({ message: "No films found with given criteria" });
    }

    res.status(200).json(filteredFilms);
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
});

app.post("/films", (req, res) => {
  try {
    const films = readFile();
    const { title, year, genre, director } = req.body;

    if (
      films.some((film) => film.title.toLowerCase() === title.toLowerCase())
    ) {
      return res
        .status(400)
        .json({ error: `The title '${title}' is already used!` });
    }

    if (typeof year !== "number") {
      return res.status(400).json({ error: `${year} is not a valid number!` });
    }

    const newFilm = { id: films.length + 1, title, year, genre, director };
    films.push(newFilm);
    writeFile(films);

    res
      .status(201)
      .json({ message: "Successfully created a new Film Item", newFilm });
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
});

app.put("/films/:id", (req, res) => {
  try {
    const films = readFile();
    const id = parseInt(req.params.id);
    const { title, year, genre, director } = req.body;

    const filmIndex = films.findIndex((film) => film.id === id);

    if (filmIndex === -1) {
      return res.status(404).json({ error: `Film with ID ${id} not found` });
    }

    if (year !== undefined && typeof year !== "number") {
      return res.status(400).json({ error: `Year must be a number!` });
    }

    if (title) films[filmIndex].title = title;
    if (year) films[filmIndex].year = year;
    if (genre) films[filmIndex].genre = genre;
    if (director) films[filmIndex].director = director;

    writeFile(films);

    res.status(200).json({
      message: "Film updated successfully",
      updatedFilm: films[filmIndex],
    });
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
});

app.delete("/films/:id", (req, res) => {
  try {
    const films = readFile();
    const id = parseInt(req.params.id);

    const filmIndex = films.findIndex((film) => film.id === id);

    if (filmIndex === -1) {
      return res.status(404).json({ error: `Film with ID ${id} not found` });
    }

    const deletedFilm = films.splice(filmIndex, 1)[0];

    writeFile(films);

    res.status(200).json({
      message: "Film deleted successfully",
      deletedFilm: deletedFilm,
    });
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
});

app.listen(5005, () => {
  console.log("API läuft auf Port 5005");
});
