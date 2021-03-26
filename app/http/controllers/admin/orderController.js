const Order = require('../../../models/order')

function adminOrderController() {
    return {
        index(req, res) {
            // populate() to fetch user's data instead of cutomerId without password. exec() is to run the command.
            Order.find({status: {$ne: 'completed'}}, null, {sort: {'createdAt': -1}}).populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr) {
                    return res.json(orders)
                }
                else {
                    return res.render('admin/orders')
                }
            })
        }
    }
}

module.exports = adminOrderController