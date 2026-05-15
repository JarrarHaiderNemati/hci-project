async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export const api = {
  login(credentials) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },
  signup(payload) {
    return request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  logout() {
    return request('/api/auth/logout', {
      method: 'POST',
    })
  },
  getProfile() {
    return request('/api/profile')
  },
  getMenu({ category = 'All', search = '' } = {}) {
    const params = new URLSearchParams({ category, search })
    return request(`/api/menu?${params}`)
  },
  getMenuItem(itemId) {
    return request(`/api/menu/${itemId}`)
  },
  updateProfile(payload) {
    return request('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
  getCart() {
    return request('/api/cart')
  },
  addToCart(itemId, quantity = 1) {
    return request('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ itemId, quantity }),
    })
  },
  updateCartItem(itemId, quantity) {
    return request(`/api/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
  },
  removeCartItem(itemId) {
    return request(`/api/cart/${itemId}`, {
      method: 'DELETE',
    })
  },
  getOrders() {
    return request('/api/orders')
  },
  placeOrder(payload = {}) {
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  reorder(orderId) {
    return request(`/api/orders/${orderId}/reorder`, { method: 'POST' })
  },
}
