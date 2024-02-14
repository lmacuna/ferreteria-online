
/*
¿Cuál es la diferencia entre objeto y objeto literal?
Los objetos creados usando el literal de objeto son singletons, 
esto significa que cuando se realiza un cambio en el objeto, 
afecta al objeto durante todo el script. Mientras que si un 
objeto se crea usando la función constructora y se le realiza un
 cambio, ese cambio no afectará al objeto en todo el script.
*/

const getProductos = async () => {

    var data, token;
    var url = 'MOCK/productos.json'
    var metodo = 'GET'

    var res = await peticiones(data, metodo, url, token)
    res = await res.data
    return (console.log(res), vistaTienda(res), localStorage.setItem("productos", JSON.stringify(res)))
}


getProductos()

const vistaTienda = (res) => {
    res.forEach(art => {
        document.querySelector("#tienda").innerHTML += `
        <div id="item-card" key=${art.id}>
            <img class="item-img" src=${art.img}></img>
            <div class="item-body">
               <span>${art.articulo} </span>
               <span><b>$ARS ${art.precio}</b></span>
            </div>
            <div class="item-footer">
                    <button id=${art.id} onclick="comprar(id)"><i class="fa-solid fa-cart-plus"></i></button>
            </div>
        </div>
        `
    });
}

var carroArt = [];
localStorage.setItem("carroArt",JSON.stringify(carroArt))
const comprar = (id) => {
  
    id = parseInt(id)
    let productos = localStorage.getItem("productos")
    productos = JSON.parse(productos)
    let timerInterval;
    Swal.fire({
        title: `<div style="font-size:26px;"><img style="width:80px;height:80px" src=${productos[id - 1].img}></img><br>${productos[id - 1].articulo} agregado correctamente</div>`,
        html: "I will close in <b></b> milliseconds.",
        timer: 4000,
        timerProgressBar: true,
        backdrop: false,

        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
    });
    let pEncontrado = productos.find(p => p.id === id)
    let pCarro = carroArt.find(pC => pC.id === id)

    if (!pCarro) {
        var objetoCarro = {
            id: pEncontrado.id,
            articulo: pEncontrado.articulo,
            precio: pEncontrado.precio,
            cantidad: 1,
            subTotal: pEncontrado.precio,
            img: pEncontrado.img
        }

        carroArt = [...carroArt, objetoCarro]

        localStorage.setItem("carroArt", JSON.stringify(carroArt))
        carroArt = localStorage.getItem("carroArt")
        carroArt = JSON.parse(carroArt)

        return ( vistaCarro(carroArt),totales())
    } else if (pEncontrado) {

        pCarro.cantidad++
        pCarro.subTotal = pCarro.precio * pCarro.cantidad

        objetoCarro = {
            id: pCarro.id,
            articulo: pCarro.articulo,
            precio: pCarro.precio,
            cantidad: pCarro.cantidad,
            subTotal: pCarro.precio,
            img: pCarro.img
        }

        carroArt = [...carroArt]
        localStorage.setItem("carroArt", JSON.stringify(carroArt))
        carroArt = localStorage.getItem("carroArt")
        carroArt = JSON.parse(carroArt)
        return (console.log(carroArt), vistaCarro(carroArt),totales())
    }
}

const restarItem = (id) => {

    id = parseFloat(id)
    carroArt = localStorage.getItem("carroArt")
    carroArt = JSON.parse(carroArt)

    let carr = carroArt.find(c => c.id === id)
    let index = carroArt.indexOf(carr)
    console.log(index)
    carr.cantidad--
    carr.subTotal = carr.precio * carr.cantidad
    objetocarro = {
        id: carr.id,
        articulo: carr.articulo,
        precio: carr.precio,
        cantidad: carr.cantidad,
        subTotal: carr.subTotal,
        img: carr.img
    }
    carroArt = carroArt.filter(c => c.id !== id)


    carroArt.splice(index, 0, objetocarro)
    carroArt = carroArt.filter(c => c.cantidad !== 0)
    localStorage.setItem("carroArt", JSON.stringify(carroArt))
    carroArt = localStorage.getItem("carroArt")
    carroArt = JSON.parse(carroArt)
    return (console.log(carroArt.length), vistaCarro(carroArt),totales())

}


const vistaCarro = (carroArt) => {
    //console.log(carroArt.length)
    document.querySelector("#carro").innerHTML = ""
     //carroArt?totales():null
    return (carroArt.length !== 0 ? carroArt.forEach(cArt => {

      
     
        document.querySelector("#carro").innerHTML += `
        <div id="item-carro" key=${cArt.id}>
        <img src=${cArt.img}></img> 
        <div id="item-carro-desc">
          <p>CANT: <b style="font-size:18px">${cArt.cantidad}</b></p>
          <p> ${cArt.articulo}</p>
          <p>P/U $${cArt.precio}</p><br>
          <p style="font-size:14px;font-weight:bold">SUBTOTAL: $${cArt.subTotal}</p>
          <div id="box-btn-carro"><button class="btn-comprar" id=${cArt.id} onclick="comprar(id)"><i class="fa-solid fa-cart-plus"></i></button><button class="btn-restar" id=${cArt.id} onclick="restarItem(id)"><i class="fa-solid fa-cart-arrow-down"></i></button><button id=${cArt.id} onclick="eliminarItem(id)" class="btn-eliminar"><i class="fa-solid fa-trash"></i></button></div>
        </div>
        </div>
        `
    }) : null,

        carroArt.length === 0 ? (document.querySelector("#carro").classList.remove("carro-on"),document.querySelector("#tienda").classList.remove("tienda-left"), cambio = false,carroActivo()) : null)

}

