document.addEventListener("deviceready", onDeviceReady, false);
var filesystem = null;

function onDeviceReady() {
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
            alert("Se hicieron dos toques en el mismo div");
            // mostrarArchivo();
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
  if(titulo!= ""){
    deleteFile(titulo + ".txt");
  } else {
    alert("No se está seleccionando un archivo para borrar.");
  }
}

function deleteFile(filename){
  var direccionArchivo = "proyecto/" + filename;
   alert("Se debería borrar el archivo: proyecto/" + filename);
  filesystem.root.getFile(direccionArchivo, {create: true}, function(fileEntry) {
   fileEntry.remove();
 });
  alert("Se borró el archivo: " + filename);
}

function mostrarArchivo(){
    var contenido = document.getElementById('contenido');
    var reader = new FileReader();
}

function fail() {
    alert("No se pudo shavo");
}