import { useEffect, useState } from 'react'
import { api } from './api'
import heroPng from './assets/hero.png'
import './App.css'

const assets = {
  hero: heroPng,
  google: 'https://www.figma.com/api/mcp/asset/7e3a0ba4-3fc4-426f-965b-d126b8eaedb2',
  apple: 'https://www.figma.com/api/mcp/asset/851f387b-5d2a-47da-b024-93dbed41cc9b',
  profile: 'https://www.figma.com/api/mcp/asset/dcb03076-83e3-4925-8df7-10f281477b1e',
  friedVegetables:
    'https://www.figma.com/api/mcp/asset/c4d84ce6-3f76-4c91-9111-240dfb60d5a1',
  chickenSteak:
    'https://www.figma.com/api/mcp/asset/b58fdf3d-63f6-4016-ae00-b3e33e1cf9b0',
  burger:
    'https://www.figma.com/api/mcp/asset/d06a718a-987d-4f04-9a34-d205e6d08280',
  salad:
    'https://www.figma.com/api/mcp/asset/9e54d795-0420-48d8-bda4-7a7aca5b225a',
  tenders:
    'https://www.figma.com/api/mcp/asset/c1f7b7c2-99e3-4bb6-b750-cd8b97df232c',
  grainBowl:
    'https://www.figma.com/api/mcp/asset/9359f4b9-62d8-4f91-97ab-4bf814041a54',
  avocadoToast:
    'https://www.figma.com/api/mcp/asset/13b853a3-8419-42f3-bc06-5c55f69daad1',
}

const specials = [
  {
    name: 'Fried Vegetables',
    price: 12.5,
    description: 'Roasted chickpeas, feta, and fresh herbs',
    badge: 'Healthy Choice',
    stock: 8,
    stockLeft: 8,
    image: assets.friedVegetables,
  },
  {
    name: 'Chicken Steak',
    price: 15,
    description: 'Wild greens, asparagus, and lemon butter',
    badge: 'High Protein',
    stock: 6,
    stockLeft: 6,
    image: assets.chickenSteak,
  },
]

const popularItems = [
  {
    name: 'Classic Cheeseburger',
    price: 9.75,
    rating: 4.8,
    calories: 650,
    stock: 10,
    stockLeft: 10,
    image: assets.burger,
  },
  {
    name: 'Avocado Harvest Salad',
    price: 11.2,
    rating: 4.9,
    calories: 420,
    stock: 7,
    stockLeft: 7,
    image: assets.salad,
  },
  {
    name: 'Crispy Chicken Tenders',
    price: 8.5,
    rating: 4.7,
    calories: 580,
    stock: 5,
    stockLeft: 5,
    image: assets.tenders,
  },
]

const cartItems = [
  {
    name: 'Harvest Grain Bowl',
    description: 'Quinoa, Kale, Roasted Sweet Potato',
    price: 12.5,
    quantity: 2,
    stock: 6,
    stockLeft: 4,
    image: assets.grainBowl,
  },
  {
    name: 'Avocado Sourdough',
    description: 'Poached Egg, Chili Flakes, Radish',
    price: 9,
    quantity: 1,
    stock: 4,
    stockLeft: 3,
    image: assets.avocadoToast,
    badge: 'HEALTHY',
  },
]

const DEFAULT_STOCK_LEFT = 12

function money(value) {
  return `$${value.toFixed(2)}`
}

function getStockLeft(item, quantityInCart = 0) {
  const stock =
    typeof item.stock === 'number'
      ? item.stock
      : typeof item.stockLeft === 'number'
        ? item.stockLeft + quantityInCart
        : DEFAULT_STOCK_LEFT

  return Math.max(0, stock - quantityInCart)
}

function getStockLabel(item, short = false, quantityInCart = 0) {
  const stockLeft = getStockLeft(item, quantityInCart)

  if (stockLeft <= 0) return 'Out of stock'
  return short ? `${stockLeft} left` : `${stockLeft} left in stock`
}

function isItemOutOfStock(item, quantityInCart = 0) {
  return getStockLeft(item, quantityInCart) === 0
}

