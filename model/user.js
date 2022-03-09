const {
    Schema,
    model
} = require('mongoose')
const users = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = model('Users', users)