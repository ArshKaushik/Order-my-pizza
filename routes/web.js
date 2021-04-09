// Controllers
const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const customerOrderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

// Middlewares
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')

function initRoutes(app) {
    // Home
    app.get('/', homeController().index)

    // Login
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)

    // Register
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)

    // Logout
    app.post('/logout', authController().logout)

    // Cart
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    // Customer routes
    app.post('/orders', auth, customerOrderController().store)
    app.get('/customer/orders', auth, customerOrderController().index)
    app.get('/customer/orders/:id', auth, customerOrderController().show)

    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes