$(function () {
    verificarAutenticacion()
    login()
})
// Verifica si hay un token JWT en el almacenamiento local
const tokenJWT = localStorage.getItem('tokenJWT');
// Inicializa usuarioAutenticado basado en la presencia del token
const usuarioAutenticado = !!tokenJWT;
function verificarAutenticacion() {
    if (!usuarioAutenticado) {
        // Verificar si la página actual no es la página de inicio de sesión
        if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
        }
    } else {
        // El usuario está autenticado y no necesitas redirigirlo a /login.html
    }
}
function login() {
    $(".btn-signin").click(function (e) {
        e.preventDefault()
        // Datos de usuario y contraseña
        const usuario = $("#email").val();
        const password = $("#password").val();

        // Crear un objeto con los datos en el formato requerido
        const datos = {
            email: usuario,
            password: password
        };

        // Después de recibir el token del servidor en la respuesta
        fetch('http://localhost:8080/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (response.status === 200) {
                    // El inicio de sesión fue exitoso, obtén el token desde la respuesta
                    return response.json();
                } else {
                    // El inicio de sesión falló, maneja el error según sea necesario
                    console.error('Inicio de sesión fallido');
                }
            })
            .then(data => {
                console.log(data)
                if (data && data.token) {
                    localStorage.setItem('tokenJWT', data.token);
                    console.log(data.token)
                    window.location.href = '/index.html'
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);

            })
    });

}