import express from "express";
import cors from "cors";
import { usuarios, tweets } from "./globalVariables.js";

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

function handleTweet(req) {
  console.log("Recebeu a request de tweet\n");

  let usuarioDoTwitte = usuarios.filter((x) => x.username === req.username);

  if (!usuarioDoTwitte) {
    console.log("Não está cadastrado");
    return;
  }

  let tweet = {
    username: req.username,
    tweet: req.tweet,
    avatar: usuarioDoTwitte[0].avatar,
  };

  tweets.push(tweet);

  console.log(tweets);
}

function getLast10Tweets() {
  let lastTen = [];
  for (let i = tweets.length - 1; i >= 0; i--) {
    lastTen.push(tweets[i]);
    if (lastTen.length == 10) break;
  }

  return lastTen;
}

const app = express(); // cria um servidor
app.use(cors());
app.use(express.json());

//Sign up
app.post("/sign-up", (req, res) => {
  handleSignup(req.body);

  res.send("OK");
});

//Tweets
app.post("/tweet", (req, res) => {
  handleTweet(req.body);

  res.send("OK");
});

// Get  Tweets
app.get("/tweets", (req, res) => {
  let resposta = getLast10Tweets();

  res.send(resposta);
});

// configura o servidor pra rodar na porta 4000
app.listen(5000, () => {
  console.log("ouvindo 5000");
});