function Icon({ name }) {
  const paths = {
    home: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    orders:
      'M7 4h10a2 2 0 0 1 2 2v15l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2zm2 5h6m-6 4h6',
    profile:
      'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
    cart: 'M6 6h15l-2 8H8L6 3H3m6 16.5h.01M18 19.5h.01',
    search: 'm21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    trash:
      'M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3',
    clock:
      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14v5l3 2',
    card: 'M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm0 4h18',
    check: 'M20 6 9 17l-5-5',
    tag: 'M20 12 12 20 4 12V4h8zM8.5 8.5h.01',
    utensils:
      'M7 2v8m-3-8v8m6-8v8M4 10h6v12M17 2c2 2 3 4.5 3 7.5S19 15 17 15v7',
    mail: 'M4 6h16v12H4zm0 1 8 6 8-6',
    lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z',
    eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
    arrowLeft: 'M19 12H5m7-7-7 7 7 7',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4',
    logout: 'M10 17l5-5-5-5m5 5H3m10-9h6v18h-6',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    eyeOff:
      'M17.9 17.9A10 10 0 0 1 12 20c-6.5 0-10-8-10-8a17.7 17.7 0 0 1 4.1-5.9M9.9 4.2A9 9 0 0 1 12 4c6.5 0 10 8 10 8a17.7 17.7 0 0 1-2.1 3.1M3 3l18 18',
  }

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  )
}

function Header({ onBack, onProfile, title = 'Cafeteria' }) {
  return (
    <header className="topbar">
      {onBack && (
        <button className="icon-button" onClick={onBack} aria-label="Go back" type="button">
          <Icon name="arrowLeft" />
        </button>
      )}
      <div className="brand">
        <span className="brand-mark">
          <Icon name="utensils" />
        </span>
        <span>{title}</span>
      </div>
      <button className="avatar" onClick={onProfile} aria-label="Open profile">
        <img src={assets.profile} alt="" />
      </button>
    </header>
  )
}

