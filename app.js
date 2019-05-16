console.log('comenzando');

firebase.initializeApp({
  apiKey: "AIzaSyCvaToijWm8OC3p1kFEDAb3MOoE1WS-kCo",
  authDomain: "crudfirebase-a6276.firebaseapp.com",
  projectId: "crudfirebase-a6276",
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features //Nueva caracteritica
db.settings({
  timestampsInSnapshots: true
});

//agregando la base de datos
//agregando información

function guardar(){
  var nombre = document.getElementById('nombre').value;
  var apellido = document.getElementById('apellido').value;
  var fecha = document.getElementById('fecha').value;

  //si cambias users se crea una nueva base de dados sino se agrega en la ya existente
  db.collection("users").add({
      Nombre: nombre,
      Apellido: apellido,
      Fecha: fecha
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      //limpiamos los campos
      document.getElementById('nombre').value = '';
      document.getElementById('apellido').value = '';
      document.getElementById('fecha').value = '';
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

//Leer Documentos
var tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => { //cambiamos el get por el onSnapshot
    tabla.innerHTML = ''; // inicia vacia la tabla
    querySnapshot.forEach((doc) => {   //forEach es un ciclo se va repitiendo segun la data que se tiene
        console.log(`${doc.id} => ${doc.data().Nombre}`);
        tabla.innerHTML +=`
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().Nombre}</td>
          <td>${doc.data().Apellido}</td>
          <td>${doc.data().Fecha}</td>
          <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
          <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().Nombre}','${doc.data().Apellido}','${doc.data().Fecha}')">Editar</button></td>
        </tr>
        `;
    });
});

//Eliminar Documentos (datos de la base de datos)
function eliminar(id){
  db.collection("users").doc(id).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

//actualizar data
function editar(id, nombre, apellido, fecha){

  //solo lleva los datos de una persona al campo de edición(donde se editara)
  document.getElementById('nombre').value = nombre;
  document.getElementById('apellido').value = apellido;
  document.getElementById('fecha').value = fecha;

  var boton = document.getElementById('boton'); //seleccionalos el boton conid boton
  boton.innerHTML = 'Editar'; // le cambiamos el nombre de Guardar a editar

  boton.onclick = function(){ // y cambiamos la función de onclik, definiendo otra función

    var washingtonRef = db.collection("users").doc(id);

    //ahora cambiamos las variables para poder editarlas
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var fecha = document.getElementById('fecha').value;

    return washingtonRef.update({
      Nombre: nombre,
      Apellido: apellido,
      Fecha: fecha
    })
    .then(function() {
        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar'; // realizado ya los cambios y depues de presionar editar cambiamos el nombre a Guardar

        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('fecha').value = '';

    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

}
