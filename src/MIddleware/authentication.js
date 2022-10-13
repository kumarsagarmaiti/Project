const jwt = require('jsonwebtoken')
const userModel = require("../Models/userModel")
const validate = require("../Utility/validator");
 

const authentication =  (req, res, next) => {
    try {
        let bearerToken = req.headers.authorization
        if (!bearerToken) bearerToken = req.headers.authorization;
        if (!bearerToken) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }
        let BearerToken = bearerToken.split(' ');
        let token = BearerToken[1];
        jwt.verify(token, "Group-10 secret key", function (error,data) {
            if(error) {
              return res.status(401).send({ status: false, message: error.message });
            }else {
              req.decodedToken = data;
              console.log(decodedToken)
              next()
            }
          });
        } catch (error) {
            return res.status(500).send({ status: false, error: error.message });
           }
         }

         const Authorization = async (req, res, next) => {
            try {
                let loggedInUser = req.decodedToken.userId;
                let authorizeuser;
                if(req.params.userId){
                    if(!validate.isValidObjectId(req.params.userId)) 
                      return res.status(400).send({ status: false, message: "Enter a valid user Id" });
                      let checkUser = await userModel.findById(req.params.userId);
          if(!checkUser) 
            return res.status(404).send({ status: false, message: "User not found" });
          authorizeuser = checkUser._id
                }
                if(!authorizeuser) return res.status(400).send({ status: false, message: "User-id is required" });
                if(loggedInUser !== authorizeuser) 
          return res.status(403).send({ status: false, message: "Error!! authorization failed" });
          next();
        } catch (error) {
          return res.status(500).send({ status: false, error: error.message });
        }
      }