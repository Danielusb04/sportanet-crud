const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sportanet'
});

// Get all users
app.get('/usuarios', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}`);

    connection.query('SELECT * FROM usuarios', (err, rows) => {
      connection.release();

      if (!err) {
        res.json(rows);
      } else {
        console.error(err);
        res.status(500).send('Error al obtener los usuarios');
      }
    });
  });
});


app.get('/usuarios/:id', (req, res) => {
    console.log('➡️ Entró a la ruta /:id con valor:', req.params.id);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}`);

    connection.query('SELECT * FROM usuarios where id_usuario = ?', [req.params.id], (err, rows) => {
      connection.release();

      if (!err) {   
        res.json(rows);
      } else {
        console.error(err);
        res.status(500).send('Error al obtener los usuarios');
      }
    });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`deleting users with ID ${req.params.id}`);

    connection.query('DELETE FROM usuarios where id_usuario = ?', [req.params.id], (err, rows) => {
      connection.release();

      if (!err) {   
        res.json(`User with the record ID: ${[req.params.id]} has been deleted.`);
      } else {
        console.error(err);
        res.status(500).send('Error al eliminar el usuario');
      }
    });
  });   
});


app.post('/usuarios', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as ID ${req.params.id}`);

    const params = req.body;

    connection.query('INSERT INTO usuarios SET ?', [params] , (err, rows) => {
      connection.release();

      if (!err) {   
        res.json(`User with the record ID: ${[req.params.id]} has been created.`);
      } else {
        console.error(err);
        res.status(500).send('Error al crear el usuario');
      }
    });

    console.log(req.body);

  });   
});


app.put('/usuarios', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as ID ${req.params.id}`);

    const {id, nombre, correo, telefono, edad, genero} = req.body;

    connection.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [{nombre, correo, telefono, edad, genero}, id] , (err, rows) => {
      connection.release();

      if (!err) {   
        res.json(`User with the record ID: ${[req.params.id]} has been updated.`);
      } else {
        console.error(err);
        res.status(500).send('Error al actualizar el usuario');
      }
    });

    console.log(req.body);

  });   
});





// Listen on port
app.listen(port, () => console.log(`✅ Server running on port ${port}`));

