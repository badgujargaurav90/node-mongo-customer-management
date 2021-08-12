var express =  require('express');  
var customerController = require('../app/controller/customerController');  
var middleware = require('../middleware')
var router = express.Router();  

router.post('/login',customerController.loginCustomer);
router.post('/update',middleware.verify,customerController.updateCustomer);
router.get('/list',middleware.verify, customerController.customerList)
router.post('/signup',customerController.signupCustomer);
router.get('/getDetails/:id',middleware.verify,customerController.getCustomerDetails);
router.put('/delete',middleware.verify,customerController.deleteCustomer);
router.get('/authenticate',customerController.authenticate);

module.exports = router;  