const users = require("../model/useModel");
const jwt = require("jsonwebtoken");

//register
exports.registerController = async (req, res) => {
  console.log("inside user register controller");
  const { username, email, password } = req.body;
  // console.log(username,email,password);
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(402).json("user already exists");
    } else {
      const newUser = await users.create({
        username,
        email,
        password,
      });
      res.status(200).json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//login

exports.loginController = async (req, res) => {
  console.log("inside user login controller");
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      if (password == existingUser.password) {
        const token = jwt.sign(
          { userMail: existingUser.email, role: existingUser.role },
          process.env.jwtSecret,
        );
        res.status(200).json({ user: existingUser, token });
      } else {
        res.status(401).json("incorrect email/password");
      }
    } else {
      res.status(404).json("account does not exist");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//google login controller
exports.googleLoginController = async (req, res) => {
  console.log("inside user google login controller");
  const { email, password, username, picture } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      //login

      const token = jwt.sign(
        { userMail: existingUser.email, role: existingUser.role },
        process.env.jwtSecret,
      );
      res.status(200).json({ user: existingUser, token });
    } else {
      //register
      const newUser = await users.create({
        username,
        email,
        password,
        picture,
      });
      const token = jwt.sign(
        { userMail: newUser.email, role: newUser.role },
        process.env.jwtSecret,
      );
      res.status(200).json({ user: newUser, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//editUserController
exports.editUserController = async (req, res) => {
  console.log("inside user edit user controller");
//   const email=req.payload
  const { id } = req.params;
  const {email, password, username, bio, role, picture } = req.body;
  const updatePicture = req.file ? req.file.filename : picture;
  console.log(id, email, password, username, bio, role,picture);
  try {
    const updateUser = await users.findByIdAndUpdate(
      { _id: id },
      { email, password, username, bio, role, picture: updatePicture },
      { new: true },
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


//getAllUsers-admin
exports.getAllUsersController=async(req,res)=>{
  console.log("inside get All Users Controller");
  try{
    const allUsers=await users.find({role:{$ne:'admin'}})
    res.status(200).json(allUsers)
  }catch(error){
    console.log(error);
    res.status(500).json(error)
    
  }
}