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

  let usuarioDoTwitte = usuarios.find((x) => x.username === req.headers.user);

  if (!usuarioDoTwitte || usuarioDoTwitte.length === 0) {
    console.log("Não está cadastrado");
    return;
  }

  let tweet = {
    username: req.headers.user,
    tweet: req.body.tweet,
    avatar: usuarioDoTwitte.avatar,
  };

  tweets.unshift(tweet);

  console.log(tweets);
}

function getLast10Tweets(page) {
  let lastTen = [];
  if (page > 1 && tweets.length <= 10) page = 1;
  for (let i = (page - 1) * 10; i < tweets.length; i++) {
    lastTen.push(tweets[i]);
    if (lastTen.length == 10) break;
  }

  return lastTen;
}

function getTwittesFromUser(user) {
  let tweetsFromUser = tweets.filter((tweet) => tweet.username == user);

  return tweetsFromUser;
}

const app = express(); // cria um servidor
app.use(cors());
app.use(express.json());

//Sign up
app.post("/sign-up", (req, res) => {
  handleSignup(req.body);

  if (!req.body || !req.body.username || !req.body.avatar) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  res.status(201).send("OK");
});

//Tweets
app.post("/tweets", (req, res) => {
  handleTweet(req);

  if (!req.body || !req.headers.user || !req.body.tweet) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  res.status(201).send("OK");
});

// Get  Tweets
app.get("/tweets", (req, res) => {
  const page = parseInt(req.query.page);
  if (page < 1) res.status(400).send("Informe uma página válida!");
  let resposta = getLast10Tweets(page);

  res.send(resposta);
});

// Get  Tweets from user
app.get("/tweets/:username", (req, res) => {
  let user = req.params.username;
  let resposta = getTwittesFromUser(user);
  if (!resposta || resposta.length === 0) res.sendStatus(400);
  res.send(resposta);
});

// configura o servidor pra rodar na porta 4000
app.listen(5000, () => {
  console.log("ouvindo 5000");
});
