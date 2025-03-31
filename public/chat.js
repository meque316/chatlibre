document.getElementById("send-button").addEventListener("click", function () {
    const input = document.getElementById("message-input");
    const messages = document.getElementById("messages");

    const username = localStorage.getItem('username');  // Recupera el nombre de usuario

    if (input.value.trim() !== "" && username) {
        const message = {
            username: username,
            message: input.value
        };

        // Guardar el mensaje en el archivo JSON
        saveMessage(message);

        // Mostrar el mensaje en la interfaz
        const messageDiv = document.createElement("div");

        // Crear un contenedor para el avatar y el mensaje
        const avatarContainer = document.createElement("div");
        avatarContainer.style.display = "flex";
        avatarContainer.style.alignItems = "center";

        // Crear la miniatura del avatar
        const avatarImg = document.createElement("img");
        avatarImg.style.width = "30px";
        avatarImg.style.height = "30px";
        avatarImg.style.borderRadius = "50%";
        avatarImg.style.marginRight = "10px";

        // Obtener el avatar desde localStorage
        const avatarData = localStorage.getItem("user-avatar");
        if (avatarData) {
            avatarImg.src = avatarData;
        } else {
            avatarImg.src = "default-avatar.png";  // Usar un avatar por defecto si no hay uno guardado
        }

        // Agregar la imagen al contenedor
        avatarContainer.appendChild(avatarImg);

        // Crear el texto del mensaje
        const messageText = document.createElement("span");
        messageText.textContent = `${message.username}: ${message.message}`;

        // Estilos del mensaje
        messageText.style.padding = "10px";
        messageText.style.margin = "5px 0";
        messageText.style.borderRadius = "10px";
        messageText.style.background = "#3498db";
        messageText.style.color = "white";

        // Agregar el texto del mensaje al contenedor
        avatarContainer.appendChild(messageText);

        // Agregar el contenedor de avatar y mensaje al contenedor de mensajes
        messages.appendChild(avatarContainer);

        input.value = "";
        messages.scrollTop = messages.scrollHeight;
    }
});

function saveMessage(message) {
    fetch('/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el mensaje');
        }
        return response.json();
    })
    .then(data => {
        console.log("Mensaje guardado:", data);  // Mostrar la respuesta del servidor
    })
    .catch(error => {
        console.error("Error al guardar mensaje:", error);
    });
}

// Función para cargar los mensajes desde el servidor
function loadMessages() {
    fetch('/messages.json')
        .then(response => response.json())
        .then(messages => {
            const messagesContainer = document.getElementById("messages");
            messagesContainer.innerHTML = ''; // Limpiar el contenedor antes de cargar los nuevos mensajes
            messages.forEach(msg => {
                const msgDiv = document.createElement("div");

                // Crear un contenedor para el avatar y el mensaje
                const avatarContainer = document.createElement("div");
                avatarContainer.style.display = "flex";
                avatarContainer.style.alignItems = "center";

                // Crear la miniatura del avatar
                const avatarImg = document.createElement("img");
                avatarImg.style.width = "30px";
                avatarImg.style.height = "30px";
                avatarImg.style.borderRadius = "50%";
                avatarImg.style.marginRight = "10px";

                // Obtener el avatar del usuario desde localStorage
                const savedAvatar = localStorage.getItem("user-avatar");
                if (savedAvatar) {
                    avatarImg.src = savedAvatar;
                } else {
                    avatarImg.src = "default-avatar.png";  // Usar avatar por defecto
                }

                // Agregar la imagen al contenedor
                avatarContainer.appendChild(avatarImg);

                // Crear el texto del mensaje
                const messageText = document.createElement("span");
                messageText.textContent = `${msg.username}: ${msg.message || 'Mensaje vacío'}`;

                // Estilos del mensaje
                messageText.style.padding = "10px";
                messageText.style.margin = "5px 0";
                messageText.style.borderRadius = "10px";
                messageText.style.background = "#3498db";
                messageText.style.color = "white";

                // Agregar el texto del mensaje al contenedor
                avatarContainer.appendChild(messageText);

                // Agregar el contenedor de avatar y mensaje al contenedor de mensajes
                messagesContainer.appendChild(avatarContainer);
            });
        })
        .catch(error => console.error("Error al cargar los mensajes:", error));
}

// Función para cerrar sesión
document.getElementById("logout-button").addEventListener("click", function () {
    // Eliminar el nombre de usuario del localStorage
    localStorage.removeItem("username");

    // Redirigir al index.html
    window.location.href = "index.html";
});

// Cambiar avatar
document.getElementById("upload-avatar").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Guardar el avatar en localStorage
                const avatarData = e.target.result; // Base64
                localStorage.setItem("user-avatar", avatarData);

                // Actualizar la imagen del avatar en la interfaz
                document.getElementById("user-avatar").src = avatarData;
            };
            reader.readAsDataURL(file); // Convertir el archivo a base64
        }
    });
});

// Cargar el avatar desde localStorage cuando se carga la página
window.addEventListener("load", function () {
    const savedAvatar = localStorage.getItem("user-avatar");
    if (savedAvatar) {
        // Si hay un avatar guardado, lo cargamos
        document.getElementById("user-avatar").src = savedAvatar;
    }
});

// Cargar los mensajes cada 3 segundos (polling)
setInterval(loadMessages, 3000); // Consulta cada 3 segundos





