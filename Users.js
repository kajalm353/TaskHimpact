const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
let User = require("../models/Users");
const router = express.Router();


//@register user    --POST api


router.post("/createUser", async (req,res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).send({message:'User Created Successfully'});
  } catch (error) {
    console.log(error);
  res.status(500).send('Internal Server Error')

  }
});


router.get('/', async (req, res) => {
  try {

      if (req.query.userId) {
          var userDetails = await User.find({ _id: req.query.userId })
      } else {
          userDetails = await User.find({}).sort({ created_Date_Time: -1 })
      }


      res.status(200).send(userDetails);
  } catch (e) {
      res.status(500).send({
          message: 'Internal Server Error'
      })
  }
})


//@login api       --POST api

router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);

    const { userName, password } = req.body;

    if (!userName || !password)
      return res.status(401).send({ errors: "invalid credentials" });

    const user = await User.findOne({ userName }).lean();

    if (!user) {
      res.status(401).send("invalid credentials");
    }
    const token = jwt.sign(
      { email: user.userName, _id: user._id },
      "jwtPrivateKey"
    );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send("invalid credentials");
    } else {
      // console.log(http200);
      delete user.password;

      res
        // .header("x-access-token", token)
        .status(200)
        .send({ data: user, token: token });
    }
  } catch (e) {
    console.log(e);

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.delete("/deleteUser", auth, async(req,res) => {
  try {
    let userId = req.query.userId

    if(userId) {

      let deleteUserDetails = await User.findOneAndDelete({ _id: req.query.userId })
      res.status(200).send({message: 'User Deleted Successfully'});

    }else {
      res.status(422).send({message: "User Id is Required"})
    }
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error'
  })
  }

})




module.exports = router;
