const { User }= require("../model/User")

const userAuth= function(req,res,next){
    const token = req.header("x-auth")

    if(token){

        User.findByToken(token)
        .then(function(user){
            if(user){
                if(user.allowAccess){
                    req.user= user
                    req.token= token
                    next()
                }else{
                    res.status("401").send("accesss denied")
                }  
            }else{
                res.send("401").send("token expired")
            }
        })
        .catch(function(err){
            res.status("401").send(err)
        })
    }else{
        res.send("401").send("invalid token")
    }
}

module.exports= {
    userAuth
}