const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

function readFile() {
  const data = fs.readFileSync("films.json", "utf-8");
  return JSON.parse(data);
}

function writeFile(data) {
  fs.writeFileSync("films.json", JSON.stringify(data, null, 2));
}

app.get("/films", (req, res) => {
  const films = readFile();
  res.status(200).json(films);
});

app.get("/films/search", (req, res) => {
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
      filteredFilms = filteredFilms.filter((film) => film.year === yearNumber);
    } else {
      return res.status(400).json({ error: "Year must be a number!" });
    }
  }

  if (genre) {
    filteredFilms = filteredFilms.filter((film) =>
      film.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
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
});

app.post("/films", (req, res) => {
  const films = readFile();
  const { title, year, genre, director } = req.body;

  if (films.some((film) => film.title === title)) {
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
});

app.put("/films/:id", (req, res) => {
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
});

app.delete("/films/:id", (req, res) => {
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
});

app.listen(5005, () => {
  console.log("API läuft auf Port 5005");
});
