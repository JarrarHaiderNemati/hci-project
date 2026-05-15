import { CartItem } from '../models/CartItem.js'
import { MenuItem } from '../models/MenuItem.js'
import { Order } from '../models/Order.js'

export function serializeMenuItem(item, quantityInCart = 0) {
  const serialized = item.toJSON()
  serialized.stockLeft = Math.max(0, serialized.stock - quantityInCart)
  return serialized
}

export async function getCartLines(userId) {
  return CartItem.find({ user: userId }).sort({ updatedAt: 1 })
}

export async function getCartQuantity(userId, itemId) {
  const line = await CartItem.findOne({ user: userId, itemId })
  return line?.quantity || 0
}

export async function getCartSummary(userId) {
  const lines = await getCartLines(userId)
  const items = []

  for (const line of lines) {
    const item = await MenuItem.findOne({ itemId: line.itemId })
    if (item) {
      items.push({ ...serializeMenuItem(item, line.quantity), quantity: line.quantity })
    }
  }

  const subtotal = Number(
    items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
  )
  const tax = Number((subtotal * 0.05).toFixed(2))
  const convenienceFee = items.length ? 0.5 : 0

  return {
    items,
    subtotal,
    tax,
    convenienceFee,
    total: Number((subtotal + tax + convenienceFee).toFixed(2)),
    pickupTime: '12:45 PM (15 mins)',
  }
}

export async function hydrateOrder(order) {
  const serialized = order.toJSON()
  const items = []

  for (const line of order.items) {
    const item = await MenuItem.findOne({ itemId: line.itemId })
    if (item) {
      items.push({ ...serializeMenuItem(item, line.quantity), quantity: line.quantity })
    }
  }

  return { ...serialized, items }
}

export async function getNextOrderNumber() {
  const lastOrder = await Order.findOne().sort({ orderNumber: -1 })
  return lastOrder ? lastOrder.orderNumber + 1 : 1050
}
