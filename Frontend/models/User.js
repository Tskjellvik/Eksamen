const mongoose = require('mongoose');
const { isEmail, isLowercase } = require('validator');
const bcrypt = require('bcrypt');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        lowercase:true
//      validate: [ isEmail , 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
});

// fire a functon before doc saved to db
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
});

// static method to login user
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username')
}

const User = mongoose.model('user', userSchema)

module.exports = User;