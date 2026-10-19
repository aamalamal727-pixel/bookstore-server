const jwt=require('jsonwebtoken')
const jwtMiddileware=(req,res,next)=>{
    console.log("inside jwtMiddileware");
    //get-Token
    const token=req.headers.authorization.split(" ")[1]
    // console.log(token);
    if(token){
        //verify token
        try{
           const jwtResponse=jwt.verify(token,process.env.jwtSecret)
        //    console.log(jwtResponse);
           req.payload=jwtResponse.userMail
           next()
           
        }catch(err){
            res.status(401).json("Authorization failed!!! Invalid Token")

        }
    }else{
           res.status(401).json("Authorization failed!!! Please Provide Token")
    }
    
}

module.exports=jwtMiddileware