const totales=()=>{
             let carroArt=localStorage.getItem("carroArt")
            carroArt=JSON.parse(carroArt) 
           let carroCantidad=0;
           let importeTotal=0;
             carroArt?carroArt.forEach(i => {
                carroCantidad=carroCantidad+i.cantidad
                importeTotal=importeTotal+i.subTotal
             }):null
        
          return (console.log(carroCantidad),console.log(`\n${importeTotal}`),vistaTotales(carroCantidad,importeTotal))
}

const vistaTotales=(carroCantidad,importeTotal)=>{

    carroCantidad?(document.querySelector("#box-totales").classList.add("box-totales-on"),document.querySelector("#cantidad").innerText=`${carroCantidad}`,document.querySelector("#total-carro").innerText=` $${importeTotal}`):(document.querySelector("#box-totales").classList.remove("box-totales-on"),document.querySelector("#cantidad").innerText="",document.querySelector("#total-carro").innerText="")
}

let cambio = false;
const carroActivo = () => {
    carroArt = localStorage.getItem("carroArt")
    carroArt = JSON.parse(carroArt)
    if (carroArt.length!==0) {
        !cambio ? (document.querySelector("#carro").classList.add("carro-on"),document.querySelector("#tienda").classList.add("tienda-left"), cambio = true, carroOn()) : (carroOff(), document.querySelector("#carro").classList.remove("carro-on"), cambio = false,document.querySelector("#tienda").classList.remove("tienda-left"))
    } else if( carroArt.length===0){
        let timerInterval;
        Swal.fire({
            title: `Carro vacio`,
            html: "I will close in <b></b> milliseconds.",
            timer: 3000,
            timerProgressBar: true,
            backdrop: false,

            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    }
}


const carroOn = () => {
    let timerInterval;
    Swal.fire({
        title: `Carro Activo`,
        html: "I will close in <b></b> milliseconds.",
        timer: 1000,
        timerProgressBar: true,
        backdrop: false,

        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
    });
}

const carroOff = () => {
    let timerInterval;
    Swal.fire({
        title: `Carro desactivado`,
        html: "I will close in <b></b> milliseconds.",
        timer: 1000,
        timerProgressBar: true,
        backdrop: false,

        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
    });
}



const eliminarItem=(id)=>{
    console.log(id)
     id=parseInt(id)
     const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Seguro quieres eliminar este producto de la compra?",
        text: "si lo eliminas puedes volver a agregarlo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, elimina el producto!",
        cancelButtonText: "No, no lo elimines!",
        reverseButtons: true,
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Eliminado!",
            text: "Eliminaste fila correctamente!",
            icon: "success",
            backdrop: false,
          });
          carroArt = carroArt.filter(c => c.id !== id)
          carroArt = carroArt.filter(c => c.cantidad !== 0)
          localStorage.setItem("carroArt", JSON.stringify(carroArt))
          carroArt = localStorage.getItem("carroArt")
          carroArt = JSON.parse(carroArt)
          return (console.log(carroArt.length), vistaCarro(carroArt),totales())
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelaste eliminacion!",
            text: "El producto continua en la compra :)",
            icon: "error",
            backdrop: false,
          });
        }
      });
  


   
}

const btnCar=document.querySelector("header button")

btnCar.addEventListener('click',(e)=>{
    console.log(btnCar.getAttribute("onclick"))
})





const eliminarCarro = () => {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Seguro quieres eliminar el carro?",
        text: "Si lo eliminas no hay vuelta atras!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, elimina el carro!",
        cancelButtonText: "No, no lo elimines!",
        reverseButtons: true,
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Eliminado!",
            text: "El carro ha sido eliminado.",
            icon: "success",
            backdrop: false,
          });
          carroArt = carroArt.filter(c => c.id < 1)
          localStorage.setItem("carroArt", JSON.stringify(carroArt))
          carroArt = localStorage.getItem("carroArt")
          carroArt = JSON.parse(carroArt)
          
      
      
          return (console.log(carroArt), vistaCarro(carroArt), totales(),carroActivo())
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelaste eliminacion!!",
            text: "Tu compra sigue activa :)",
            icon: "error",
            backdrop: false,
          });
        }
      });

    


}




const redirectPay=()=>{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Cerrar ticket y pagar?",
        text: "Si lo deseas puedes cancelar y seguir agregando productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, cierra el ticket y pagar!",
        cancelButtonText: "No, no lo cierres!",
        reverseButtons: true,
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Compra realizada!",
            text: "Te redireccionamos al formulario de pago.",
            icon: "success",
            backdrop: false,
          });
          
          
      
      
          return (
            setTimeout(() => {
                window.location.href='pay.html'
            }, 5000)
           )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelaste cierre de ticket!!",
            text: "Tu compra sigue activa :)",
            icon: "error",
            backdrop: false,
          });
        }
      });

    

    
}