function BottomNav({ view, setView }) {
  const items = [
    ['home', 'Home'],
    ['orders', 'Orders'],
    ['profile', 'Profile'],
  ]

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(([id, label]) => (
        <button
          className={view === id ? 'nav-item active' : 'nav-item'}
          key={id}
          onClick={() => setView(id)}
          type="button"
        >
          <Icon name={id === 'orders' ? 'orders' : id} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

function FoodCard({ currentQuantity = 0, item, onAdd, onSelect }) {
  const isOutOfStock = isItemOutOfStock(item, currentQuantity)

  return (
    <article className="special-card" onClick={onSelect}>
      <div className="food-image large">
        <img src={item.image} alt="" />
        <span className="badge">{item.badge}</span>
        {currentQuantity > 0 && (
          <span className="cart-quantity-badge">{currentQuantity} in cart</span>
        )}
      </div>
      <div className="special-body">
        <div className="line">
          <h3>{item.name}</h3>
          <strong>{money(item.price)}</strong>
        </div>
        <p>{item.description}</p>
        <p className={isOutOfStock ? 'stock-text empty' : 'stock-text'}>
          {getStockLabel(item, false, currentQuantity)}
        </p>
        <button
          className="primary small"
          disabled={isOutOfStock}
          onClick={(event) => {
            event.stopPropagation()
            onAdd()
          }}
          type="button"
        >
          <Icon name="plus" />
          Add to Order
        </button>
      </div>
    </article>
  )
}

function HomeScreen({
  cartCount,
  category,
  getCartQuantity,
  menu,
  onAdd,
  onCategoryChange,
  onSearchChange,
  onSelect,
  search,
  setView,
}) {
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks']

  return (
    <>
      <Header onProfile={() => setView('profile')} />
      <main className="screen home-screen">
        <div className="hero-banner">
          <img src={assets.hero} alt="Fresh cafe menu" />
          <div className="hero-overlay">
            <p>Today's Menu</p>
            <h2>Fresh &amp; Made to Order</h2>
          </div>
        </div>
        <label className="search">
          <Icon name="search" />
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search for delicious food..."
            value={search}
          />
        </label>

        <div className="chips" aria-label="Menu categories">
          {categories.map((item) => (
            <button
              className={category === item ? 'chip active' : 'chip'}
              key={item}
              onClick={() => onCategoryChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <section className="section-block">
          <div className="section-title">
            <h2>Today's Specials</h2>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('All')
                onSearchChange('')
              }}
            >
              See all
            </button>
          </div>
          <div className="specials-row">
            {menu.specials.map((item) => (
              <FoodCard
                currentQuantity={getCartQuantity(item.id)}
                item={item}
                key={item.id}
                onAdd={() => onAdd(item.id)}
                onSelect={() => onSelect(item.id)}
              />
            ))}
          </div>
        </section>

        <section className="section-block">
          <h2>Popular Items</h2>
          <div className="popular-list">
            {menu.popular.map((item) => (
              <article
                className="popular-item"
                key={item.id}
                onClick={() => onSelect(item.id)}
              >
                <img src={item.image} alt="" />
                <div>
                  <div className="line">
                    <h3>{item.name}</h3>
                    <strong>{money(item.price)}</strong>
                  </div>
                  <p>
                    <span>Star {item.rating}</span>
                    <span>{item.calories} kcal</span>
                    <span
                      className={
                        isItemOutOfStock(item, getCartQuantity(item.id))
                          ? 'stock-text empty'
                          : 'stock-text'
                      }
                    >
                      {getStockLabel(item, true, getCartQuantity(item.id))}
                    </span>
                    {getCartQuantity(item.id) > 0 && (
                      <span className="cart-line-qty">
                        {getCartQuantity(item.id)} in cart
                      </span>
                    )}
                  </p>
                </div>
                <button
                  className="round"
                  disabled={isItemOutOfStock(item, getCartQuantity(item.id))}
                  onClick={(event) => {
                    event.stopPropagation()
                    onAdd(item.id)
                  }}
                  aria-label={`Add ${item.name}`}
                  type="button"
                >
                  <Icon name="plus" />
                </button>
              </article>
            ))}
            {!menu.popular.length && !menu.specials.length && (
              <p className="empty-state">No menu items found.</p>
            )}
          </div>
        </section>
      </main>
      <button className="fab" onClick={() => setView('cart')} aria-label="Open cart">
        <Icon name="cart" />
        {cartCount > 0 && <span>{cartCount}</span>}
      </button>
    </>
  )
}

function ItemDetailScreen({ currentQuantity = 0, item, onAdd, onBack, setView }) {
  const [quantity, setQuantity] = useState(1)
  const [spice, setSpice] = useState('Regular')

  if (!item) {
    return (
      <>
        <Header onBack={onBack} onProfile={() => setView('profile')} />
        <main className="screen status-screen">
          <section className="status-card">
            <h1>Item not found</h1>
            <button className="primary" onClick={onBack} type="button">
              Back to Menu
            </button>
          </section>
        </main>
      </>
    )
  }

  const stockLeft = getStockLeft(item, currentQuantity)
  const isOutOfStock = isItemOutOfStock(item, currentQuantity)
  const maxSelectable = Math.max(1, stockLeft ?? 99)

  return (
    <>
      <Header onBack={onBack} onProfile={() => setView('profile')} />
      <main className="screen detail-screen">
        <div className="detail-hero">
          <img src={item.image} alt="" />
          {item.badge && <span className="badge">{item.badge}</span>}
        </div>
        <section className="detail-panel">
          <div className="line">
            <div>
              <h1>{item.name}</h1>
              <p>{item.description}</p>
              {currentQuantity > 0 && (
                <p className="detail-cart-count">{currentQuantity} currently in cart</p>
              )}
              <p className={isOutOfStock ? 'stock-text empty' : 'stock-text'}>
                {getStockLabel(item, false, currentQuantity)}
              </p>
            </div>
            <strong>{money(item.price)}</strong>
          </div>

          <div className="nutrition-row">
            <span>{item.nutrition?.calories || item.calories || 520} kcal</span>
            <span>{item.nutrition?.protein || '18g'} protein</span>
            <span>{item.nutrition?.prep || '10 min'}</span>
          </div>

          <div className="option-group">
            <h2>Ingredients</h2>
            <div className="ingredient-list">
              {(item.ingredients || ['Fresh produce', 'House seasoning']).map((ingredient) => (
                <span key={ingredient}>{ingredient}</span>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h2>Spice Level</h2>
            <div className="segmented">
              {['Mild', 'Regular', 'Spicy'].map((option) => (
                <button
                  className={spice === option ? 'active' : ''}
                  key={option}
                  onClick={() => setSpice(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <div className="quantity">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                type="button"
              >
                <Icon name="minus" />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                disabled={quantity >= maxSelectable || isOutOfStock}
                onClick={() => setQuantity((value) => Math.min(maxSelectable, value + 1))}
                type="button"
              >
                <Icon name="plus" />
              </button>
            </div>
            <button
              className="primary"
              disabled={isOutOfStock}
              onClick={() => onAdd(item.id, quantity, { openCart: true })}
              type="button"
            >
              Add {money(item.price * quantity)}
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

function AuthField({
  autoComplete,
  icon,
  label,
  minLength,
  name,
  placeholder,
  required = false,
  type = 'text',
}) {
  const [visible, setVisible] = useState(false)
  const inputType = type === 'password' ? (visible ? 'text' : 'password') : type

  return (
    <label className="auth-field">
      <span>
        <Icon name={icon} />
        {label}
      </span>
      <div>
        <Icon name={icon} />
        <input
          autoComplete={autoComplete}
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required={required}
          type={inputType}
        />
        {type === 'password' && (
          <button
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((v) => !v)}
            type="button"
          >
            <Icon name={visible ? 'eyeOff' : 'eye'} />
          </button>
        )}
      </div>
    </label>
  )
}

function AuthBrand({ compact = false }) {
  return (
    <div className={compact ? 'auth-brand compact' : 'auth-brand'}>
      <span className="auth-logo">
        <Icon name="utensils" />
      </span>
      <h1>Cafeteria</h1>
      {!compact && <p>Welcome back! Please enter your details.</p>}
    </div>
  )
}

function SocialButtons() {
  return (
    <div className="social-grid">
      <button type="button">
        <img src={assets.google} alt="" />
        Google
      </button>
      <button type="button">
        <img src={assets.apple} alt="" />
        Apple
      </button>
    </div>
  )
}

function AuthMessage({ message }) {
  if (!message) return null

  return (
    <div className="auth-message" role="status" aria-live="polite">
      <strong>Unable to sign in</strong>
      <span>{message}</span>
    </div>
  )
}

function LoginScreen({ authError, onLogin, setView }) {
  return (
    <main className="auth-screen login-screen">
      <div className="auth-gradient" />
      <form
        className="auth-stack"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          onLogin({
            email: form.get('email'),
            password: form.get('password'),
          })
        }}
      >
        <AuthBrand />
        <section className="auth-card">
          <AuthField
            autoComplete="email"
            icon="mail"
            label="Email Address"
            name="email"
            placeholder="name@company.com"
            required
            type="email"
          />
          <AuthField
            autoComplete="current-password"
            icon="lock"
            label="Password"
            minLength={6}
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <button type="button">Forgot Password?</button>
          </div>
          <button className="auth-submit" type="submit">
            Sign In
            <span aria-hidden="true">-&gt;</span>
          </button>
        </section>
        <AuthMessage message={authError} />
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>
        <SocialButtons />
        <p className="auth-footer">
          Don't have an account?
          <button onClick={() => setView('signup')} type="button">
            Create an account
          </button>
        </p>
      </form>
    </main>
  )
}

function SignupScreen({ authError, onSignup, setView }) {
  return (
    <main className="auth-screen signup-screen">
      <form
        className="auth-stack"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          onSignup({
            name: form.get('name'),
            email: form.get('email'),
            password: form.get('password'),
          })
        }}
      >
        <AuthBrand compact />
        <section className="auth-card signup-card">
          <header>
            <h1>Create Account</h1>
            <p>Join our community and skip the lunch rush.</p>
          </header>
          <AuthField
            autoComplete="name"
            icon="user"
            label="Full Name"
            name="name"
            placeholder="John Doe"
            required
          />
          <AuthField
            autoComplete="email"
            icon="mail"
            label="Email Address"
            name="email"
            placeholder="name@company.com"
            required
            type="email"
          />
          <AuthField
            autoComplete="new-password"
            icon="lock"
            label="Password"
            minLength={6}
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
          <label className="terms">
            <input type="checkbox" />
            <span>
              I agree to the <strong>Terms of Service</strong> and{' '}
              <strong>Privacy Policy</strong>.
            </span>
          </label>
          <button className="auth-submit" type="submit">
            Create Account
          </button>
          <div className="auth-divider join">
            <span>OR JOIN WITH</span>
          </div>
          <SocialButtons />
        </section>
        <AuthMessage message={authError} />
        <p className="auth-footer larger">
          Already have an account?
          <button onClick={() => setView('login')} type="button">
            Log In
          </button>
        </p>
      </form>
    </main>
  )
}

function CartScreen({ cart, onPlaceOrder, onRemoveItem, onUpdateQuantity, setView }) {
  const [paymentMethod, setPaymentMethod] = useState('Campus Card')
  const [pickupTime, setPickupTime] = useState(cart.pickupTime)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const VALID_CODES = { SAVE10: 0.1 }
  const discountRate = promoApplied ? (VALID_CODES[promoCode.toUpperCase()] ?? 0) : 0
  const discount = Number((cart.subtotal * discountRate).toFixed(2))
  const finalTotal = Number((cart.total - discount).toFixed(2))

  return (
    <>
      <Header onBack={() => setView('home')} onProfile={() => setView('profile')} />
      <main className="screen cart-screen">
        <div className="steps" aria-label="Checkout progress">
          {[
            ['cart', 'Cart', true],
            ['card', 'Payment', false],
            ['check', 'Confirm', false],
          ].map(([icon, label, active], index) => (
            <div className={active ? 'step active' : 'step'} key={label}>
              {index > 0 && <span className="step-line" />}
              <span className="step-dot">
                <Icon name={icon} />
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <section className="cart-items">
          {cart.items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="food-image square">
                <img src={item.image} alt="" />
                {item.badge && <span className="mini-badge">{item.badge}</span>}
              </div>
              <div className="cart-copy">
                <div className="line">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p
                      className={
                        isItemOutOfStock(item, item.quantity)
                          ? 'stock-text empty'
                          : 'stock-text'
                      }
                    >
                      {isItemOutOfStock(item, item.quantity)
                        ? 'No more stock available'
                        : getStockLabel(item, false, item.quantity)}
                    </p>
                  </div>
                  <strong>{money(item.price)}</strong>
                </div>
                <div className="cart-actions">
                  <div className="quantity">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      type="button"
                    >
                      <Icon name="minus" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      disabled={isItemOutOfStock(item, item.quantity)}
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      type="button"
                    >
                      <Icon name="plus" />
                    </button>
                  </div>
                  <button
                    className="trash"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    type="button"
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!cart.items.length && (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add something from the menu to start an order.</p>
            </div>
          )}
        </section>

        <section className="summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(cart.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Service Tax (5%)</span>
            <span>{money(cart.tax)}</span>
          </div>
          <div className="summary-row convenience-row">
            <span>Convenience Fee</span>
            <span>{money(cart.convenienceFee)}</span>
          </div>
          <div className="promo">
            <Icon name="tag" />
            <input
              onChange={(event) => {
                setPromoCode(event.target.value)
                setPromoApplied(false)
                setPromoError('')
              }}
              placeholder="Try SAVE10"
              value={promoCode}
            />
            <button
              onClick={() => {
                if (!promoCode.trim()) return
                if (VALID_CODES[promoCode.toUpperCase()]) {
                  setPromoApplied(true)
                  setPromoError('')
                } else {
                  setPromoApplied(false)
                  setPromoError('Invalid code')
                }
              }}
              type="button"
            >
              {promoApplied ? 'Applied ✓' : 'Apply'}
            </button>
          </div>
          {promoError && <p className="promo-error">{promoError}</p>}
          {promoApplied && discount > 0 && (
            <div className="summary-row discount-row">
              <span>Discount (10%)</span>
              <span>-{money(discount)}</span>
            </div>
          )}
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{money(finalTotal)}</strong>
          </div>
        </section>

        <section className="checkout-options">
          <h2>Payment</h2>
          <div className="segmented">
            {['Campus Card', 'Apple Pay', 'Cash'].map((method) => (
              <button
                className={paymentMethod === method ? 'active' : ''}
                key={method}
                onClick={() => setPaymentMethod(method)}
                type="button"
              >
                {method}
              </button>
            ))}
          </div>
          <h2>Pickup Time</h2>
          <div className="segmented">
            {['12:45 PM (15 mins)', '1:00 PM', '1:15 PM'].map((time) => (
              <button
                className={pickupTime === time ? 'active' : ''}
                key={time}
                onClick={() => setPickupTime(time)}
                type="button"
              >
                {time}
              </button>
            ))}
          </div>
        </section>
      </main>

      <aside className="checkout-bar">
        <div>
          <span>Estimated Pickup</span>
          <strong>{pickupTime}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{money(finalTotal)}</strong>
        </div>
        <button
          className="primary"
          disabled={!cart.items.length}
          onClick={() => onPlaceOrder({ paymentMethod, pickupTime, promoCode })}
          type="button"
        >
          Place Order · {money(finalTotal)}
          <span aria-hidden="true">-&gt;</span>
        </button>
      </aside>
    </>
  )
}

function OrdersScreen({ onReorder, orders, setSelectedOrder, setView }) {
  return (
    <>
      <Header />
      <main className="screen orders-screen">
        <h1>Order History</h1>
        {!orders.length && (
          <div className="empty-state">
            <p>No orders yet. Start ordering!</p>
            <button className="primary small" onClick={() => setView('home')} type="button">
              Browse Menu
            </button>
          </div>
        )}
        {orders.map((order) => (
          <article className="history-card" key={order.id}>
            <div>
              <span>{order.day}</span>
              <h2>#{order.id}</h2>
              <p>{order.items.map((item) => item.name).join(', ')}</p>
            </div>
            <div className="history-actions">
              <strong>{money(order.total)}</strong>
              <button
                onClick={() => {
                  setSelectedOrder(order)
                  setView('status')
                }}
                type="button"
              >
                {order.status}
              </button>
              <button
                className="reorder-btn"
                onClick={() => onReorder(order.id)}
                type="button"
              >
                Reorder
              </button>
            </div>
          </article>
        ))}
      </main>
    </>
  )
}

function ProfileScreen({ onLogout, onSaveProfile, user }) {
  const [name, setName] = useState(user.name)
  const [preferences, setPreferences] = useState(user.preferences || [])
  const [draftPreference, setDraftPreference] = useState('')

  return (
    <>
      <Header />
      <main className="screen profile-screen">
        <section className="profile-card">
          <img src={user.avatar || assets.profile} alt="" />
          <h1>{user.name}</h1>
          <p>Student ID {user.studentId}</p>
        </section>

        <section className="profile-editor">
          <label>
            Display Name
            <input onChange={(event) => setName(event.target.value)} value={name} />
          </label>
          <label>
            Add Dietary Preference
            <span className="inline-control">
              <input
                onChange={(event) => setDraftPreference(event.target.value)}
                placeholder="No peanuts"
                value={draftPreference}
              />
              <button
                onClick={() => {
                  if (draftPreference.trim()) {
                    setPreferences((items) => [...items, draftPreference.trim()])
                    setDraftPreference('')
                  }
                }}
                type="button"
              >
                Add
              </button>
            </span>
          </label>
          <div className="ingredient-list">
            {preferences.map((preference) => (
              <span className="preference-chip" key={preference}>
                {preference}
                <button
                  aria-label={`Remove ${preference}`}
                  onClick={() =>
                    setPreferences((items) =>
                      items.filter((item) => item !== preference),
                    )
                  }
                  type="button"
                >
                  <Icon name="plus" />
                </button>
              </span>
            ))}
          </div>
          <button
            className="primary small"
            onClick={() => onSaveProfile({ name, preferences })}
            type="button"
          >
            <Icon name="edit" />
            Save Profile
          </button>
        </section>

        <button className="settings-row" onClick={onLogout} type="button">
          <span>Log out</span>
          <Icon name="logout" />
        </button>
      </main>
    </>
  )
}

function StatusScreen({ order, setView }) {
  return (
    <>
      <Header onBack={() => setView('orders')} />
      <main className="screen status-screen">
        <section className="status-card">
          <span className="status-icon">
            <Icon name="check" />
          </span>
          <h1>Order Confirmed</h1>
          <p>Your cafeteria order is being prepared.</p>
          <div className="pickup">
            <span>Pickup Code</span>
            <strong>{order?.code || 'CAF-1048'}</strong>
          </div>
          <div className="status-timeline">
            {(order?.statusSteps || ['Order placed', 'Preparing', 'Ready for pickup']).map(
              (step, index) => (
                <div className={index < 2 ? 'done' : ''} key={step}>
                  <span />
                  <p>{step}</p>
                </div>
              ),
            )}
          </div>
          <button className="secondary" onClick={() => setView('receipt')} type="button">
            <Icon name="receipt" />
            View Receipt
          </button>
          <button className="primary" onClick={() => setView('home')} type="button">
            Back to Menu
          </button>
        </section>
      </main>
    </>
  )
}

function ReceiptScreen({ order, setView }) {
  const receiptOrder = order || {
    code: 'CAF-1048',
    pickupTime: '12:45 PM (15 mins)',
    paymentMethod: 'Campus Card',
    total: 36.2,
    items: cartItems,
  }

  return (
    <>
      <Header onBack={() => setView('status')} title="Receipt" />
      <main className="screen receipt-screen">
        <section className="receipt-card">
          <span className="status-icon">
            <Icon name="receipt" />
          </span>
          <h1>{receiptOrder.code}</h1>
          <p>Pickup {receiptOrder.pickupTime}</p>
          <div className="receipt-list">
            {receiptOrder.items.map((item) => (
              <div className="summary-row" key={item.id || item.name}>
                <span>
                  {item.quantity} x {item.name}
                </span>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="receipt-total">
            <span>{receiptOrder.paymentMethod}</span>
            <strong>{money(receiptOrder.total)}</strong>
          </div>
          <button className="primary" onClick={() => setView('home')} type="button">
            Done
          </button>
        </section>
      </main>
    </>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [view, setView] = useState('login')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [menu, setMenu] = useState({ specials, popular: popularItems })
  const [cart, setCart] = useState({
    items: cartItems,
    subtotal: 34,
    tax: 1.7,
    convenienceFee: 0.5,
    total: 36.2,
    pickupTime: '12:45 PM (15 mins)',
  })
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [user, setUser] = useState({
    name: 'Jarrar Haider',
    studentId: '2214',
    avatar: assets.profile,
  })
  const [error, setError] = useState('')
  const [authError, setAuthError] = useState('')
  const [toast, setToast] = useState('')
  const showNav = ['home', 'orders', 'profile'].includes(view)
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const cartQuantities = cart.items.reduce((quantities, item) => {
    quantities[item.id] = item.quantity
    return quantities
  }, {})
  const getCartQuantity = (itemId) => cartQuantities[itemId] || 0

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(''), 1800)
  }

  useEffect(() => {
    if (!authError) return undefined

    const timer = setTimeout(() => setAuthError(''), 4500)
    return () => clearTimeout(timer)
  }, [authError])

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let cancelled = false

    async function loadAppData() {
      try {
        const [nextMenu, nextCart, nextOrders, nextUser] = await Promise.all([
          api.getMenu({ category, search }),
          api.getCart(),
          api.getOrders(),
          api.getProfile(),
        ])

        if (!cancelled) {
          setMenu(nextMenu)
          setCart(nextCart)
          setOrders(nextOrders)
          setSelectedOrder(nextOrders[0] || null)
          setUser(nextUser)
          setError('')
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false)
          setView('login')
          setAuthError('Your session ended. Please sign in again.')
        }
      }
    }

    loadAppData()

    return () => {
      cancelled = true
    }
  }, [category, isAuthenticated, search])

  async function handleLogin(credentials) {
    try {
      const result = await api.login(credentials)
      setIsAuthenticated(true)
      setUser(result.user)
      setError('')
      setAuthError('')
      setView('home')
      showToast(`Welcome back, ${result.user.name}`)
    } catch {
      setIsAuthenticated(false)
      setView('login')
      setAuthError('Check your email and password, then try again.')
    }
  }

  async function handleSignup(payload) {
    try {
      const result = await api.signup(payload)
      setIsAuthenticated(true)
      setUser(result.user)
      setError('')
      setAuthError('')
      setView('home')
      showToast('Account created successfully')
    } catch (signupError) {
      setIsAuthenticated(false)
      setView('signup')
      setAuthError(signupError.message)
    }
  }

  async function handleSelectItem(itemId) {
    const item = await api.getMenuItem(itemId)
    setSelectedItem(item)
    setView('detail')
  }

  async function handleAddToCart(itemId, quantity = 1, options = {}) {
    try {
      const nextCart = await api.addToCart(itemId, quantity)
      setCart(nextCart)
      setError('')

      if (options.openCart) {
        setView('cart')
      } else {
        showToast('Added to cart')
      }
    } catch (cartError) {
      setError(cartError.message)
    }
  }

  async function handleReorder(orderId) {
    try {
      const nextCart = await api.reorder(orderId)
      setCart(nextCart)
      setError('')
      setView('cart')
    } catch (reorderError) {
      setError(reorderError.message)
    }
  }

  async function handleUpdateQuantity(itemId, quantity) {
    try {
      const nextCart = await api.updateCartItem(itemId, quantity)
      setCart(nextCart)
      setError('')
    } catch (cartError) {
      setError(cartError.message)
    }
  }

  async function handleRemoveItem(itemId) {
    const nextCart = await api.removeCartItem(itemId)
    setCart(nextCart)
  }

  async function handlePlaceOrder(payload) {
    const result = await api.placeOrder(payload)
    const nextOrders = await api.getOrders()
    setCart(result.cart)
    setOrders(nextOrders)
    setSelectedOrder(result.order)
    setView('status')
  }

  async function handleSaveProfile(payload) {
    const nextUser = await api.updateProfile(payload)
    setUser(nextUser)
    showToast('Profile saved')
  }

  async function handleLogout() {
    await api.logout().catch(() => {})
    setIsAuthenticated(false)
    setView('login')
    setSelectedOrder(null)
    setSelectedItem(null)
  }

  let activeScreen = (
    <HomeScreen
      cartCount={cartCount}
      category={category}
      getCartQuantity={getCartQuantity}
      menu={menu}
      onAdd={handleAddToCart}
      onCategoryChange={setCategory}
      onSearchChange={setSearch}
      onSelect={handleSelectItem}
      search={search}
      setView={setView}
    />
  )

  if (view === 'login') {
    activeScreen = (
      <LoginScreen authError={authError} onLogin={handleLogin} setView={setView} />
    )
  } else if (view === 'signup') {
    activeScreen = (
      <SignupScreen
        authError={authError}
        onSignup={handleSignup}
        setView={setView}
      />
    )
  } else if (view === 'cart') {
    activeScreen = (
      <CartScreen
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        setView={setView}
      />
    )
  } else if (view === 'orders') {
    activeScreen = (
      <OrdersScreen
        onReorder={handleReorder}
        orders={orders}
        setSelectedOrder={setSelectedOrder}
        setView={setView}
      />
    )
  } else if (view === 'detail') {
    activeScreen = (
      <ItemDetailScreen
        currentQuantity={getCartQuantity(selectedItem?.id)}
        item={selectedItem}
        onAdd={handleAddToCart}
        onBack={() => setView('home')}
        setView={setView}
      />
    )
  } else if (view === 'profile') {
    activeScreen = (
      <ProfileScreen
        onLogout={handleLogout}
        onSaveProfile={handleSaveProfile}
        user={user}
      />
    )
  } else if (view === 'status') {
    activeScreen = <StatusScreen order={selectedOrder} setView={setView} />
  } else if (view === 'receipt') {
    activeScreen = <ReceiptScreen order={selectedOrder} setView={setView} />
  }

  return (
    <div className="app-shell">
      {activeScreen}
      {error && <p className="api-error">{error}</p>}
      {toast && <div className="toast">{toast}</div>}
      {showNav && <BottomNav view={view} setView={setView} />}
    </div>
  )
}

export default App
