document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (username.length < 3 || password.length < 6) {
        errorMessage.textContent = 'El nombre de usuario debe tener al menos 3 caracteres y la contraseña al menos 6.';
        errorMessage.style.display = 'block'; 
        return;
    }

    // Llamada a authenticateUser para validar el login
    authenticateUser(username, password).then(response => {
        if (response.success) {
            // Guardar el nombre de usuario en localStorage
            localStorage.setItem('username', username);

            alert('¡Inicio de sesión exitoso!');
            errorMessage.style.display = 'none'; // Ocultamos el mensaje de error

            // Redirigir al chat después de un login exitoso
            window.location.href = '/chat.html'; 
        } else {
            errorMessage.textContent = response.message;
            errorMessage.style.display = 'block'; // Mostramos el mensaje de error
        }
    });
});

// Función que autentica al usuario con los datos de users.json
function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        // Realizar una solicitud GET al servidor para obtener los usuarios
        fetch('/users.json')
            .then(response => response.text())  // Usamos .text() para obtener la respuesta como texto
            .then(text => {
                console.log('Respuesta del servidor:', text);  // Aquí puedes ver el contenido completo de la respuesta
                try {
                    const users = JSON.parse(text);  // Intentamos analizar el texto como JSON
                    // Buscar al usuario por su username
                    const user = users.find(u => u.username === username);

                    if (!user) {
                        resolve({ success: false, message: 'Nombre de usuario incorrecto' });
                        return;
                    }

                    // Verificar si la contraseña coincide
                    if (user.password === password) {
                        resolve({ success: true });
                    } else {
                        resolve({ success: false, message: 'Contraseña incorrecta' });
                    }
                } catch (error) {
                    console.error('Error al analizar JSON:', error);
                    resolve({ success: false, message: 'Hubo un problema con el archivo de usuarios.' });
                }
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
                resolve({ success: false, message: 'No se pudo cargar el archivo de usuarios.' });
            });
    });
}

document.getElementById('recoverPassword').addEventListener('click', function(event) {
    event.preventDefault();
    alert('Función aun no implementada.');
});

