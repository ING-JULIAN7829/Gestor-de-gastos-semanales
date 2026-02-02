// este proyecto estara hecho con clases

/* VARIABLES Y SELECORES */
const formulario = document.querySelector('#agregar-gasto'); //Boton agregar
const gastoListdo = document.querySelector('#gastos ul'); //Donde se van a poner los gastos




 /* EVENTOS */
 eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded' , preguntarPresupuesto);

    formulario.addEventListener('submit' , agregarGasto); //para validar lo que se sube al form

}


 /* CLASES */
//para presupuesto
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto) ; // Convierte a numero lo ingresado
        this.restante = Number(presupuesto); // se modifica cuando se añaden gastos
        this.gastos = []; //donde se guardaran todos los gasto
    }

    nuevoGasto(gasto) {
        //Añadiendo un gasto al arreglo manteniendo los anteriores
        this.gastos = [...this.gastos , gasto];
    
        this.calcularRestante();
     }

     calcularRestante() {
        //itera sobre el arreglo y entrega un total 
        const gastado = this.gastos.reduce((total , gasto) => total + Number(gasto.cantidad) , 0);
        console.log(gastado);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
     }


     eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
     }
}

//para operar la interface
class UI {
    insertarPresupuesto( cantidad ) {
        //Cantidad es un objeto
        //extrayendo 
        const{presupuesto,restante} = cantidad ; //destructuring del objeto
        document.querySelector('#total').textContent = presupuesto ; // seleccionando y agregando donde vamos a mostrar

        document.querySelector('#restante').textContent = restante; 
    }

    imprimirAlerta(mensaje , tipo) { //la idea es hacer esta funcion reutilizables
        //Crear el div alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert') //alert es una clase de bootstrap
        
         //validando el tipo de alerta a mostrar
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }
        else {
            divMensaje.classList.add('alert-success');
        }



        //añadiendo el mensaje

        divMensaje.textContent = mensaje;


        //insertar al HTML
        //lo insertarmos en el div con clase primario y antes de la referencia que tenemos de formulario
        document.querySelector('.primario').insertBefore(divMensaje , formulario)


        //necesitamos que el mensaje se quite despues de un tiempo

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }
    
    agregarGastoListado(gastos) {
       limpiarHTML();
        gastos.forEach(gasto => { //iteramos sobre los gastos 
           const {cantidad , nombre , id} = gasto; //para simplificar el codigo


           //crear el html

           const nuevoGasto = document.createElement('li');
           nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; //ya que tenemos muchas clases

           //Agregando atributos personalizado
           nuevoGasto.dataset.id = id ; //EN este caso definimos un atributo dataset como data-id
            //Antes se usaba la forma nuevoGasto.setattribute('data-id' , id);


            //Agrefar HTML al gasto

            //inner html es algo inseguro , seria mejor crear elemento por elemento

            nuevoGasto.innerHTML = `${nombre} <span class = "badge badge-primary badge-pill"> $ ${cantidad} </span>`;
            //boton para borrar el gasto


            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () =>  eliminarGasto(id); //el id es para saber que elemento estamos borrando
            
            nuevoGasto.appendChild(btnBorrar);
 

            //Agregando al html
            gastoListdo.appendChild(nuevoGasto);

           
        });
    }   
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante; 
  
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto , restante} = presupuestoObj;

        //Seleccionamos el div de restante
        const restanteDiv = document.querySelector('.restante');
        //Comprobar 25%

        if ( (presupuesto / 4 ) > restante) {

            restanteDiv.classList.remove('alert-success' ,'alert-warning');
            restanteDiv.classList.add('alert-danger' ); //nos aseguramos de eliminar la clase de alert warning en cualquier caso

        } else if ( (presupuesto / 2 ) > restante ) { //Comprobando mas de la mitad

            restanteDiv.classList.remove('alert-success' , 'alert-danger' , 'alert-warning');
            restanteDiv.classList.add('alert-warning'); //Clase de bootstrap


        } else {
            restanteDiv.classList.remove('alert-success','alert-danger' , 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Comprobar si el restante aun es valido

        if( restante <= 0 ) {
            ui.imprimirAlerta('El presupuesto se ha agotado' , 'error');
            
            formulario.querySelector('button[type="submit"]').disabled = true; //dshabilitamos el boton cuando se acaba el presupuesto

        }



    }  
}





//instanciando
const ui = new UI();
let presupuesto; //Para obtener la instancia de forma global


 /* FUNCIONES */




 function preguntarPresupuesto() {
    //Se debe validar que se envie algo
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');



    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){ //si esta vacio | si es null || si no es numero || si es negativo o 0
        window.location.reload() //Recarga la pagina
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto); //pasamos a instancia del objeto completa
 }


 function agregarGasto(e) {
    e.preventDefault(); //recordar que el boton recarga la pagina por default
    //Leyendo los inputs del form

    const nombre = document.querySelector('#gasto').value; //accediendo al nombre del gasto
    const cantidad = document.querySelector('#cantidad').value; //accediendo al valor del gasto
    
    //validando que no esten vacios y sean datos logicos

    if ( nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios' , 'error');
        return;
    }   else if ( cantidad<= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida' , 'error');      
        return;
    }

    //generaremos un obtjero con el gasto 

    //El object literal es lo contrario al Object destructuring
    //creamos un objeto con el gasto usando los nombres y valores de las variables

    const gasto = { nombre , cantidad , id:Date.now()};

    //añade un nuevo gasto al objeto presupuesto
    presupuesto.nuevoGasto(gasto);
    //mensaje de gasto agregado
    ui.imprimirAlerta('Gasto agregado correctamente' );

    //mostrando los gastos en el html
    const {gastos ,restante} = presupuesto; //para enviar solo lo que necesitamos

    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //reniciando el formulario
    formulario.reset();
}


function limpiarHTML() {
    
    while(gastoListdo.firstChild) {
        gastoListdo.removeChild(gastoListdo.firstChild);
    }
}


function eliminarGasto(id) {
    //Los aelimina de la clase - objeto 
    presupuesto.eliminarGasto(id);
     
     //Elimina los gastos del HTML

     const { gastos , restante } = presupuesto ;
     ui.agregarGastoListado(gastos);


     
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}