import express from "express";
import cors from "cors";
import { usuarios } from "./globalVariables.js";

function handleSignup(req) {
  console.log("Recebeu a request \n");
  let isAlreadySignedUp = false;

  if (
    usuarios.filter((usuario) => usuario.username === req.username).length > 0
  ) {
    isAlreadySignedUp = true;
  } else {
    usuarios.push(req);
  }
  console.log(usuarios);
}

const app = express(); // cria um servidor
app.use(cors());
app.use(express.json());

//Sign up
app.post("/sign-up", (req, res) => {
  handleSignup(req.body);

  //   res.send("OK");
  res.send(req.body);
});

app.get("/", (req, res) => {
  res.send("Colé");
});

// configura o servidor pra rodar na porta 4000
app.listen(5000, () => {
  console.log("ouvindo 5000");
});
