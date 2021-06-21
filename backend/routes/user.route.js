let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  router = express.Router();

// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


// User model
let User = require('../models/User');


// POST User
router.post('/create-user', upload.single('avatar'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email:req.body.email,
    role:req.body.role,
    avatar: url + '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        avatar: result.avatar,
      },
    });
  }).catch(err => {
      res.status(500).json({
        error: err
      });
  })
})

//update user
router.put("/editUser/:userId", upload.single("avatar"), async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
    try {
      const id = req.params.userId;
      const name = req.body.name;
      const email = req.body.email;
      
      const role = req.body.role;
      var avatar;
      if(req.file){
        avatar = url + "/public/" + req.file.filename;
      }
      else{
        oneUser=await User.findById(id);
        avatar = oneUser.avatar;
      }
      user = await User.updateOne(
        { _id: id },
        {
          $set: {
            name: name,
            email: email,
            avatar: avatar,
            role: role,
          },
        }
      );
      return res.json({
        success: 1,
        message: "User detail updated successfully.",
        data: { user },
      });
    } catch (err) {
      console.error();
      res.status(500).send(err.message);
    }
});

//Delete User
router.delete("/deleteUser/:userId",async (req, res, next) => {
  try {
    const removeUser = await User.remove({ _id: req.params.userId });
    res.json(removeUser);
  } catch (err) { 
    res
      .status(500)
      .json({ message: "Internal Server Error. We are looking into this." });
  }
});

// GET All Users
router.get("/", (req, res, next) => {
  User.find().then(data => {
    res.json(data);
  });
});

router.get('/:userId', async(req,res)=>{
    try {
      const user = await User.findById(req.params.userId);
      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Internal Server Error. We are looking into this." });
    }
})
module.exports = router;
