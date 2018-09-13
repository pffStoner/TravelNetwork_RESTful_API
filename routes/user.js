const express = require("express");
const MailBox = require("../models/user");

const router = express.Router();
const userController = require("../controllers/user");

router.post("/api/user/signup",userController.userSignup);

router.post("/api/user/login", userController.userLogin);

router.put("/api/user/sendEmail/", (req, res, next) => {
  const recieveUserId = req.body.recieveUserId;
  const sendUsername = req.body.sendUsername;
  const sendUserId = "5b658af220d7f9b48cde0187";
  const mail = {
    title: req.body.title,
    date: req.body.date,
    content: req.body.content,
    username: req.body.sendUsername
  };
  const mailbox = new MailBox(
    {
      date: 'req.body.date' ,
      content: 'req.body.content',
      username: 'req.body.username'
    }
  );
  User.update(
    { _id: recieveUserId },
    { $push: { mailbox: mail } }
  ) .then(docs => {
     console.log('stana',docs);
     console.log(mailbox);

    res.status(200).json({
        count: docs.length,
        mailbox: docs
    });
  })

//   User.findOne({ _id: recieveUserId }, function (err, doc) {
//      if(err)
//     res.sendStatus(500);
//     if(!doc) { 
//       res.sendStatus(404);
//   }else {
//      doc.mailbox.push({ mailbox:  {
//       title: 'title' ,
//       date: 'req.body.date' ,
//       content: 'req.body.content',
//       username: 'req.body.username'
//     } });
//    doc.markModified('mailbox');
//     doc.save(); 
// } })

  
});

router.get('/api/users', (req, res, next) => {
  var query = User.findById('5b5a13758bf57790c4b44946').select('mailbox');

  query.exec(function (err, mails) {
      if (err) return next(err);
      res.status(200).json(mails);
  });

});

module.exports = router;