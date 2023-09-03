const Router = require('express');

const clienteRoutes = require('./modules/clientes/routes/clientes.routes');

const router = Router();

// Status api endpoint
router.get('/api-status', (req, res) => {
    return res.send({ 'Status': 'on' });
});

router.use(clienteRoutes);



module.exports = router;