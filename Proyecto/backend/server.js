const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

app.use(cors());
app.use(bodyParser.json());

// Middleware para servir archivos estáticos
app.use('/achievements', express.static(path.join(__dirname, '..', 'frontend', 'public', 'achievements')));

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

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    next();
};

// Ruta para obtener todos los usuarios (solo para administradores)
app.get('/users', authenticateToken, authorizeAdmin, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.json(data);
        }
    });
});

// Ruta para obtener un usuario por email
app.get('/users/:email', authenticateToken, (req, res) => {
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
app.post('/users', async (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'users.json'), async (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const { name, nickname, email, password, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { id: uuidv4(), name, nickname, email, password: hashedPassword, role: role || 'user', achievements: [] };
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

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    console.log(`Intentando iniciar sesión con identifier: ${identifier} y password: ${password}`);
    
    readJsonFile(path.join(__dirname, 'data', 'users.json'), async (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err);
            return res.status(500).send('Error al leer el archivo');
        }

        const user = data.find(user => (user.email === identifier || user.nickname === identifier));
        if (!user) {
            console.warn('Usuario no encontrado');
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.warn('Contraseña incorrecta');
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        try {
            const token = generateToken(user);
            console.log('Token generado:', token);
            return res.status(200).send({ user, token });
        } catch (tokenError) {
            console.error('Error al generar el token', tokenError);
            return res.status(500).send('Error al generar el token');
        }
    });
});


// Ruta para actualizar el rol de un usuario (solo para administradores)
app.put('/users/:id/role', authenticateToken, authorizeAdmin, (req, res) => {
    const { role } = req.body;
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const userIndex = data.findIndex(user => user.id === req.params.id);
            if (userIndex !== -1) {
                data[userIndex].role = role;
                writeJsonFile(path.join(__dirname, 'data', 'users.json'), data, err => {
                    if (err) {
                        res.status(500).send('Error al escribir el archivo');
                    } else {
                        res.status(200).send(data[userIndex]);
                    }
                });
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        }
    });
});

// Ruta para actualizar un usuario
app.put('/users/:email', authenticateToken, (req, res) => {
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
app.delete('/users/:email', authenticateToken, authorizeAdmin, (req, res) => {
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

// Crear una nueva publicación
app.post('/posts', authenticateToken, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const newPost = { ...req.body, id: Date.now().toString(), userId: req.user.id, likes: 0, dislikes: 0, comments: [], deletedBy: null };
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
app.post('/posts/:postId/comments', authenticateToken, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const post = data.find(p => p.id === req.params.postId);
            if (post) {
                const newComment = { ...req.body, id: Date.now().toString(), userId: req.user.id };
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
app.post('/posts/:postId/like', authenticateToken, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const post = data.find(p => p.id === req.params.postId);
            if (post) {
                if (!post.likedBy) post.likedBy = [];
                if (post.likedBy.includes(req.user.id)) {
                    res.status(400).send('Ya has dado like a esta publicación');
                    return;
                }
                post.likes += 1;
                post.likedBy.push(req.user.id);
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
app.post('/posts/:postId/dislike', authenticateToken, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const post = data.find(p => p.id === req.params.postId);
            if (post) {
                if (!post.dislikedBy) post.dislikedBy = [];
                if (post.dislikedBy.includes(req.user.id)) {
                    res.status(400).send('Ya has dado dislike a esta publicación');
                    return;
                }
                post.dislikes += 1;
                post.dislikedBy.push(req.user.id);
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

// Ruta para actualizar una publicación
app.put('/posts/:id', authenticateToken, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            const postIndex = data.findIndex(post => post.id == req.params.id);
            if (postIndex === -1) {
                return res.status(404).send('Publicación no encontrada');
            }
            if (data[postIndex].userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).send('No autorizado para modificar esta publicación');
            }
            data[postIndex] = { ...data[postIndex], ...req.body };
            writeJsonFile(path.join(__dirname, 'data', 'posts.json'), data, err => {
                if (err) {
                    res.status(500).send('Error al escribir el archivo');
                } else {
                    res.status(200).send(data[postIndex]);
                }
            });
        }
    });
});

// Ruta para eliminar una publicación
app.delete('/posts/:id', authenticateToken, (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'posts.json'), (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const postIndex = data.findIndex(post => post.id == req.params.id);
        if (postIndex === -1) {
            return res.status(404).send('Publicación no encontrada');
        }
        if (data[postIndex].userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).send('No autorizado para eliminar esta publicación');
        }
        data[postIndex].deletedBy = req.user.role === 'admin' ? req.user.id : null;
        writeJsonFile(path.join(__dirname, 'data', 'posts.json'), data, err => {
            if (err) {
                return res.status(500).send('Error al escribir el archivo');
            }
            res.status(204).send();
        });
    });
});

// Ruta para obtener todos los logros
app.get('/achievements', (req, res) => {
    readJsonFile(path.join(__dirname, 'data', 'achievements.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.json(data);
        }
    });
});

// Ruta para obtener los logros de un usuario
app.get('/users/:id/achievements', authenticateToken, (req, res) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).send('No autorizado');
    }
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, users) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const user = users.find(user => user.id === req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).send(user.achievements || []);
    });
});

// Ruta para asignar un logro a un usuario (solo para administradores)
app.post('/users/:id/achievements', authenticateToken, authorizeAdmin, (req, res) => {
    const { criteria } = req.body;
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, users) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const user = users.find(user => user.id === req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        if (!user.achievements.includes(criteria)) {
            user.achievements.push(criteria);
            writeJsonFile(path.join(__dirname, 'data', 'users.json'), users, err => {
                if (err) {
                    return res.status(500).send('Error al escribir el archivo');
                }
                res.status(200).send(user);
            });
        } else {
            res.status(400).send('Logro ya asignado al usuario');
        }
    });
});

// Ruta para quitar un logro a un usuario (solo para administradores)
app.delete('/users/:id/achievements', authenticateToken, authorizeAdmin, (req, res) => {
    const { criteria } = req.body;
    readJsonFile(path.join(__dirname, 'data', 'users.json'), (err, users) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const user = users.find(user => user.id === req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        user.achievements = user.achievements.filter(achievement => achievement !== criteria);
        writeJsonFile(path.join(__dirname, 'data', 'users.json'), users, err => {
            if (err) {
                return res.status(500).send('Error al escribir el archivo');
            }
            res.status(200).send(user);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
