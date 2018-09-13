const express = require('express');
const checkAuth = require('../middleware/check-auth');

const eventsController = require('../controllers/events')
const router = express.Router();

router.post("/api/events", checkAuth,  eventsController.addEvent);


router.put("/api/events/:id", checkAuth, eventsController.updateEvent);

router.get('/api/events',eventsController.fetchStartEvents);

router.get('/api/eventsSort',eventsController.fetchEvents);




router.delete('/api/events/:id', checkAuth, eventsController.deleteEvent);


router.get("/api/events/:id",eventsController.fetchEvent);
// add map
router.put("/api/events/map/:id", checkAuth, eventsController.addGoogleMap);

router.get('/api/events/map/:id', eventsController.getGoogleMap);

router.put("/api/events/task/:id", checkAuth, eventsController.addTask);

//taskComplete

// router.put("/api/events/task/:id", checkAuth, (req, res, next) => {
//     const userId = req.body.userId;
//     const taskId = req.body.taskId;
//     const id = req.params.id;
//     console.log(req.body);
//     Event.update({ 'tasks._id': taskId }, {
//         '$set': {
//             'tasks.$.userId': null
//         }
//     }, function (err, task) {
//         //   if (err) return handleError(err);
//         res.send(task);
//         console.log(task);
//     });
// });


// router.get("/api/events/tasks/:id", (req, res, next) => {
//   //  userId = req.params.id;
//     Event.find({'tasks': { $elemMatch: { userId:  req.params.id} }})
//    .where({'tasks.userId': { $exists: true }})
//    .select('tasks name')
//     .then(docs => {
//     res.status(200).json({
//   //  count: docs.length,
//    event: docs
//     });
//     })
//     // Event.find({'tasks.userId': userId},function (err, task) {
//     // //    if (err) return handleError(err);
//     //     res.send(task);
//     //     console.log(task);
//     // }).select('tasks');
// });
router.get("/api/events/tasks/:id", eventsController.getTasks);
router.get("/api/events/joinedEvents/:id", eventsController.joinedEvents);



// router.put("/api/events/joinEvent/:id", checkAuth, (req, res, next) => {
//     const userId = req.body.userId;
//     const taskId = req.body.username;

//     //const id = req.params.id;
//     console.log(req.body);
//     Event.update({ 'members._id': taskId }, {
//         '$set': {
//             'tasks.$.userId': userId,
//             'tasks.$.completed': taskComplete
//         }
//     }, function (err, task) {
//         //   if (err) return handleError(err);
//         res.send(task);
//         console.log(task);
//     });
// });

router.put("/api/events/joinEvent/:id", checkAuth, eventsController.joinEvent);
// not goint to event
router.put("/api/events/cancelEvent/:id", checkAuth, eventsController.cancelEvent);

router.get("/api/events/members/:id", eventsController.getMembers);
// question wall
router.put("/api/events/questions/:id", checkAuth, eventsController.addQuestion);

router.put("/api/events/answers/:id", checkAuth, eventsController.addAnswers);


router.get('/api/questions/:id', eventsController.getQuestionWall);
router.get('/api/events/userEvents/:id', eventsController.getUserEvents);

router.get('/api/questions', (req, res, next) => {
    username='mitko';
    eventId = req.params.id;


    Event.find()
    .select('questions')
    .then((document) => {
       // console.log('get ' + document);
        res.status(200).json({
            message: "Event fetched successfully!",
            questions: document
        });
    });
});

router.get('/api/search', (req, res, next) => {


    Event.find( {name:'Piknik'})
    .then((document) => {
       // console.log('get ' + document);
        res.status(200).json({
            message: "Event fetched successfully!",
            search: document
        });
    });
});

// db.survey.update(
//     { },
//     { $pull: { results: { score: 8 , item: "B" } } },
//     { multi: true }
//   )
module.exports = router;