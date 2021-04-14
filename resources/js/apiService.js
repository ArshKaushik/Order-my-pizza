import axios from 'axios'
import Noty from 'noty'

export function placeOrder(formObject) {
    axios.post('/orders', formObject).then((res) => {
        console.log(res)
        new Noty({
            type: 'success',
            timeout: 1000, // millisecond
            text: res.data.message,
            progressBar: false
        }).show()

        // Redirecting
        setTimeout(() => {
            window.location.href = '/customer/orders'
        }, 1000);
    }).catch((err) => {
        console.log(err)
        new Noty({
            type: 'error',
            timeout: 1000, // millisecond
            text: err.res.data.message,
            // text: 'Something went wrong',
            progressBar: false
        }).show()
    })
}