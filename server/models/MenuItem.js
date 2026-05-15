import mongoose from 'mongoose'

const nutritionSchema = new mongoose.Schema(
  {
    calories: Number,
    protein: String,
    prep: String,
  },
  { _id: false },
)

const menuItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    category: { type: String, required: true },
    section: { type: String, enum: ['special', 'popular', 'regular'], default: 'regular' },
    rating: Number,
    calories: Number,
    stock: { type: Number, default: 12, min: 0 },
    ingredients: { type: [String], default: [] },
    nutrition: { type: nutritionSchema, default: () => ({}) },
    image: { type: String, default: '' },
  },
  { timestamps: true },
)

menuItemSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v
    ret.id = ret.itemId
    delete ret._id
    delete ret.itemId
    return ret
  },
})

export const MenuItem = mongoose.model('MenuItem', menuItemSchema)
