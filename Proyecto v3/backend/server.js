const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Ruta para obtener un usuario por email
app.get('/users/:email', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const users = JSON.parse(data);
            const user = users.find(user => user.email === req.params.email);
            if (user) {
                res.json(user);
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        }
    });
});

// Ruta para añadir un nuevo usuario
app.post('/users', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const users = JSON.parse(data);
            const newUser = req.body;
            users.push(newUser);
            fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error al escribir el archivo');
                } else {
                    res.status(201).send(newUser);
                }
            });
        }
    });
});

// Ruta para actualizar un usuario
app.put('/users/:email', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            let users = JSON.parse(data);
            const updatedUser = req.body;
            users = users.map(user => (user.email === req.params.email ? { ...user, ...updatedUser } : user));
            fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error al escribir el archivo');
                } else {
                    res.status(200).send(updatedUser);
                }
            });
        }
    });
});

// Ruta para eliminar un usuario
app.delete('/users/:email', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            let users = JSON.parse(data);
            users = users.filter(user => user.email !== req.params.email);
            fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error al escribir el archivo');
                } else {
                    res.status(204).send();
                }
            });
        }
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const users = JSON.parse(data);
            const user = users.find(user => (user.email === identifier || user.nickname === identifier) && user.password === password);
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(401).send('Correo o contraseña incorrectos');
            }
        }
    });
});

// Ruta para actualizar la contraseña
app.put('/users/:email/password', (req, res) => {
    const { oldPassword, newPassword } = req.body;
    fs.readFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            let users = JSON.parse(data);
            let user = users.find(user => user.email === req.params.email);
            if (user && user.password === oldPassword) {
                user.password = newPassword;
                users = users.map(u => (u.email === req.params.email ? user : u));
                fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        res.status(500).send('Error al escribir el archivo');
                    } else {
                        res.status(200).send(user);
                    }
                });
            } else {
                res.status(401).send('Contraseña antigua incorrecta');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
