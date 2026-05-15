import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

cartItemSchema.index({ user: 1, itemId: 1 }, { unique: true })

export const CartItem = mongoose.model('CartItem', cartItemSchema)
