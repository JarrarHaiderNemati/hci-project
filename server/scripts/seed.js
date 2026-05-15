import 'dotenv/config'
import { connectDb } from '../config/db.js'
import { seededMenuItems } from '../data/menuSeed.js'
import { MenuItem } from '../models/MenuItem.js'

await connectDb()

for (const item of seededMenuItems) {
  await MenuItem.updateOne({ itemId: item.itemId }, { $set: item }, { upsert: true })
}

console.log(`Seeded ${seededMenuItems.length} cafeteria menu items`)
process.exit(0)
