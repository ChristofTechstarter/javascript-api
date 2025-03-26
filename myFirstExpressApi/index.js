const express = require("express");
const app = express();

const generateName = require("sillyname");

const rn = require("random-number");
const gen = rn.generator({
  min: 1,
  max: 100,
  integer: true,
});

app.get("/", (req, res) => {
  res.send("Willkommen bei meiner eigenen API!");
});

app.get("/data", (req, res) => {
  res.json([
    { id: 1, firstName: "Max", lastName: "Mustermann" },
    { id: 2, firstName: "Lena", lastName: "Musterfrau" },
  ]);
});

app.get("/randomname", (req, res) => {
  res.json({ randomName: generateName() });
});

app.get("/randomnumber", (req, res) => {
  res.json({ randomNumber: gen() });
});

app.listen(5000, () => {
  console.log("API läuft auf Port 5000");
});
