const mongoose = require('mongoose');

const visualSchema = new mongoose.Schema({
    title: {type:String},
    text: {type: String},
    username: {type:String}
})

const visualScreen = mongoose.model('Post', visualSchema);

module.exports = visualScreen;