$(function () {
    // $(".salir").click(function (e) {
    //     localStorage.removeItem('tokenJWT');
    //     window.location.href = '/login.html';
    // })
    // verificarAutenticacion()



    descargarDesdeTabla()
    listarSolicitudes()
    deleteFromTable()
    EditFromTable()
    closeModal()
    EditTR()
    descargarExcel() 
})
// Verifica si hay un token JWT en el almacenamiento local
const token = localStorage.getItem('tokenJWT');
console.log(token)
// Inicializa usuarioAutenticado basado en la presencia del token
const usuarioAutenticado = !!token;

function enviarFormularioTransaction() {
    // Obtener los valores del formulario
    var typeTransactionId = document.getElementById("typeTransaction").value;
    var days = document.getElementById("days").value;
    var comment = document.getElementById("comment").value;
    var idCurriculum = document.getElementById("idCurriculum").value;
    var idUser = document.getElementById("idUser").value;
    var disabledTransaction = document.getElementById("disabledTransaction").value;
    var fileInput = document.getElementById("file");

    // Crear objetos para DataTransaction y Transaction
    var dataTransaction = {
        typeTransaction: {
            id: typeTransactionId
        },
        statusTransaction: {
            id: 1 // Asumiendo que siempre es 1, ajusta según tus necesidades
        },
        disabled: false, // Cambiar a true si es necesario
        days: days,
        comment: comment
    };

    var transaction = {

        idCurriculum: {
            id: idCurriculum
        },
        idUsers: {
            iduser: idUser
        },
        disabled: false // Convertir a booleano
    };

    // Crear objeto que contiene ambos
    var requestData = {
        dataTransaction: dataTransaction,
        transaction: transaction
    };
    console.log(requestData)
    // Crear objeto FormData y agregar datos del formulario
    var formData = new FormData();
    formData.append('json', JSON.stringify(requestData));
    formData.append('file', fileInput.files[0]);


    // Realizar la solicitud AJAX utilizando Fetch
    fetch('http://localhost:8080/datatransaction', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            listarSolicitudes()
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
//la llamo desde la tabla
function descargarPDFTR(idData) {
    //$("#descargarData").click(function (e) {
    //const idData = document.getElementById("idData").value
    console.log("id-> ", idData)
    fetch('http://localhost:8080/datatransaction/pdf/' + idData, {
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
            link.download = "Solicitud" + '.pdf';

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
    // })
}
function listarSolicitudes() {
    // Realizar una solicitud GET a la API para obtener todas las canciones
    fetch('http://localhost:8080/datatransaction', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Llamar a una función para mostrar las canciones en la tabla
            mostrarSolicitudesEnTabla(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
//se llama al cargar
function mostrarSolicitudesEnTabla(data) {
    var plantilla = "";
    for (const [id, solicitud] of Object.entries(data)) {
        plantilla += `
                <tr>
          <td>${solicitud.id}</td>
          <td>${solicitud.startDate}</td>
          <td>${solicitud.comment}</td>
          <td>${solicitud.days}</td>
          <td>${solicitud.disabled}</td>
          <td>${solicitud.statusTransaction.id}</td>
          <td>${solicitud.transaction.id}</td>
          <td>${solicitud.pdfProfile.id}</td>
          <td>
            <button class="btn btn-light delete" data-id="1">
              <img src="./assets/img/delete.png" alt="" srcset="">
            </button>
          </td>
          <td>
            <button class="btn btn-light descargarData" data-id="2">
              <img src="./assets/img/down.png" alt="" srcset="">
            </button>
          </td>
          <td>
            <button class="btn btn-light edit" data-id="3">
              <img src="./assets/img/edit.png" alt="" srcset="">
            </button>
          </td>
        </tr>
        `;
    }
    //     data.forEach(solicitud => {
    //         plantilla += `
    //         <tr>
    //   <td>${solicitud.id}</td>
    //   <td>${solicitud.startDate}</td>
    //   <td>${solicitud.comment}</td>
    //   <td>${solicitud.days}</td>
    //   <td>${solicitud.disabled}</td>
    //   <td>${solicitud.statusTransaction.id}</td>
    //   <td>
    //     <button class="btn btn-light delete" data-id="1">
    //       <img src="./assets/img/delete.png" alt="" srcset="">
    //     </button>
    //   </td>
    //   <td>
    //     <button class="btn btn-light descargarData" data-id="2">
    //       <img src="./assets/img/down.png" alt="" srcset="">
    //     </button>
    //   </td>
    //   <td>
    //     <button class="btn btn-light edit" data-id="3">
    //       <img src="./assets/img/edit.png" alt="" srcset="">
    //     </button>
    //   </td>
    // </tr>
    //         `;
    //     });

    $("#tablaSolicitudes").html(plantilla);
}
function descargarDesdeTabla() {
    $("#tablaSolicitudes").on('click', '.descargarData', function () {
        // Obtén el nombre del elemento que deseas eliminar desde el atributo
        var id = $(this).closest('tr').find('td:eq(0)').text();
        descargarPDFTR(id)
        console.log("id-> ", id)
        // Envía una solicitud DELETE al backend para eliminar el elemento con el ID específico

    });
}
function descargarPDFTR(idData) {
    console.log("id-> ", idData)
    fetch('http://localhost:8080/datatransaction/pdf/' + idData, {
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
            link.download = "Solicitud" + '.pdf';

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

}
function deleteFromTable() {
    $("#tablaSolicitudes").on('click', '.delete', function () {
        // Obtén el nombre del elemento que deseas eliminar desde el atributo
        var id = $(this).closest('tr').find('td:eq(0)').text();
        deleteTR(id)
        console.log("id-> ", id)
        // Envía una solicitud DELETE al backend para eliminar el elemento con el ID específico

    });
}
function deleteTR(id) {
    console.log("id-> ", id)
    fetch('http://localhost:8080/datatransaction/' + id, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                // La lista se eliminó con éxito
                alert(`DataTransaction "+" eliminada con éxito`);
                // Volver a cargar las listas después de eliminar
                listarSolicitudes()
            } else {
                // Hubo un error al eliminar la lista
                console.error('Error al eliminar la lista');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
function EditFromTable() {
    $("#tablaSolicitudes").on('click', '.edit', function () {
        // Obtén el nombre del elemento que deseas eliminar desde el atributo
        var id = $(this).closest('tr').find('td:eq(0)').text();
        console.log("id-> ", id)

        $("#exampleModalLong").modal('show');
        $("#idDataTransaction").html(id);

        getDataFromIdDataTransaction(id)
        // Envía una solicitud DELETE al backend para eliminar el elemento con el ID específico

    });
}

function getDataFromIdDataTransaction(id) {
    // Realizar una solicitud GET a la API para obtener todas las canciones
    fetch('http://localhost:8080/datatransaction/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            console.log(data)
            $("#transaction").val(data.transaction.id);
            $("#type-transaction").val(data.type.id);
            $("#startDate").val(data.startDate);
            $("#finalDate").val(data.finalDate);
            $("#statusTransaction").val(data.statusTransaction.id);
            $("#day").val(data.days);
            $("#commentTr").val(data.comment);
            $("#disabled").val(data.disabled);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
function EditTR() {
    $("#btn_actualizar").on('click', function (e) {
        e.preventDefault()


        var transaction = {
            id: parseInt($("#transaction").val()),

        };
        var dataTransaction = {
            id: parseInt($("#idDataTransaction").html()),
            typeTransaction: {
                id: parseInt($("#type-transaction").val())
            },
            statusTransaction: {
                id: parseInt($("#statusTransaction").val())
            },

            finalDate: $("#finalDate").val(),
            startDate: $("#startDate").val(),
            days: parseInt($("#day").val()),
            comment: $("#commentTr").val(),
            disabled: $("#disabled").val()
        };
        var requestData = {
            dataTransaction: dataTransaction,
            transaction: transaction
        };

        var formData = new FormData();
        var fileInput = document.getElementById("fileUpdate");
        if (fileInput.files.length > 0) {
            formData.append('json', JSON.stringify(requestData));
            formData.append('file', fileInput.files[0]);
        } else {
            formData.append('json', JSON.stringify(requestData));
            formData.append('file', fileInput.files[0]);
        }
        console.log("file", fileInput.files.length)
        fetch('http://localhost:8080/datatransaction', {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                $("#modalDetalleLista").modal('hide');
                $("#exampleModalLong").modal('hide');
                listarSolicitudes()
                console.log('Respuesta del servidor:', data);
                // Manejar la respuesta del servidor aquí
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                // Manejar errores aquí
            });

    })
}
function closeModal() {
    $(".closeModal").on('click', function () {

        $("#modalDetalleLista").modal('hide');
        $("#exampleModalLong").modal('hide');
      
    });
    btn_excel
}
function descargarExcel() {
    $("#btn_excel").on('click', function () {
        fetch('http://localhost:8080/datatransaction/excel')
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'excel_file.xlsx'; 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
               
            });
    });
}
