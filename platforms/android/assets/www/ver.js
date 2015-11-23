document.addEventListener("deviceready", onDeviceReady, false);
var FileSystem = null;


function onDeviceReady() {
    localStorage.archivoTextoTitulo = "";
    localStorage.archivoTextoContenido = "";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}

function onFileSystemSuccess(filesystem) {
    FileSystem = filesystem;
    // aquí se señala en qué carpeta buscas, si la encuentra, sigue
    filesystem.root.getDirectory("proyecto", {create: false, exclusive: false}, getDirSuccess, fail);
}

function getDirSuccess(dirEntry) {
    var directoryReader = dirEntry.createReader();

    // lista todo en el directorio
    directoryReader.readEntries(readerSuccess, fail);
}

var divsTotales;
function readerSuccess(entries) {
    var i;
    divsTotales = entries.length;
    var lista = document.getElementById("archivos");

    for (i=0; i<entries.length; i++) {
        lista.innerHTML +=
        "<div class=\"lista\" id=\""+i+"\" onclick=clickMostrar("+i+");>" + 
            "<img src=\"img/pencil.gif\">" + entries[i].name.slice(0, -4) + // el slice le quita la terminación
        "</div><br>";
    }
}
var toques = 0;
var ultimaFila;
var divSeleccionado;
// valida que se haga doble tap en un div antes de mostrar el contenido del archivo
function clickMostrar(fila){
    if(ultimaFila == null){
        ultimaFila = fila;
    }

    colorearSeleccion(fila);
    divSeleccionado = fila;

    if(ultimaFila == fila){
        toques++;
        if(toques == 2){
            // aquí ya se hicieron dos toques en el mismo div
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, mostrarArchivo, fail);
        }
    } else {
        toques = 1;
    }
    ultimaFila = fila;
    divSeleccionado = ultimaFila;
}

function mostrarArchivo(FileSystem){
    var archivoPorMostrar = document.getElementById(divSeleccionado).innerText;

    FileSystem.root.getFile("proyecto/" + archivoPorMostrar + ".txt" , null, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var contenido = this.result;
                localStorage.archivoTextoContenido = contenido;
            };
            reader.readAsText(file);
        });
    });

     setTimeout(function(){
        localStorage.archivoTextoTitulo = archivoPorMostrar;
        window.location = "escribir.html";
    }, 500);
}

function colorearSeleccion(seleccionado){
    for (var i = 0; i < divsTotales; i++) {
        document.getElementById(i).style.color = "black";
    }
    document.getElementById(seleccionado).style.color = "Red";
}

function borraArchivo(){
    var titulo = document.getElementById(ultimaFila).innerText;
    if(titulo != ""){
        deleteFile(titulo + ".txt");
    } else {
        alert("No se está seleccionando un archivo para borrar.");
    }
}

var direccionArchivo = "";
function deleteFile(filename){
  direccionArchivo = "proyecto/" + filename;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, borrarFinal, fail);
}

function borrarFinal(filesystem){
    filesystem.root.getFile(direccionArchivo, {create: false}, function(fileEntry) {
        fileEntry.remove();
    });
  alert("Se ha borrado con éxito el archivo: " + direccionArchivo);
  window.location.reload();
}

function fail(error) {
    alert("Error:" + error.code);
}