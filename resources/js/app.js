// ------ CLIENT SIDE CODE ------

import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'
import {initStripe} from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000, // millisecond
            text: 'Item added to the cart',
            progressBar: false
        }).show()
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000, // millisecond
            text: 'Something went wrong',
            progressBar: false
        }).show()
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

// Remove the alert message after x seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}

// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true
    statuses.forEach((status) => {
        let dataProp = status.dataset.status // '.status' is for 'status' of 'data-status' in 'singleOrder.ejs' file
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)

// Stripe
initStripe()

// Socket.io
let socket = io()
// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    // Admin functioning
    initAdmin(socket)
    
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdatedEvent', (data) => {
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    
    new Noty({
        type: 'success',
        timeout: 1000, // millisecond
        text: 'Order updated',
        progressBar: false
    }).show()
})