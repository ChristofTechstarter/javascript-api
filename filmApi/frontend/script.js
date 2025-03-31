const showFilmsContainer = document.getElementById("showFilms");

const createFilmForm = document.getElementById("createFilm");
const titelInput = document.getElementById("titel");
const yearInput = document.getElementById("year");
const genreInput = document.getElementById("genre");
const directorInput = document.getElementById("director");
const antwortFeldCreated = document.getElementById("antwortCreated");

const changeFilmForm = document.getElementById("changeFilm");
const idChangeInput = document.getElementById("idChange");
const titelChangeInput = document.getElementById("titelChange");
const yearChangeInput = document.getElementById("yearChange");
const genreChangeInput = document.getElementById("genreChange");
const directorChangeInput = document.getElementById("directorChange");
const changedFilmContainer = document.getElementById("changedFilm");

const FilterFilmForm = document.getElementById("filterFilms");
const titelInputFilter = document.getElementById("titelFilter");
const yearInputFilter = document.getElementById("yearFilter");
const genreInputFilter = document.getElementById("genreFilter");
const directorInputFilter = document.getElementById("directorFilter");
const filteredFilmsContainer = document.getElementById("filteredFilms");

const delteFilmsForm = document.getElementById("delteFilms");
const idDeleteInput = document.getElementById("idDelete");
const deletedFilmContainer = document.getElementById("deletedFilms");

function convertDatatoTable(data) {
  let table = `<table border="1">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Year</th>
        <th>Genre</th>
        <th>Director</th>
      </tr>
    </thead>
    <tbody>`;

  data.forEach((film) => {
    table += `<tr>
    <td>${film.id}</td>
    <td>${film.title}</td>
    <td>${film.year}</td>
    <td>${film.genre.join(", ")}</td>
    <td>${film.director}</td>
  </tr>`;
  });

  table += `</tbody></table>`;

  return table;
}

function loadFilms() {
  fetch("http://localhost:5005/films")
    .then((res) => res.json())
    .then((data) => {
      showFilmsContainer.innerHTML = convertDatatoTable(data);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Daten:", error);
      showFilmsContainer.innerHTML = "<p>Fehler beim Laden der Filmdaten!</p>";
    });
}

FilterFilmForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const yearInputInt = parseInt(yearInputFilter.value);

  let url = "http://localhost:5005/films/search?";

  if (titelInputFilter.value) {
    url += `title=${titelInputFilter.value}&`;
  }

  if (yearInputInt) {
    url += `year=${yearInputInt}&`;
  }
  if (genreInputFilter.value) {
    url += `genre=${genreInputFilter.value}&`;
  }
  if (directorInputFilter.value) {
    url += `director=${directorInputFilter.value}&`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      filteredFilmsContainer.innerHTML = convertDatatoTable(data);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Daten:", error);
      filteredFilmsContainer.innerHTML =
        "<p>Fehler beim Laden der Filmdaten!</p>";
    });
});

createFilmForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    !(
      titelInput.value &&
      yearInput.value &&
      genreInput.value &&
      directorInput.value
    )
  ) {
    antwortFeldCreated.textContent = "Du hast nicht alle Felder ausgefüllt!";
    return;
  }
  const yearInputInt = parseInt(yearInput.value);
  const genreInputFormated = genreInput.value
    .split(",")
    .map((genre) => genre.trim());

  fetch("http://localhost:5005/films", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titelInput.value,
      year: yearInputInt,
      genre: genreInputFormated,
      director: directorInput.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      antwortFeldCreated.textContent = JSON.stringify(data);
    })
    .catch((error) => {
      console.error("Fehler:", error);
      antwortFeldCreated.textContent = "Fehler beim Senden der Daten!";
    });
});

changeFilmForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idChangeInputInt = parseInt(idChangeInput.value);
  const yearChangeInputInt = parseInt(yearChangeInput.value);
  const genreChangeInputFormated = genreChangeInput.value
    .split(",")
    .map((genre) => genre.trim());

  let newFilm = {};

  if (isNaN(idChangeInputInt)) {
    changedFilmContainer.innerHTML =
      "<p>Du hast bei der ID keine Zahl eingegeben!</p>";
    return;
  }

  if (titelChangeInput.value) {
    newFilm.title = titelChangeInput.value;
  }

  if (yearChangeInput.value) {
    if (isNaN(yearChangeInputInt)) {
      changedFilmContainer.innerHTML =
        "<p>Du hast bei dem Jahr keine Zahl eingegeben!</p>";
      return;
    } else {
      newFilm.year = yearChangeInputInt;
    }
  }

  if (genreChangeInput.value) {
    newFilm.genre = genreChangeInputFormated;
  }

  if (directorChangeInput.value) {
    newFilm.director = directorChangeInput.value;
  }

  fetch(`http://localhost:5005/films/${idChangeInputInt}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newFilm),
  })
    .then((res) => res.json())
    .then((data) => {
      changedFilmContainer.textContent = JSON.stringify(data);
    })
    .catch((error) => {
      console.error("Fehler:", error);
      changedFilmContainer.textContent = "Fehler beim Senden der Daten!";
    });
});

delteFilmsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  deletedFilmContainer.innerHTML = "";

  const deleteIdInputInt = parseInt(idDeleteInput.value);

  if (isNaN(deleteIdInputInt)) {
    deletedFilmContainer.innerHTML = "<p>Du hast keine Zahl eingegeben!</p>";
    return;
  }

  fetch(`http://localhost:5005/films/${deleteIdInputInt}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      deletedFilmContainer.innerHTML =
        "<p>Film erfolgreich gelöscht!<br>Gelöschter Film:</p><br>" +
        convertDatatoTable(data);
    });
});
