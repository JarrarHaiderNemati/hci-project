import mongoose from 'mongoose'

const orderLineSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: Number, required: true, unique: true },
    code: { type: String, required: true },
    day: { type: String, default: 'Today' },
    status: { type: String, default: 'Ready in 15 mins' },
    pickupTime: { type: String, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    convenienceFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: { type: String, default: null },
    paymentMethod: { type: String, default: 'Campus Card' },
    statusSteps: {
      type: [String],
      default: ['Order placed', 'Preparing', 'Ready for pickup'],
    },
    items: { type: [orderLineSchema], default: [] },
  },
  { timestamps: true },
)

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v
    ret.id = String(ret.orderNumber)
    delete ret._id
    delete ret.orderNumber
    return ret
  },
})

export const Order = mongoose.model('Order', orderSchema)
