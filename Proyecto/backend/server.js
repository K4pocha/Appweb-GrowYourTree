const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const { connectDB, getDB } = require('./database');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Verificar que la variable de entorno JWT_SECRET esté definida
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

// Middleware para habilitar CORS y parsear el cuerpo de las peticiones
app.use(cors());
app.use(bodyParser.json());

connectDB();


// Middleware para servir archivos estáticos
app.use('/achievements', express.static(path.join(__dirname, 'public', 'achievements')));

// Middleware de autenticación
function authenticateToken(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        const db = getDB();
        const dbUser = await db.collection('users').findOne({ id: user.id });

        if (!dbUser) return res.sendStatus(404);

        req.user = {
            id: dbUser.id,
            nickname: dbUser.nickname,
            email: dbUser.email,
            role: dbUser.role
        };

        next();
    });
}


// Middleware para autorizar a los administradores
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    next();
};

// Función para generar un token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });
};

// ------------------------------ Rutas de usuarios ------------------------------

// Ruta para obtener todos los usuarios (solo para administradores)
app.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
    const db = getDB();
    try {
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta para obtener un usuario por email
app.get('/users/:email', authenticateToken, async (req, res) => {
    const db = getDB();
    try {
        const user = await db.collection('users').findOne({ email: req.params.email });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al obtener usuario');
    }
});

// Ruta registro de usuario
app.post('/users', async (req, res) => {
    const { name, nickname, email, password, role } = req.body;
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), name, nickname, email, password: hashedPassword, role: role || 'user', achievements: [] };

    try {
        await db.collection('users').insertOne(newUser);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send('Error al crear usuario');
    }
});


// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    const db = getDB();

    try {
        const user = await db.collection('users').findOne({ $or: [{ email: identifier }, { nickname: identifier }] });
        if (!user) {
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        const token = generateToken(user);
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta para actualizar el rol de un usuario (solo para administradores)
app.put('/users/:id/role', authenticateToken, authorizeAdmin, async (req, res) => {
    const db = getDB();
    const { role } = req.body;

    try {
        const result = await db.collection('users').updateOne({ id: req.params.id }, { $set: { role } });
        if (result.matchedCount > 0) {
            const updatedUser = await db.collection('users').findOne({ id: req.params.id });
            res.status(200).send(updatedUser);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al actualizar rol de usuario');
    }
});

// Ruta para actualizar un usuario
app.put('/users/:email', authenticateToken, async (req, res) => {
    const db = getDB();
    const updatedUser = req.body;

    try {
        const result = await db.collection('users').updateOne({ email: req.params.email }, { $set: updatedUser });
        if (result.matchedCount > 0) {
            res.status(200).send(updatedUser);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al actualizar usuario');
    }
});

// Ruta para eliminar un usuario
app.delete('/users/:email', authenticateToken, authorizeAdmin, async (req, res) => {
    const db = getDB();
    try {
        const result = await db.collection('users').deleteOne({ email: req.params.email });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar usuario');
    }
});

// Ruta para actualizar la contraseña de un usuario
app.put('/users/:id/password', authenticateToken, async (req, res) => {
    const { password } = req.body;
    const db = getDB();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').updateOne({ id: req.params.id }, { $set: { password: hashedPassword } });
        if (result.matchedCount > 0) {
            res.status(200).send('Contraseña actualizada correctamente');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al actualizar contraseña');
    }
});

// ------------------------------ Fin usuarios ------------------------------

// ------------------------------ Rutas de publicaciones ------------------------------

// Crear una nueva publicación
app.post('/posts', authenticateToken, async (req, res) => {
    const db = getDB();
    const newPost = {
        ...req.body,
        id: uuidv4(),
        userId: req.user.id,
        nickname: req.user.nickname,
        likes: [],
        dislikes: [],
        comments: [],
        deleted: false,
        deletedBy: null
    };

    try {
        await db.collection('posts').insertOne(newPost);
        res.status(201).send(newPost);
    } catch (error) {
        res.status(500).send('Error al crear publicación');
    }
});

// Obtener todas las publicaciones (filtradas por sección y eliminadas si es admin)
app.get('/posts', authenticateToken, async (req, res) => {
    const db = getDB();
    const section = req.query.section;
    try {
        let query = { section: section, deleted: false };
        if (req.user.role === 'admin') {
            query = { section: section }; // Admins can see all posts in the section
        }
        const posts = await db.collection('posts').find(query).toArray();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send('Error al obtener publicaciones');
    }
});

// Eliminar (lógicamente) una publicación
app.delete('/posts/:id', authenticateToken, async (req, res) => {
    const db = getDB();
    try {
        const result = await db.collection('posts').updateOne(
            { id: req.params.id },
            { $set: { deleted: true, deletedBy: req.user.id } }
        );
        if (result.matchedCount > 0) {
            res.status(200).send('Publicación eliminada');
        } else {
            res.status(404).send('Publicación no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar publicación');
    }
});

// Obtener una publicación por id
app.get('/posts/:id', authenticateToken, async (req, res) => {
    const db = getDB();
    try {
        const post = await db.collection('posts').findOne({ id: req.params.id });
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send('Publicación no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al obtener la publicación');
    }
});

// Dar like a una publicación
app.post('/posts/:id/like', authenticateToken, async (req, res) => {
    const db = getDB();
    try {
        const post = await db.collection('posts').findOne({ id: req.params.id });
        if (!post) {
            return res.status(404).send('Publicación no encontrada');
        }

        if (post.likes.includes(req.user.id)) {
            return res.status(400).send('Ya has dado like a esta publicación');
        }

        if (post.dislikes.includes(req.user.id)) {
            post.dislikes = post.dislikes.filter(id => id !== req.user.id);
        }

        post.likes.push(req.user.id);

        await db.collection('posts').updateOne(
            { id: req.params.id },
            { $set: { likes: post.likes, dislikes: post.dislikes } }
        );

        res.status(200).send('Like agregado');
    } catch (error) {
        res.status(500).send('Error al agregar like');
    }
});

// Dar dislike a una publicación
app.post('/posts/:id/dislike', authenticateToken, async (req, res) => {
    const db = getDB();
    try {
        const post = await db.collection('posts').findOne({ id: req.params.id });
        if (!post) {
            return res.status(404).send('Publicación no encontrada');
        }

        if (post.dislikes.includes(req.user.id)) {
            return res.status(400).send('Ya has dado dislike a esta publicación');
        }

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id !== req.user.id);
        }

        post.dislikes.push(req.user.id);

        await db.collection('posts').updateOne(
            { id: req.params.id },
            { $set: { likes: post.likes, dislikes: post.dislikes } }
        );

        res.status(200).send('Dislike agregado');
    } catch (error) {
        res.status(500).send('Error al agregar dislike');
    }
});

// Obtener una publicación por id con nombre de usuario
app.get('/posts/:id', authenticateToken, async (req, res) => {
    const db = getDB();
    try {
        const post = await db.collection('posts').findOne({ id: req.params.id });
        if (post) {
            const user = await db.collection('users').findOne({ id: post.userId });
            post.nickname = user ? user.nickname : 'Desconocido';
            res.status(200).json(post);
        } else {
            res.status(404).send('Publicación no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al obtener la publicación');
    }
});

// Agregar un comentario a una publicación
app.post('/posts/:id/comments', authenticateToken, async (req, res) => {
    const db = getDB();
    const comment = {
        id: uuidv4(),
        userId: req.user.id,
        nickname: req.user.nickname,
        content: req.body.content,
        createdAt: new Date()
    };

    try {
        const result = await db.collection('posts').updateOne(
            { id: req.params.id },
            { $push: { comments: comment } }
        );
        if (result.matchedCount > 0) {
            res.status(201).send(comment);
        } else {
            res.status(404).send('Publicación no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al agregar comentario');
    }
});

// ------------------------------ Fin publicaciones ------------------------------

// ------------------------------ Rutas de logros ------------------------------

// Ruta para obtener todos los logros
app.get('/achievements', async (req, res) => {
    const db = getDB();
    try {
        const achievements = await db.collection('achievements').find().toArray();
        res.status(200).json(achievements);
    } catch (error) {
        res.status(500).send('Error al obtener logros');
    }
});

// Ruta para obtener los logros de un usuario
app.get('/users/:id/achievements', authenticateToken, async (req, res) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).send('No autorizado');
    }
    const db = getDB();
    try {
        const user = await db.collection('users').findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).send(user.achievements || []);
    } catch (error) {
        res.status(500).send('Error al obtener logros del usuario');
    }
});

// Ruta para asignar un logro a un usuario (solo para administradores)
app.post('/users/:id/achievements', authenticateToken, authorizeAdmin, async (req, res) => {
    const { criteria } = req.body;
    const db = getDB();
    try {
        const user = await db.collection('users').findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        if (!user.achievements.includes(criteria)) {
            user.achievements.push(criteria);
            await db.collection('users').updateOne({ id: req.params.id }, { $set: { achievements: user.achievements } });
            res.status(200).send(user);
        } else {
            res.status(400).send('Logro ya asignado al usuario');
        }
    } catch (error) {
        res.status(500).send('Error al asignar logro');
    }
});

// Ruta para quitar un logro a un usuario (solo para administradores)
app.delete('/users/:id/achievements', authenticateToken, authorizeAdmin, async (req, res) => {
    const { criteria } = req.body;
    const db = getDB();
    try {
        const user = await db.collection('users').findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        user.achievements = user.achievements.filter(achievement => achievement !== criteria);
        await db.collection('users').updateOne({ id: req.params.id }, { $set: { achievements: user.achievements } });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Error al quitar logro');
    }
});

// ------------------------------ Fin logros ------------------------------

// ------------------------------ Rutas de recomendaciones ------------------------------

// Obtener recomendaciones diarias
app.get('/recommendations', async (req, res) => {
    const db = getDB();
    try {
        const recommendations = await db.collection('recommendations').find().toArray();
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).send('Error al obtener las recomendaciones');
    }
});

// Actualizar recomendaciones diarias
app.put('/recommendations', authenticateToken, async (req, res) => {
    const db = getDB();
    const { recommendations } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).send('Acceso denegado');
    }

    try {
        await db.collection('recommendations').deleteMany({});
        await db.collection('recommendations').insertMany(recommendations);
        res.status(200).send('Recomendaciones actualizadas');
    } catch (error) {
        res.status(500).send('Error al actualizar las recomendaciones');
    }
});

// ------------------------------ Fin recomendaciones ------------------------------

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
