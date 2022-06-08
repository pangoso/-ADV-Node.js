var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    imagePath: {type: String, required: false},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
})

module.exports = mongoose.model('Product', schema)