const validate = require("../Utility/validator")

const login = async function (req, res) {
    try{
    let body = req.body
    const { email, password } = body
   
    if (validate.isEmptyObject(body)) {
        return res.status(400).send({ status: false, message: "Data is required to login" }) }
    
        if (!validate.isEmptyVar(email)) return res.status(400).send({ status: false, message: "EmailId is mandatory" })

      if (!validate.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Email must be valid" })}; 
    
            if (validate.isEmptyVar(password)) return res.status(400).send({ status: false, message: "Password is mandatory" })

 if (!validate.isValidPassword) {
          return res.status(400).send({ status: false, message: `Password length should be A Valid Password And Length Should Be in between 8 to 15 ` })}
              
     let bcryptpassword = await bcrypt.compare(password, user.password);
        if (!bcryptpassword) return res.status(401).send({ status: false, message: "Incorrect password" })
      
        let user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).send({ status: false, msg: "Invalid credentials or user not exist" })
        }

        const token = jwt.sign({
            userId: user._id, iat: new Date().getTime(),
            exp: 10,
        }, "Group-10 secret key")
        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: user._id, token: token } })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}