import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    studentId: { type: String, default: '' },
    avatar: { type: String, default: '' },
    preferences: { type: [String], default: [] },
  },
  { timestamps: true },
)

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash
    delete ret.__v
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  },
})

export const User = mongoose.model('User', userSchema)
