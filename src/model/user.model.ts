import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String
    },
    password: {
        type: String
    }
})

export const User = mongoose.model('user', userSchema)

export const findUser = async (email: string) => {
    return await User.findOne({ email: email })
}

export const saveUser = async (data: Object) => {
    return await User.create(data)
}