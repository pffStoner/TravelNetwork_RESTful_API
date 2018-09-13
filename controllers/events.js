var ObjectId = require('mongodb').ObjectID;
const Event = require('../models/event');

exports.addEvent = (req, res, next) => {
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.tasks,
        gallery: req.body.gallery,
        createdBy: req.userData.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        slots: req.body.slots

    });
    event.save()
    .then(createdEvent => {
        res.status(201).json({
            message: 'Post added successfully',
            id: createdEvent._id,
            createdBy: createdEvent.createdBy

        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating event failed!"
        });
    });
    console.log("пост" + event);
    console.log("пост update" + req.body.slots);

};

exports.updateEvent = (req, res, next) => {
    const event = new Event({
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.tasks,
        gallery: req.body.gallery,
        createdBy: req.userData.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        slots: req.body.slots
    });
    Event.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, event)
    .then(resp => {
        console.log(resp);
        if (resp.nModified > 0) {
            res.status(201).json({
                message: 'Event updated successfully',
            });
        } else {
            res.status(401).json({ message: 'Not Authorizied' })
        }
    }) .catch(error => {
        res.status(500).json({
            message: "Updating event failed!"
        });
    });
    console.log("пост update" + event);
    console.log("пост update" + req.body.slots);
};
exports.fetchStartEvents =  (req, res, next) => {
    console.log(req.query);
    sortOption = req.query.sort;
  
    var sort = {};
    sort[sortOption] = -1;
    
    Event.find({
        startDate: {
            $gte: ('2018-01-01')
        }
    })
   .sort(sort)
    .then((document) => {
       // console.log('get ' + document);
        res.status(200).json({
            message: "Event fetched successfully!",
            events: document
        });
    }) .catch(error => {
        res.status(500).json({
            message: "Fetching events failed!"
        });
    });
};
exports.fetchEvents =  (req, res, next) => {
    console.log(req.query);
    afterDate = req.query.afterDate;
    beforeDate = req.query.beforeDate;
    sortOption = req.query.sort;
  
    var sort = {};
    if(sortOption === 'name'){
        sort[sortOption] = 1;
    }else{
        sort[sortOption] = -1;
    }
    
    Event.find({
        startDate: {
            $gte: (afterDate),
            $lt: (beforeDate)
        }
    })
   .sort(sort)
    .then((document) => {
       // console.log('get ' + document);
        res.status(200).json({
            message: "Event fetched successfully!",
            events: document
        });
    }) .catch(error => {
        res.status(500).json({
            message: "Fetching events failed!"
        });
    });
};

exports.deleteEvent = (req, res, next) => {
    console.log(req.params.id);
    Event.deleteOne({ _id: req.params.id, createdBy: req.userData.userId })
    .then(result => {
        console.log('RESULT !!!!!!!!!!!!!!!!!!!!!!' + result);
        if (result.n > 0) {
            res.status(201).json({
                message: 'Event deleted successfully',

            });
        } else {
            res.status(401).json({ message: 'Not Authorizied' })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Deleting event failed!"
        });
    });

};

exports.fetchEvent =  (req, res, next) => {
    Event.findById(req.params.id)
    .then(event => {
        if (event) {
            res.status(200).json(event)
        } else {
            res.status(400).json({ message: 'Event not found!' });
        }
    }) .catch(error => {
        res.status(500).json({
            message: "Fetching event failed!"
        });
    });
};

exports.addGoogleMap = (req, res, next) => {
    const map = req.body;
    console.log(map);
    
    const id = req.params.id;
    Event.findByIdAndUpdate(id, { $set: { map: map } }, { new: true })
    .then(mapInfo => {
        res.status(200).json(mapInfo);
    })
     .catch(error => {
        res.status(500).json({
            message: "Saving map failed!"
        });
    });
};

exports.getGoogleMap = (req, res, next) => {

    var query = Event.findById(req.params.id).select('map');

    // query.exec(function (err, mapInfo) {
    //     if (err) return next(err);
    //     res.status(200).json(mapInfo);
    // })
    
    query
    .exec()
    .then(mapInfo => {
        res.status(200).json(mapInfo);
    })
     .catch(error => {
        res.status(500).json({
            message: "Fetching map failed!"
        });
    });
};



exports.addTask = (req, res, next) => {
    const userId = req.body.userId;
    const taskId = req.body.taskId;
    const taskComplete = req.body.taskComplete;
    //const id = req.params.id;
    console.log(req.body);
    Event.update({ 'tasks._id': taskId }, {
        '$set': {
            'tasks.$.userId': userId,
            'tasks.$.completed': taskComplete
        }
    })
    .then(task => {
        res.status(200).send(task);
    })
    .catch(error => {
        res.status(500).json({
            message: "Adding task failed!"
        });
    });
    
};

