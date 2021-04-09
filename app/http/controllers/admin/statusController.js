const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data) => {
                if(err) {
                    return res.redirect('/admin/orders')
                }
                
                // Emit event
                const evenEmitter = req.app.get('eventEmitterKey')
                evenEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})

                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController