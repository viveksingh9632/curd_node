var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
  
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    }
    
});

var User = module.exports = mongoose.model('User', UserSchema);

