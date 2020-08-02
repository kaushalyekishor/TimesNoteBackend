var mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    password: { type:String
},
    isActive:{type: Boolean, default: true},
    isDelete: {type: Boolean, default: false}
}, 
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);