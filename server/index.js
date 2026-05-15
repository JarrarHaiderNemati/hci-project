import 'dotenv/config'
import bcrypt from 'bcryptjs'
import express from 'express'
import { connectDb } from './config/db.js'
import { CartItem } from './models/CartItem.js'
import { MenuItem } from './models/MenuItem.js'
import { Order } from './models/Order.js'
import { User } from './models/User.js'
import {
  getCartQuantity,
  getCartSummary,
  getNextOrderNumber,
  hydrateOrder,
  serializeMenuItem,
} from './services/cafeteria.js'

const app = express()
const port = process.env.PORT || 4000
let currentUserId = null

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

async function requireCurrentUser(req, res, next) {
  if (!currentUserId) {
    res.status(401).json({ message: 'Please log in first' })
    return
  }

  const user = await User.findById(currentUserId)

  if (!user) {
    currentUserId = null
    res.status(401).json({ message: 'Please log in first' })
    return
  }

  req.user = user
  next()
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    const password = String(req.body.password || '')

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    currentUserId = user._id
    res.json({ user })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').toLowerCase().trim()
    const password = String(req.body.password || '')

    if (!name || !email || password.length < 6) {
      res.status(400).json({
        message: 'Name, email, and a password of at least 6 characters are required',
      })
      return
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email,
      passwordHash,
      studentId: '',
      avatar: '',
      preferences: [],
    })

    currentUserId = user._id
    res.status(201).json({ user })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/logout', (req, res) => {
  currentUserId = null
  res.json({ ok: true })
})

app.get('/api/profile', requireCurrentUser, (req, res) => {
  res.json(req.user)
})

app.patch('/api/profile', requireCurrentUser, async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      preferences: req.body.preferences,
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key]
    })

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })

    res.json(user)
  } catch (error) {
    next(error)
  }
})

app.get('/api/menu', requireCurrentUser, async (req, res, next) => {
  try {
    const category = req.query.category
    const search = String(req.query.search || '').trim()
    const query = {}

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const items = await MenuItem.find(query).sort({ createdAt: 1 })
    const hydratedItems = []

    for (const item of items) {
      hydratedItems.push(serializeMenuItem(item, await getCartQuantity(req.user._id, item.itemId)))
    }

    res.json({
      specials: hydratedItems.filter((item) => item.section === 'special'),
      popular: hydratedItems.filter((item) => item.section === 'popular'),
    })
  } catch (error) {
    next(error)
  }
})

app.get('/api/menu/:itemId', requireCurrentUser, async (req, res, next) => {
  try {
    const item = await MenuItem.findOne({ itemId: req.params.itemId })

    if (!item) {
      res.status(404).json({ message: 'Menu item not found' })
      return
    }

    res.json(serializeMenuItem(item, await getCartQuantity(req.user._id, item.itemId)))
  } catch (error) {
    next(error)
  }
})

app.get('/api/cart', requireCurrentUser, async (req, res, next) => {
  try {
    res.json(await getCartSummary(req.user._id))
  } catch (error) {
    next(error)
  }
})

app.post('/api/cart', requireCurrentUser, async (req, res, next) => {
  try {
    const itemId = req.body.itemId
    const quantity = Math.max(1, Number(req.body.quantity || 1))
    const item = await MenuItem.findOne({ itemId })

    if (!item) {
      res.status(404).json({ message: 'Menu item not found' })
      return
    }

    const currentQuantity = await getCartQuantity(req.user._id, itemId)

    if (currentQuantity + quantity > item.stock) {
      res.status(409).json({
        message: Only ${Math.max(0, item.stock - currentQuantity)} left in stock,
      })
      return
    }

    await CartItem.updateOne(
      { user: req.user._id, itemId },
      { $set: { quantity: currentQuantity + quantity } },
      { upsert: true },
    )

    res.status(201).json(await getCartSummary(req.user._id))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/cart/:itemId', requireCurrentUser, async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity)
    const item = await MenuItem.findOne({ itemId: req.params.itemId })

    if (!item) {
      res.status(404).json({ message: 'Menu item not found' })
      return
    }

    if (quantity > item.stock) {
      res.status(409).json({ message: Only ${item.stock} available in stock })
      return
    }

    if (quantity <= 0) {
      await CartItem.deleteOne({ user: req.user._id, itemId: req.params.itemId })
    } else {
      await CartItem.updateOne(
        { user: req.user._id, itemId: req.params.itemId },
        { $set: { quantity } },
        { upsert: true },
      )
    }

    res.json(await getCartSummary(req.user._id))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/cart/:itemId', requireCurrentUser, async (req, res, next) => {
  try {
    await CartItem.deleteOne({ user: req.user._id, itemId: req.params.itemId })
    res.json(await getCartSummary(req.user._id))
  } catch (error) {
    next(error)
  }
})

app.get('/api/orders', requireCurrentUser, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(await Promise.all(orders.map(hydrateOrder)))
  } catch (error) {
    next(error)
  }
})

app.post('/api/orders', requireCurrentUser, async (req, res, next) => {
  try {
    const cart = await getCartSummary(req.user._id)

    if (!cart.items.length) {
      res.status(400).json({ message: 'Cart is empty' })
      return
    }

    const promoCode = String(req.body.promoCode || '').toUpperCase()
    const discount = promoCode === 'SAVE10' ? Number((cart.subtotal * 0.1).toFixed(2)) : 0
    const total = Number((cart.total - discount).toFixed(2))
    const orderNumber = await getNextOrderNumber()

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      code: CAF-${orderNumber},
      day: 'Today',
      status: 'Ready in 15 mins',
      pickupTime: req.body.pickupTime || cart.pickupTime,
      subtotal: cart.subtotal,
      tax: cart.tax,
      convenienceFee: cart.convenienceFee,
      discount,
      total,
      promoCode: discount > 0 ? promoCode : null,
      paymentMethod: req.body.paymentMethod || 'Campus Card',
      statusSteps: ['Order placed', 'Preparing', 'Ready for pickup'],
      items: cart.items.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
    })

    await CartItem.deleteMany({ user: req.user._id })

    res.status(201).json({
      order: await hydrateOrder(order),
      cart: await getCartSummary(req.user._id),
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/orders/:orderId/reorder', requireCurrentUser, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      user: req.user._id,
      orderNumber: Number(req.params.orderId),
    })

    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    for (const line of order.items) {
      const item = await MenuItem.findOne({ itemId: line.itemId })
      if (!item) continue

      const currentQuantity = await getCartQuantity(req.user._id, line.itemId)
      const available = Math.max(0, item.stock - currentQuantity)
      const quantityToAdd = Math.min(line.quantity, available)
      if (quantityToAdd <= 0) continue

      await CartItem.updateOne(
        { user: req.user._id, itemId: line.itemId },
        { $set: { quantity: currentQuantity + quantityToAdd } },
        { upsert: true },
      )
    }

    res.json(await getCartSummary(req.user._id))
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: error.message || 'Server error' })
})

await connectDb()

app.listen(port, () => {
  console.log(API listening on http://127.0.0.1:${port})
})

setInterval(() => {}, 60 * 60 * 1000)