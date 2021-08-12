var express  = require('express')  
var mongoose = require('mongoose')  
var path     = require('path')  
var bodyParser = require('body-parser')  
var userRoutes = require('./routes/users')  
var customerRoutes = require('./routes/customers')
var http = require('http')
var cors = require('cors')
var morgan = require('morgan');
var winston = require('./config/winston');

//connecting to database  
mongoose.connect('mongodburl',{useNewUrlParser:true}).then(()=>console.log('connected to database')).catch(error=>console.log('error occured',error))  
  
//initializing the object instance  
var app = express()  
app.use(cors()) // include before other routes
app.use(morgan('combined', { stream: winston.stream }));

//fetch form data from the request  
app.use(bodyParser.urlencoded({extended:false}))  
app.use(bodyParser.json())
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
//the request having /user/ will be send to the userRoutes module.  
//in that the rquest will be directed to the specific route.   
app.use('/customer/',customerRoutes);  
  
//setting the port for the server.  
var port = 6001;  
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);
//showing the port on which server is running  
app.listen(port,()=>console.log(`server running at port ${port}`))  

module.exports = app;  