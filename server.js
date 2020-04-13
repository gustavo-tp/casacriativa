const express = require('express');
const server = express();

const db = require('./db');

server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }));

const nunjucks = require('nunjucks');
nunjucks.configure('views', {
  express: server,
  noCache: true,
});

server.get('/', (req, res) => {
  db.all(`SELECT * FROM ideas`, (error, rows) => {
    if (error) {
      console.log(error);
      res.send('Erro no banco de dados');
    }

    const lastIdeas = [...rows].reverse().slice(0, 3);

    return res.render('index.html', { ideas: lastIdeas });
  });
});

server.get('/ideias', (req, res) => {
  db.all(`SELECT * FROM ideas`, (error, rows) => {
    if (error) {
      console.log(error);
      res.send('Erro no banco de dados');
    }

    return res.render('ideias.html', { ideas: [...rows].reverse() });
  });
});

server.post('/', (req, res) => {
  const query = `
    INSERT INTO ideas(
      image,
      title,
      category,
      description,
      link
    ) VALUES (?,?,?,?,?);
  `;

  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link,
  ];

  db.run(query, values, (error) => {
    if (error) {
      console.log(error);
      res.send('Erro no banco de dados');
    }

    return res.redirect('/ideias');
  });
});

server.get('/ideas/delete/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM ideas WHERE id = ?`, [id], (error) => {
    if (error) {
      console.log(error);
      res.send('Erro no banco de dados');
    }

    return res.redirect('/ideias');
  });
});

server.listen(3000);
