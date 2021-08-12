var customerModel = require('../models/customers');
var commonHelper = require('../helper/commonHelper')
var isEmail = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
var isPhoneno = /^\d{10}$/;

var customerController={  
    customerList(req,res){  
        customerModel.getCustomer((err,data)=>{  
            try {  
                if(err){  
                var response = commonHelper.commonMsg("failure","Unable to query database. Please check the error mentioned.",null,err)
                res.status(500).json(response)
                
                }     
                else if(data.length > 0){  
                var response = commonHelper.commonMsg("success","Data fetched successfully",data,null)
                res.status(200).json(response)
                }  
                else{  
                var response = commonHelper.commonMsg("no-record","No data found",data,null)
                res.status(204).json(response)
                // res.status(200).json({msg:"No data found", res:data, code:400})
                }  
            } catch (error) { 
            var response = commonHelper.commonMsg("failure","Something went wrong!",null,error)
            res.status(500).json(response)
            }  
        });
    },  
    getCustomerDetails(req,res){
        const user = { _id: req.param("id") };
        if (!user._id) {
                var response = commonHelper.commonMsg("failure","Customer id cannot be blank!",null,null)
                return res.status(400).json(response);
            }
        customerModel.findOne(user, (err,data)=>{  
               try {  
                 if(err){  
                    var response = commonHelper.commonMsg("failure","Unable to query database. Please check the error mentioned.",null,err)
                    return res.status(500).json(response)
                 }     
                 else if(data){  
                    var response = commonHelper.commonMsg("success","Data fetched successfully",data,null)
                   res.status(200).json(response)
                 }  
                 else{  
                    var response = commonHelper.commonMsg("no-record","No data found",data,null)
                    res.status(204).json(response)
                    // res.status(200).json({msg:"No data found", res:data, code:400})
                 }  
               } catch (error) { 
                var response = commonHelper.commonMsg("failure","Something went wrong!",null,error)
                res.status(500).json(response)
               }  
           });
    },  
    authenticate(req,res){
        var token = req.param("token");
        if (!token) {
                var response = commonHelper.commonMsg("failure","Please provide token!",null,null)
                return res.status(400).json(response);
            }
        customerModel.authenticate(token,(err,result)=>{
            if (err) {
                res.status(500).json(err)
                
            } else {
                if (result.exp > 0) {
                    res.status(200).json()
                } else{
                    res.status(500).json()
                }
            }
            return;
        })
    },
    signupCustomer(req,res,next){  
        try {
            const user = {  
                name: req.query.name, 
                gender: req.query.gender, 
                city: req.query.city,  
                state: req.query.state,  
                phone: req.query.phone,
                email: req.query.email,  
                password: req.query.password,
            };   
            if ((!user.name || typeof user.name !== "string") ||
            (!user.gender || typeof user.gender !== "string") || 
            (!user.city || typeof user.city !== "string") || 
            (!user.state || typeof user.state !== "string") || 
            (!user.email || typeof user.email !== "string" || !isEmail.test(user.email) ) || 
            (!user.phone) ||
            (!user.password || typeof user.password !== "string")
            ) {
                var response = commonHelper.commonMsg("failure","Invalid params!",null,null)
                console.log("invlid>>>>>",isEmail.test(user.email));
                return res.status(500).end();
            }
            customerModel.signupCustomer(user,(err,data)=>{  
                console.log("data>>>>>",err,data);
                if(err){  
                    var response = commonHelper.commonMsg("failure","Something went wrong!",null,err)
                    return res.status(500).json(response)
                }  
                else{  
                    var response = commonHelper.commonMsg("success","Customer added successfully",data,null)
                    // var tokenData =  commonHelper.generateToken(response)
                    // return user
                    // return res.status(200).json({token: tokenData,email:data.email,password:req.query.password,data:data})
                    return res.status(200).json(response)
                }  
            })  
        }  
        catch (error) {  
            console.log(error);
                 var response = commonHelper.commonMsg("failure","Something went wrong1!",null,error)
                 return res.status(500).json(response)    
        }  
    },
    updateCustomer(req,res){  
            try {
                const user = {  
                    name: req.query.name, 
                    gender: req.query.gender, 
                    city: req.query.city,  
                    state: req.query.state,  
                    phone: req.query.phone,
                    email: req.query.email,  
                    password: req.query.password,
                    id: req.query.id,
                };
                if ((!user.name || typeof user.name !== "string") ||
                (!user.gender || typeof user.gender !== "string") || 
                (!user.city || typeof user.city !== "string") || 
                (!user.state || typeof user.state !== "string") || 
                (!user.email || typeof user.email !== "string" || !isEmail.test(user.email) ) || 
                (!user.phone || !isPhoneno.test(user.phone)) ||
                (!user.id) ||
                (!user.password || typeof user.password !== "string")
                ) {
                    var response = commonHelper.commonMsg("failure","Invalid params!",null,null)
                    return res.status(400).json(response);
                }
                customerModel.updateCustomer(user,(err,data)=>{  
                    if(err){
                        var response = commonHelper.commonMsg("failure","Something went wrong1!",null,err)
                        res.status(500).json(response)
                    }  
                    else{  
                        var response = commonHelper.commonMsg("success","Customer updated successfully",data,null)
                        res.status(200).json(response)
                    }  
                })  
            }  
            catch (error) {  
                    var response = commonHelper.commonMsg("failure","Something went wrong2!",null,error)
                    res.status(500).json(response)    
            }  
    },
    deleteCustomer(req,res){  
            try {
                const user = { id: req.param("id") };
                
                if (!user.id) {
                    var response = commonHelper.commonMsg("failure","Customer id cannot be blank!",null,null)
                    return res.status(400).json(response);
                }
                customerModel.deleteCustomer(user,(err,data)=>{  
                    if(err){  
                        // console.log('error occured',err)  
                        var response = commonHelper.commonMsg("failure","Something went wrong!",null,err)
                        return res.status(500).json(response)
                    }  
                    else{  
                        var response = commonHelper.commonMsg("success","Customer updated successfully",data,null)
                        return res.status(200).json(response)
                        
                    }  
                })  
            }  
            catch (error) {  
                    var response = commonHelper.commonMsg("failure","Something went wrong!",null,error)
                    return res.status(500).json(response)    
            }  
    },
    loginCustomer(req,res){
        try {
            const user = {
                email: req.query.email,
                password: req.query.password
            };
            if ((!user.email || typeof user.email !== "string" || !isEmail.test(user.email) ) || 
            (!user.password || typeof user.password !== "string")) {
                var response = commonHelper.commonMsg("failure","Please check entered fields!",null,null)
                return res.status(400).json(response);
            }
            customerModel.loginCustomer(user,(err,data)=>{  
                if(err){  
                    var response = commonHelper.commonMsg("failure","Something went wrong!",null,err)
                    res.status(500).json(response)
                }  
                else{  
                    console.log(data);
                    if (data.info.code == 200) {
                        var tokenData =  commonHelper.generateToken(data)
                        // return user
                        return res.status(200).json({token: tokenData})
                        // res.status(200).json(response)
                        // res.status(200).json(data)
                    } else {
                        return res.status(204).json(data)

                    }
                }  
            })  
        }  
        catch (error) {  
            // return error
                var response = commonHelper.commonMsg("failure","Something went wrong!",null,error)
                return res.status(500).json(response)    
        } 
    }
  
}  
  
module.exports = customerController;  