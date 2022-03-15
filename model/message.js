const {Schema, model} = require('mongoose')

const message = new Schema({
    title: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    status: {
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})


module.exports = model('Message', message)