exports.getTasks = (req, res, next) => {
    userId = req.params.id;
    Event.aggregate([
     
        { $unwind: "$tasks" },
      {   $match : {'tasks.userId': ObjectId(userId) }},
        {
            $project: {
                _id: "$tasks._id",
                name: "$tasks.name",
                description: "$tasks.description",
                userId: '$tasks.userId',
                eventName: '$name',
                completed: '$tasks.completed'
            }
        }
    ])
        .then(docs => {
            res.status(200).json({
                //  count: docs.length,
                tasks: docs
            });
        }) .catch(error => {
            res.status(500).json({
                message: "Fetching  tasks failed!"
            });
        });
};

exports.joinedEvents = (req, res, next) => {
    userId = req.params.id;
    Event.aggregate([
        {   $match : {'members': userId }},
          {
              $project: {
                  _id: "$_id",
                  eventName: '$name',
                  startDate: '$startDate',
                  img: '$img'
              }
          }
      ])
        .then(docs => {
            res.status(200).json({
                //  count: docs.length,
                events: docs
            });
        }) .catch(error => {
            res.status(500).json({
                message: "Fetching  tasks failed!"
            });
        });
};




exports.joinEvent = (req, res, next) => {
    // const userId = req.body.userId;
    // const username = req.body.username;
    const eventId = req.params.id;
   const member = {
    userId: req.body.userId,
    username: req.body.username
   }
   Event.update(
    { _id: eventId },
    { $push: { members: req.body.userId },
    $inc:{slots: -1} }
 ) .then(docs => {
     console.log(docs);
     
    res.status(200).json({
        //  count: docs.length,
        tasks: docs
    });
}) .catch(error => {
    res.status(500).json({
        message: "Join event failed!"
    });
});
};

exports.cancelEvent = (req, res, next) => {
    // const userId = req.body.userId;
    // const username = req.body.username;
    const eventId = req.params.id;
   const member = {
    userId: req.body.userId,
    username: req.body.username
   }
   Event.update(
    { _id: eventId },
    { $pull: { members:req.body.userId },
    $inc:{slots: 1} }
 ) .then(docs => {
     console.log(docs);
     
    res.status(200).json({
        //  count: docs.length,
        tasks: docs
    });
}) .catch(error => {
    res.status(500).json({
        message: "Cancel event failed!"
    });
});
};

exports.getMembers = (req, res, next) => {
    Event.findById(req.params.id)
    .select('members')
    .then((document) => {
       // console.log('get ' + document);
        res.status(200).json({document});
    });
};

exports.addQuestion = (req, res, next) => {
    const eventId = req.params.id;
   const question = {
    userId: req.body.userId,
    username: req.body.username,
    question: req.body.question
   }

   Event.update(
    { _id: eventId },
    { $push: { questions: question } }
 ) .then(docs => {
     console.log(docs);
     
    res.status(200).json({
        //  count: docs.length,
        question: question
    });
}) .catch(error => {
    res.status(500).json({
        message: "Adding question failed!"
    });
});
};

exports.addAnswers = (req, res, next) => {
    const eventId = req.params.id;
    const questionId = req.body.questionId;
   const answer = {
    userId: req.body.userId,
    username: req.body.username,
    answer: req.body.answer,
   }
    Event.update(
        { "questions._id": questionId},
        { $push: 
            {"questions.$.answers": answer}
        }
    ).then(docs => {
        console.log(docs);
        
    res.status(200).json({
        //  count: docs.length,
        answer: answer
    });
    }) .catch(error => {
        res.status(500).json({
            message: "Adding answer failed!"
        });
    });

//    Event.update(
//     { _id: eventId },
//     { $push: { questions: question } }
//  ) .then(docs => {
//      console.log(docs);
     
//     res.status(200).json({
//         //  count: docs.length,
//         question: docs
//     });
// })
};

exports.getQuestionWall = (req, res, next) => {
    username='mitko';
    eventId = req.params.id;
     Event.aggregate([
     
        { $unwind: "$questions" },
      {   $match : {_id: ObjectId(eventId) }},
        {
            $project: {
                _id: "$questions._id",
                eventId : "$_id",
                username: "$questions.username",
                question: "$questions.question",
                userId: '$questions.userId',
                answers: '$questions.answers'
            }
        }
    ])
        .then(docs => {
            res.status(200).json({
                //  count: docs.length,
                questions: docs
            });
        }) .catch(error => {
            res.status(500).json({
                message: "Fetching questions failed!"
            });
        });

    // Event.find()
    // .select('questions')
    // .then((document) => {
    //    // console.log('get ' + document);
    //     res.status(200).json({
    //         message: "Event fetched successfully!",
    //         events: document
    //     });
    // });
}; 

exports.getUserEvents  = (req, res, next) => {
    userId = req.params.id;
    Event.aggregate([
        {   $match : {'createdBy': ObjectId(userId) }},
          {
              $project: {
                  _id: "$_id",
                  eventName: '$name',
                  startDate: '$startDate',
                  img: '$img'
              }
          }
      ])
        .then(docs => {
            res.status(200).json({
                //  count: docs.length,
                events: docs
            });
        }) .catch(error => {
            res.status(500).json({
                message: "Fetching  tasks failed!"
            });
        });
};