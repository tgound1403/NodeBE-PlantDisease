const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const flash = require('express-flash')
const Post = require('../models/postModel.js');
const Comment = require('../models/commentModel.js');
const User = require('../models/userModel.js');
// const { default: CommentModal } = require('../../frontend/src/comments/CommentModal.js');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const multer = require('multer')
const uuidv4 = require('uuid');
const { default: mongoose } = require('mongoose');
const DIR = './backend/images/';
const fs = require('fs')
const path = require('path')

// Set up storing image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
});

var upload = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } })

// POST
router.post('/comments', jsonParser, (req, res) => {
  console.log('Body:', req.body);

  const data = req.body;
  const newComment = new Comment(data);

  newComment.save((error) => {
    if (error) {
      res.status(500).json({ msg: 'Sorry, server error while send comment' })
    }
    else {
      res.json({
        msg: 'We have received comment!!!'
      });
    }
  })
});

router.post('/post', jsonParser, (req, res) => {
  console.log("Body: ", req.body);

  const data = req.body;
  const newPost = new Post(data);

  newPost.save((error) => {
    if (error) {
      res.status(500).json({
        msg: 'Sorry, server happen error while send post to db'
      })
    } else {
      res.json({
        msg: "DB have received Post!!!"
      });
    }
  })
})

router.post('/post-with-img', upload.single('image'), (req, res, next) => {

  const data = req.body;
  const file = req.file;
  let img = fs.readFileSync(file.path);
  let encode_image = img.toString('base64');

  let final_img = {
    filename: file.originalname,
    contentType: file.mimetype,
    data: fs.readFileSync(req.file.path).toString('base64'),
    imgBase64: encode_image
  }

  const newPost = new Post({
    _id: new mongoose.Types.ObjectId(),
    status: data.status,
    creator: data.creator,
    creatorAvatar: data.creatorAvatar,
    createTime: data.createTime,
    imageInfo: final_img,
    imageSrc: encode_image
  });

  newPost.save().then((result) => {
    // console.log(result.img.Buffer);
    // console.log('Saved to database');
    // res.contentType(final_img.contentType)
    // res.send(final_img.image)
    res.status(200).json({
      message: "Post upload successfully!",
      postCreated: {
        _id: result._id,
        image: result.image
      }
    })

  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  })
})

// GET
router.get('/comments', (req, res) => {
  Comment.find({})
    .then((data) => {
      // console.log('Comments: ', data);
      console.log('get comments succeed')
      res.json(data);
    })
    .catch((error) => {
      console.log("Error: ", error);
    })
});

const updateComment = async (req, res) => {
  const commentId = req.params.id
  const { userId } = req.body

  try {
    const comment = await commentModel.findById(commentId)
    if (comment.userId === userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json("Comment Update")
    }
    else {
      res.status(403).json("Update failed")
    }
  }
  catch (error) {
    res.status(500).json(error)
  }
}

router.put('/comments/:id', updateComment)
const deleteComment = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const comment = await commentModel.findById(id)
    if (comment.userId === userId) {
      comment.deleteOne();
      res.status(200).json("Comment deleted");
    }
    else {
      res.status(403).json("Delete failed")
    }
  }
  catch (error) { res.status(500).json("Server error") }
}


router.delete("/comments/:id", deleteComment)

router.get('/posts', (req, res) => {
  Post.find({})
    .then((data) => {
      // console.log('Posts: ', data);
      console.log('get posts succeed')
      res.json(data);
    })
    .catch((error) => {
      console.log("Error: ", error);
    })
});

router.get('/users', (req, res) => {
  User.find({})
    .then((data) => {
      console.log('Users: ', data);
      res.json(data[1].name);
    })
    .catch((error) => {
      console.log("Error: ", error);
    })
});


module.exports = router;