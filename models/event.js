const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: { type: String, require: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    description: { type: String, require: false },
    img: { type: String, require: false },
    startDate: { type: String, require: false },
    endDate: { type: String, require: false },
    tasks: [{
        name: { type: String, require: false },
        description: { type: String, require: false },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
        taken: { type: Boolean, require: false },
        completed: { type: Boolean, require: false, default: false },

    }],
    slots: { type: Number, require: false },
    members: [ { type: String, require: false } ],
    questions: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
        username: { type: String, require: false },
        question: { type: String, require: false },
        answers: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
            username: { type: String, require: false },
            answer: { type: String, require: false }
        }]
    }],
    map: {
        origin: {
            lat: {type: Number, require: false},
            lng: {type: Number, require: false} 
        },
        destination: {
            lat: { type: Number, require: false },
            lng: { type: Number, require: false }
        },
    waypoints: [
        {
            location: {type: String, require: false}
        }
    ],
        markers: [
            {
                coords: {
                    lat: { type: Number, require: false },
                    lng: { type: Number, require: false }
                }
            }
        ]
        
    }
   
});

module.exports = mongoose.model('event', eventSchema);