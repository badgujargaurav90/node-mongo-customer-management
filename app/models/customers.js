var mongoose  = require('mongoose');
var crypto = require('crypto');
var commonHelper = require('../helper/commonHelper')
const bcrypt = require("bcryptjs");
const { callbackify } = require('util');
const jwt = require('jsonwebtoken')
const tokenSecret = "restaurant-tokens"
var ObjectId = require('mongodb').ObjectID;


var customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }, 
    city: {
        type: String,
        required: true
    },  
    state: {
        type: String,
        required: true
    },  
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String,
        required: false
    },
    updatedAt: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }

 });

 setPassword = function(password,callback) {
const saltRounds = 10

bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    callback(err,null)
  } else {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
          callback(err,null)
      } else {
        callback(null, {password:hash, salt: salt})
      }
    })
  }
})
   };

   validPassword = function(enteredPassword,password, salt,cb) {
       bcrypt.compare(enteredPassword, password, function(err, isMatch) {
        if (err) {
          cb(err,null)
        } else {
          cb(null, isMatch)
        }
      });
};
   
var customerModel = module.exports = mongoose.model('restaurantcustomers',customerSchema);  
 
module.exports.getCustomer=(cb)=>{  
    customerModel.find((err,data)=>{  
        if(err){  
            cb(err,null)
        }  
        else{
            cb(null,data)  
        }
    })  
}   
module.exports.signupCustomer=(newCustomer,cb)=>{
    setPassword(newCustomer.password, (err,res)=>{
        if (err) {
            cb(err,null)
        } else {
            const user = new customerModel({  
                name: newCustomer.name, 
                gender: newCustomer.gender, 
                city: newCustomer.city,  
                state: newCustomer.state,  
                phone: newCustomer.phone,
                email: newCustomer.email,
                password: res.password,
                salt: res.salt,
                isDeleted: 0,
                createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                updatedAt: null
            })  
            user.save().then(function(res){
                cb(null,res)
            }).catch(err => {
                cb(err,null)
            })
        }
    })
 }  
module.exports.updateCustomer=(customerData,cb)=>{
    setPassword(customerData.password, (err,res)=>{
        if (err) {
            cb(err,null)
        } else {
            customerModel.findById({_id: customerData.id},(err,data) =>{
                if (err) {
                    cb(err,null)
                } else {
                    data.name = customerData.name;
                    data.gender = customerData.gender
                    data.city = customerData.city
                    data.state = customerData.state
                    data.phone = customerData.phone
                    data.email = customerData.email
                    data.password = res.password
                    data.salt = res.salt
                    data.isDeleted = 0,
                    data.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    data.isDeleted = 1;
                    data.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    data.save().then(function(res){
                        cb(null,res)
                    }).catch(err => {
                        cb(err,null)
                    })
                }
            });

        }
    })
 }  
module.exports.deleteCustomer= (customerData,cb)=>{
    customerModel.findById({_id: customerData.id},(err,data) =>{
        if (err) {
            cb(err,null)
        } else {
            data.isDeleted = 1;
            data.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            data.save().then(function(res){
                cb(null,res)
            }).catch(err => {
                cb(err,null)
            })
        }
    });
}
module.exports.loginCustomer=(customerData,cb)=>{
    customerModel.findOne({email: customerData.email},(err,data)=>{
        if(err){
            cb(err,null)
        } else {
            if (!data) {
                var response = commonHelper.commonMsg("no-record","Record not found!",null,null)
                cb(null, response)
            } else {
                validPassword(customerData.password, data.password, data.salt, (err,res)=>{
                    if (err) {
                        var response = commonHelper.commonMsg("failure","Something went wrong",null,err)
                        cb(null, response)
                    } else {
                        if (res) {                           
                            var response = commonHelper.commonMsg("success","Login successful.",data,null)
                            cb(null, response)
                        } else {
                            var response = commonHelper.commonMsg("wrong-data","Incorrect authentication data.",null,null)
                            cb(null, response)
                        }
                    }
                });                
            }
        }
    });
}
module.exports.authenticate=(token,cb)=>{
    jwt.verify(token, tokenSecret, (err, value) => {
        if (err)
        {
            cb(err,null)
            return 
        } else {
            cb(null,value)
            return
        }
        
    })
}