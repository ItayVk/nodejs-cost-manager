const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: Number
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    birthday: {
        type: String
    }
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;