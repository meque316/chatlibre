const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;  // Usa el puerto asignado por Render

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

// Para manejar datos POST (como los datos de registro)
app.use(express.json());  // Permite recibir datos JSON en el cuerpo de la solicitud

// Para servir archivos estáticos como el HTML, CSS y JS
app.use(express.static('public'));

// Ruta para servir el archivo users.json
app.get('/users.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'users.json'));  // Asegúrate de que 'users.json' esté en la raíz de tu proyecto
});

// Ruta para manejar el registro de usuarios
app.post('/register', (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    // Leer el archivo users.json para obtener los usuarios actuales
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error al leer el archivo de usuarios.' });
        }

        const users = JSON.parse(data);  // Convertir el contenido de users.json a un objeto

        // Verificar si el nombre de usuario ya está registrado
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).send({ message: 'El nombre de usuario ya está registrado.' });
        }

        // Agregar el nuevo usuario al array
        const newUser = { firstName, lastName, username, email, password };
        users.push(newUser);

        // Guardar los usuarios actualizados en users.json
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar el usuario.' });
            }
            res.status(200).send({ message: 'Usuario registrado con éxito.' });
        });
    });
});

// Ruta para autenticar al usuario (login)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Leer el archivo users.json para obtener los usuarios
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error al leer el archivo de usuarios.' });
        }

        const users = JSON.parse(data);  // Convertir el contenido de users.json a un objeto

        // Buscar al usuario por su username
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).send({ message: 'Nombre de usuario incorrecto' });
        }

        // Verificar si la contraseña coincide
        if (user.password === password) {
            res.status(200).send({ message: 'Autenticación exitosa', user: { username: user.username } });
        } else {
            res.status(400).send({ message: 'Contraseña incorrecta' });
        }
    });
});

// Ruta para cargar los mensajes del chat
app.get('/messages.json', (req, res) => {
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error al leer los mensajes.' });
        }
        res.send(data);
    });
});

// Ruta para manejar el envío de mensajes
app.post('/sendMessage', (req, res) => {
    const { username, message } = req.body;

    // Guardar el mensaje en el archivo JSON
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error al leer el archivo de mensajes.' });
        }

        const messages = JSON.parse(data);  // Convertir el contenido de messages.json a un objeto
        messages.push({ username, message }); // Agregar el nuevo mensaje

        // Guardar los mensajes actualizados
        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar el mensaje.' });
            }
            res.status(200).send({ message: 'Mensaje enviado correctamente' });  // Respuesta adecuada
        });
    });
});

// Arrancar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});




