document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    localStorage.archivoTextoTitulo = "TituloEjemplo";
    localStorage.archivoTextoContenido = "ContenidoEjemplo";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}

function onFileSystemSuccess(filesystem) {
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
            "<img src=\"img/repoop.png\">" + entries[i].name.slice(0, -4) + // el slice le quita la terminación
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
            // dos toques en el mismo div

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, mostrarArchivo, fail);
            readFile();
        }
    } else {
        toques = 1;
    }
    ultimaFila = fila;
    divSeleccionado = ultimaFila;
}

function colorearSeleccion(seleccionado){
    for (var i = 0; i < divsTotales; i++) {
        document.getElementById(i).style.color = "black";
    }
    document.getElementById(seleccionado).style.color = "LightBlue";
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

function readFile() {
    alert("Entra a readFile");
    var content = null;
    var archivoPorMostrar = document.getElementById(divSeleccionado).innerText;
    alert("El archivo para mostrar: " + archivoPorMostrar);
    filesystem.root.getFile(archivoPorMostrar + '.txt', {}, function (fileEntry) {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                content = String(this.result);
                alert(content);
            };
            reader.readAsText(file);

        }, fail);

    }, fail);
}

function mostrarArchivo(filesystem){
    alert("Entra a mostrarArchivo");
    var archivoPorMostrar = document.getElementById(divSeleccionado).innerText;
    var content = "";

    filesystem.root.getFile(archivoPorMostrar + ".txt", null, function(fileEntry){
        fileEntry.file(function(file){
            alert("Entra al fileEntry");
            var reader = new FileReader();
            reader.onloadend = function (e){
                content = String(this.result);
                alert("El contenido de esta nota es: " + content);
            };
            reader.readAsText(file);
        }, fail);
    }, fail);

    localStorage.archivoTextoTitulo = archivoPorMostrar;
    localStorage.archivoTextoContenido = content;
    // window.location = "escribir.html";
}

function fail(error) {
    alert("Error:" + error.code);
}