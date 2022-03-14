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
    createdAt:Date
})


module.exports = model('Message', message)
