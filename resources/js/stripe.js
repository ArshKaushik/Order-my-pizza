import {loadStripe} from '@stripe/stripe-js'
import {placeOrder} from './apiService'
import {CardWidget} from './CardWidget'

export async function initStripe() {
    // Stripe
    const publishableClientKey = 'pk_test_51IfcFgSDeDhZpNRaLTsurwptX4UHZQQ65SB6OtUvkyfuAF046Vx81wpNQrDFC3pCAExX2A89dYrxccXcXS6V1Z7300wrlqJrhx'
    const stripe = await loadStripe(publishableClientKey);

    let card = null

    // Payment
    const paymentType = document.querySelector('#paymentType')

    if(!paymentType) {
        return
    }

    paymentType.addEventListener('change', (e) => {
        if(e.target.value === 'card') {
            // Display widget
            card = new CardWidget(stripe) // 'new' keyword is used to create an object of the class 'CardWidget'
            card.mount()
        }
        else {
            card.destroy()
        }
    })

    // Ajax call
    const paymentForm = document.querySelector('#payment-form')

    if(paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault() // Prevents default behaviour of the event
            
            let formData = new FormData(paymentForm) // 'FormData()' is JS's in-built class
            let formObject = {}
        
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            if (!card) {
                // Ajax
                placeOrder(formObject);
                return;
            }
    
            const token = await card.createToken()
            formObject.stripeToken = token.id // Creating a 'stripeToken' key in 'formObject'
            placeOrder(formObject)
        })
    }
}