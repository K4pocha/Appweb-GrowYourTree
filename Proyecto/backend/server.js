const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const readJsonFile = (filePath, callback) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, JSON.parse(data));
        }
    });
};

const writeJsonFile = (filePath, data, callback) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.json(data);
        }
    });
});

// Ruta para obtener un usuario por email
app.get('/users/:email', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const user = data.find(user => user.email === req.params.email);
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
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const newUser = { id: uuidv4(), ...req.body };
            data.push(newUser);
            writeJsonFile(path.join(__dirname, 'data', 'users.json'), data, err => {
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
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const updatedUser = req.body;
            const users = data.map(user => (user.email === req.params.email ? { ...user, ...updatedUser } : user));
            writeJsonFile(path.join(__dirname, 'data', 'users.json'), users, err => {
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
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const users = data.filter(user => user.email !== req.params.email);
            writeJsonFile(path.join(__dirname, 'data', 'users.json'), users, err => {
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
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const user = data.find(user => (user.email === identifier || user.nickname === identifier) && user.password === password);
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
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const user = data.find(user => user.email === req.params.email);
            if (user && user.password === oldPassword) {
                user.password = newPassword;
                const users = data.map(u => (u.email === req.params.email ? user : u));
                writeJsonFile(path.join(__dirname, 'data', 'users.json'), users, err => {
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

// Crear una nueva publicación
app.post('/posts', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const newPost = { ...req.body, id: Date.now().toString(), likes: 0, dislikes: 0, comments: [] };
            data.push(newPost);
            writeJsonFile(path.join(__dirname, 'data', 'posts.json'), data, err => {
                if (err) {
                    res.status(500).send('Error al escribir el archivo');
                } else {
                    res.status(201).send(newPost);
                }
            });
        }
    });
});

// Obtener todas las publicaciones
app.get('/posts', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.json(data);
        }
    });
});

// Comentar en una publicación
app.post('/posts/:postId/comments', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const post = data.find(p => p.id === req.params.postId);
            if (post) {
                const newComment = { ...req.body, id: Date.now().toString() };
                post.comments.push(newComment);
                writeJsonFile(path.join(__dirname, 'data', 'posts.json'), data, err => {
                    if (err) {
                        res.status(500).send('Error al escribir el archivo');
                    } else {
                        res.status(201).send(newComment);
                    }
                });
            } else {
                res.status(404).send('Publicación no encontrada');
            }
        }
    });
});

// Dar like a una publicación
app.post('/posts/:postId/like', (req, res) => {
    const { userId } = req.body;
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const post = data.find(p => p.id === req.params.postId);
            if (post) {
                if (!post.likedBy) post.likedBy = [];
                if (post.likedBy.includes(userId)) {
                    res.status(400).send('Ya has dado like a esta publicación');
                    return;
                }
                post.likes += 1;
                post.likedBy.push(userId);
                writeJsonFile(path.join(__dirname, 'data', 'posts.json'), data, err => {
                    if (err) {
                        res.status(500).send('Error al escribir el archivo');
                    } else {
                        res.status(200).send(post);
                    }
                });
            } else {
                res.status(404).send('Publicación no encontrada');
            }
        }
    });
});

// Dar dislike a una publicación
app.post('/posts/:postId/dislike', (req, res) => {
    const { userId } = req.body;
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const post = data.find(p => p.id === req.params.postId);
            if (post) {
                if (!post.dislikedBy) post.dislikedBy = [];
                if (post.dislikedBy.includes(userId)) {
                    res.status(400).send('Ya has dado dislike a esta publicación');
                    return;
                }
                post.dislikes += 1;
                post.dislikedBy.push(userId);
                writeJsonFile(path.join(__dirname, 'data', 'posts.json'), data, err => {
                    if (err) {
                        res.status(500).send('Error al escribir el archivo');
                    } else {
                        res.status(200).send(post);
                    }
                });
            } else {
                res.status(404).send('Publicación no encontrada');
            }
        }
    });
});

// Logros

// Ruta para obtener logros de un usuario
app.get('/users/:email/achievements', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, users) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const user = users.find(user => user.email === req.params.email);
            if (user) {
                res.json(user.achievements || []);
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        }
    });
});

// Ruta para actualizar logros de un usuario
app.put('/users/:email/achievements', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, users) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const user = users.find(user => user.email === req.params.email);
            if (user) {
                user.achievements = req.body.achievements;
                const updatedUsers = users.map(u => (u.email === req.params.email ? user : u));
                writeJsonFile(path.join(__dirname, 'data', 'users.json'), updatedUsers, err => {
                    if (err) {
                        res.status(500).send('Error al escribir el archivo');
                    } else {
                        res.status(200).send(user);
                    }
                });
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
