const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded',() => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        crearCarrito()
    }
})
cards.addEventListener('click', (e)=>{
    añadirCarrito(e)
})
items.addEventListener('click', (e)=>{
    btnAccion(e)
})
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        crearCards(data)
        //console.log(data)
    } catch (error) {
        console.log(error)
    }
}

const crearCards = (data) => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.name
        templateCard.querySelectorAll('p')[0].textContent = producto.price  
        templateCard.querySelectorAll('p')[1].textContent = (producto.price * (100-producto.discount))/100  
        templateCard.querySelector('img').setAttribute('src', producto.url_image)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const añadirCarrito = (e) => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
    const producto = {   
        id: objeto.querySelector('.btn-dark').dataset.id, 
        name: objeto.querySelector('h5').textContent,
        price: objeto.querySelectorAll('p')[1].textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    crearCarrito()
}

const crearCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto=>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.name
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    crearFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const crearFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acumulador,{cantidad}  )=>acumulador + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acumulador,{cantidad,price}  )=>acumulador + cantidad * price,0)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar =document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click',()=>{
        carrito = {}
        crearCarrito()
    })
}

const btnAccion = e =>{
    //aumentar cantidad
    if(e.target.classList.contains('btn-info')){
       const producto = carrito[e.target.dataset.id]
       producto.cantidad++
       carrito[e.target.dataset.id] = {...producto}
       crearCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        crearCarrito()
     }
    
}