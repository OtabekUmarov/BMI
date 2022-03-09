const {Schema, model} = require('mongoose')

const category = new Schema({
    title: String,
    status:{
        type:Number,
        default:1
    },
    menu: {
        type:Number,
        default: 1
    },
    order: {
        type: Number,
        default: 0
    }
})