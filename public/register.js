document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('register-error-message');

    // Validación en el cliente
    if (!firstName || !lastName || username.length < 3 || !email || password.length < 6 || password !== confirmPassword) {
        errorMessage.textContent = 'Todos los campos son obligatorios. Asegúrate de que las contraseñas coincidan.';
        errorMessage.style.display = 'block';
        return;
    }

    // Enviar datos al servidor
    const userData = {
        firstName,
        lastName,
        username,
        email,
        password
    };
    
    console.log('Datos a enviar:', userData);

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Usuario registrado exitosamente') {
            alert('¡Cuenta creada con éxito!');
            errorMessage.style.display = 'none'; 
        } else {
            errorMessage.textContent = data.message;
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        errorMessage.textContent = 'Hubo un error al registrar la cuenta. Intenta nuevamente.';
        errorMessage.style.display = 'block';
    });
});
