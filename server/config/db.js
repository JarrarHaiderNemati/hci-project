import mongoose from 'mongoose'

export async function connectDb() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is empty. Add your MongoDB connection string to .env.')
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')
}
