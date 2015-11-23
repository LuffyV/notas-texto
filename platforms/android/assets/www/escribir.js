document.addEventListener("deviceready", deviceReady, false);
var filesystem = null;
var messageBox;

function escribeArchivo(){
  var titulo = document.getElementById("titulo").value;
  var contenido = document.getElementById("contenido").value;

  if(titulo != "" && contenido != ""){
    saveFile(titulo + ".txt", contenido);
  } else {
    alert("Falta llenar datos para poder guardar");
  }
}

function saveFile(filename, content) {
  var direccionArchivo = "proyecto/" + filename;
  filesystem.root.getFile(direccionArchivo, {create: true}, function(fileEntry) {

    fileEntry.createWriter(function(fileWriter) {
      var fileParts = [content];
      var contentBlob = new Blob(fileParts, {type : 'text/html'});      
      fileWriter.write(contentBlob);

      fileWriter.onwriteend = function(e) { 
        messageBox.innerHTML = 'Se ha guardado el archivo!';
        // necesita tener un delay
        // si se redirecciona directamente, no se guarda el texto en el contenido del archivo
        setTimeout(function(){
          window.location = "index.html";
        }, 500);
      };

      fileWriter.onerror = function(e) {
        console.log('Write error: ' + e.toString());
        alert('An error occurred and your file could not be saved!');
      };
      
    }, errorHandler);

  }, errorHandler);
}

function deviceReady(){
  // Allow for vendor prefixes.
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  messageBox = document.getElementById('messages');
  
  var titulo = document.getElementById("titulo");
  var contenido = document.getElementById("contenido");
  titulo.value = localStorage.archivoTextoTitulo;
  contenido.value = localStorage.archivoTextoContenido;
  
  // Start the app by requesting a FileSystem (if the browser supports the API)
  if (window.requestFileSystem) {
    initFileSystem();
  }
}

  function initFileSystem() {
         // Request a file system with the new size.
        window.requestFileSystem(window.PERSISTENT, 1024, function(fs) {        
          filesystem = fs;        
        }, errorHandler);
  }

  // A simple error handler to be used throughout this demo.
  function errorHandler(error) {
    var message = '';
    switch (error.code) {
      case FileError.SECURITY_ERR:
        message = 'Security Error';
        break;
      case FileError.NOT_FOUND_ERR:
        message = 'Not Found Error';
        break;
      case FileError.QUOTA_EXCEEDED_ERR:
        message = 'Quota Exceeded Error';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        message = 'Invalid Modification Error';
        break;
      case FileError.INVALID_STATE_ERR:
        message = 'Invalid State Error';
        break;
      default:
        message = 'Unknown Error UAY';
        break;
    }
    alert(message);
  }