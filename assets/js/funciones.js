$(function () {
    // $(".salir").click(function (e) {
    //     localStorage.removeItem('tokenJWT');
    //     window.location.href = '/login.html';
    // })
   // verificarAutenticacion()
   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}
    subirArchivo() 
    descargarPDF()
})
// Verifica si hay un token JWT en el almacenamiento local
const token = localStorage.getItem('tokenJWT');
console.log(token)
// Inicializa usuarioAutenticado basado en la presencia del token
const usuarioAutenticado = !!token;


function enviarFormulario() {
    var cargoData = {
        id: document.getElementById("cargo").value
    };

    var curriculumData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        phoneWork: document.getElementById("phoneWork").value,
        profession: document.getElementById("profession").value,
        maritalStatus: document.getElementById("maritalStatus").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        gender: document.getElementById("gender").value,
        bloodType: document.getElementById("bloodType").value,
        birthDate: document.getElementById("birthDate").value,
        disabled: document.getElementById("disabled").checked,
        createDate: document.getElementById("createDate").value,
        editDate: document.getElementById("editDate").value,
        userCreate: document.getElementById("userCreate").value,
        documentType: document.getElementById("documentType").value,
        documentId: document.getElementById("documentId").value,
        cargo: cargoData
    };

    // Crear un objeto FormData y agregar los datos del curriculum
    var formData = new FormData();
    formData.append('json', JSON.stringify(curriculumData));
    formData.append('file', document.getElementById('file').files[0]);

    // Realizar la solicitud AJAX utilizando Fetch
    fetch('http://localhost:8080/cv', {
        method: 'POST',
        body: formData
    })
  
    //.then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        // Manejar la respuesta del servidor aquí
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        // Manejar errores aquí
    });
}



function verificarAutenticacion() {

    if (!usuarioAutenticado) {
        window.location.href = '/login.html'; // Redirige al usuario a la página de inicio de sesión
        alert("dsd")
    }
}

function descargarPDF() {
    $("#descargar").click(function (e) {
        const cedula = document.getElementById("documentId").value

        fetch('http://localhost:8080/cv/pdf/' + cedula, {
            method: 'GET'
        })
            .then(response => response.blob())
            .then(blob => {
                // Crear un objeto Blob con el contenido descargado
                var blob = new Blob([blob], { type: 'application/pdf' });

                // Crear un enlace de descarga
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);

                // Establecer el nombre de archivo
                link.download = 'nombre_archivo.pdf';

                // Añadir el enlace al DOM y hacer clic en él
                document.body.appendChild(link);
                link.click();

                // Eliminar el enlace del DOM después de la descarga
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                // Manejar errores aquí
            });
    })
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


