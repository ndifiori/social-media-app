const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')

// Register
router.post('/register', async (req, res) => {
  try{
    // generate password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create user
    const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

    // save user
    const user = await newUser.save();
    res.status(200).json(user)
  }
  catch(err){
    console.log(err)
  }
});

// login 
router.post('/login', async (req, res) => {
  try{
    // check user exists
    const user = await User.findOne({email:req.body.email});
    !user && res.status(404).json('user does NOT exist');

    // check password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json('wrong password')

    // login
    res.status(200).json(user)
  }
  catch(err){
    res.status(500).json(err);
  }
})


module.exports = router;
