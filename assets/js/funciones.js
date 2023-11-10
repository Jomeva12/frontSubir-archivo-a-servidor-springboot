$(function () {
    $(".salir").click(function (e) {
        localStorage.removeItem('tokenJWT');
        window.location.href = '/login.html';
    })
    verificarAutenticacion()
    subirArchivo() 
})
// Verifica si hay un token JWT en el almacenamiento local
const token = localStorage.getItem('tokenJWT');
console.log(token)
// Inicializa usuarioAutenticado basado en la presencia del token
const usuarioAutenticado = !!token;
function verificarAutenticacion() {

    if (!usuarioAutenticado) {
        window.location.href = '/login.html'; // Redirige al usuario a la página de inicio de sesión
        alert("dsd")
    }
}
function subirArchivo() {
    $("#btn_subir").click(function (e) {
        e.preventDefault()

        var file = $("#fileInput")[0].files[0];
        if (file) {
            var formData = new FormData();
            formData.append('file', file);

            var headers = new Headers({
                'Authorization': 'Bearer ' + token
            });
          
            fetch('http://localhost:8080/media/upload', {
                headers: headers,
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                })
                .catch(error => {
                    console.error('Error al subir el archivo:', error);
                });
        } else {
            console.error('No se ha seleccionado ningún archivo.');
        }
    })
}


