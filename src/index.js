const express = require("express");
const rotas = require("./rotas");

const app = express();

app.use(express.json()); // middleware que permite apenas utilizar no formato json

app.use(rotas);

app.listen(3000);
