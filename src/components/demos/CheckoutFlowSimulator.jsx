import { motion } from 'framer-motion'
import { RefreshCcw, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import DemoNotice from '../ui/DemoNotice'

const products = [
  { id: 'portfolio-review', name: 'Portfolio Review', price: 49, description: 'A fake service item used to practice checkout UX.' },
  { id: 'landing-page-audit', name: 'Landing Page Audit', price: 79, description: 'Demo product for order summary and validation.' },
  { id: 'frontend-component-pack', name: 'Frontend Component Pack', price: 129, description: 'Demo product for multi-item cart state.' },
]

const demoCards = {
  '4242424242424242': 'success',
  '4000000000000002': 'declined',
  '4000000000009995': 'pending',
}

const steps = ['Cart', 'Customer details', 'Payment simulation', 'Result']

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
})

function CheckoutFlowSimulator() {
  const [step, setStep] = useState(0)
  const [cart, setCart] = useState({ 'portfolio-review': 1 })
  const [customer, setCustomer] = useState({ name: '', email: '', company: '', country: '' })
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvc: '', cardholder: '' })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [events, setEvents] = useState([])

  const items = useMemo(
    () =>
      products
        .map((product) => ({ ...product, quantity: cart[product.id] || 0 }))
        .filter((item) => item.quantity > 0),
    [cart],
  )

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addEvent(message) {
    setEvents((current) => [
      { id: `${Date.now()}-${message}`, message },
      ...current,
    ].slice(0, 8))
  }

  function updateQuantity(productId, delta) {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[productId] || 0) + delta)
      const next = { ...current, [productId]: nextQuantity }
      if (nextQuantity === 0) delete next[productId]
      return next
    })
    addEvent('Cart updated')
  }

  function validateCustomer() {
    const nextErrors = {}
    if (!customer.name.trim()) nextErrors.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) nextErrors.email = 'A valid email is required.'
    if (!customer.country.trim()) nextErrors.country = 'Country is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validatePayment() {
    const nextErrors = {}
    const card = payment.cardNumber.replace(/\s+/g, '')
    if (!payment.cardholder.trim()) nextErrors.cardholder = 'Cardholder name is required.'
    if (!/^\d{16}$/.test(card)) nextErrors.cardNumber = 'Use one of the 16-digit demo cards.'
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) nextErrors.expiry = 'Use MM/YY format.'
    if (!/^\d{3,4}$/.test(payment.cvc)) nextErrors.cvc = 'CVC is required.'
    if (/^\d{16}$/.test(card) && !demoCards[card]) nextErrors.cardNumber = 'Use one of the demo cards.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function nextStep() {
    if (step === 0 && items.length === 0) return
    if (step === 1 && !validateCustomer()) return
    if (step === 1) addEvent('Customer validated')
    setStep((current) => Math.min(current + 1, 3))
  }

  async function processPayment() {
    if (!validatePayment()) return
    setIsProcessing(true)
    addEvent('Payment processing')

    await new Promise((resolve) => {
      window.setTimeout(resolve, 800)
    })

    const status = demoCards[payment.cardNumber.replace(/\s+/g, '')]
    const nextResult = {
      status,
      orderId: `demo_order_${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
      email: customer.email,
    }
    setResult(nextResult)
    setIsProcessing(false)
    setStep(3)
    addEvent(`Payment ${status}`)
  }

  function resetCheckout() {
    setStep(0)
    setCart({ 'portfolio-review': 1 })
    setCustomer({ name: '', email: '', company: '', country: '' })
    setPayment({ cardNumber: '', expiry: '', cvc: '', cardholder: '' })
    setErrors({})
    setResult(null)
    setEvents([])
  }

  return (
    <motion.section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
          Fake checkout demo
        </p>
        <h3 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
          Checkout Flow Simulator
        </h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          A fake checkout flow that simulates cart state, form validation, payment states and receipt UI without processing real payments.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:p-8">
        <DemoNotice>
          Do not enter real payment information. This demo does not process payments, store cards or send card data anywhere.
        </DemoNotice>

        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <span
              key={label}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${step === index ? 'border-blue-600 bg-blue-600 text-white dark:border-sky-500 dark:bg-sky-500 dark:text-slate-950' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}
            >
              {index + 1}. {label}
            </span>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            {step === 0 && (
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Cart</h4>
                <div className="mt-4 grid gap-3">
                  {products.map((product) => (
                    <div key={product.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{product.name}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
                          <p className="mt-2 font-bold text-slate-950 dark:text-white">{currencyFormatter.format(product.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateQuantity(product.id, -1)} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700">-</button>
                          <span className="w-8 text-center font-semibold text-slate-950 dark:text-white">{cart[product.id] || 0}</span>
                          <button type="button" onClick={() => updateQuantity(product.id, 1)} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {items.length === 0 && (
                  <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    Empty cart. Add at least one demo item to continue.
                  </p>
                )}
                <button disabled={items.length === 0} onClick={nextStep} className="mt-5 min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950">Continue</button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Customer details</h4>
                <div className="mt-4 grid gap-4">
                  {[
                    ['name', 'Name'],
                    ['email', 'Email'],
                    ['company', 'Company optional'],
                    ['country', 'Country'],
                  ].map(([field, label]) => (
                    <label key={field} className="block">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                      <input
                        value={customer[field]}
                        onChange={(event) => setCustomer((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                      {errors[field] && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors[field]}</p>}
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => setStep(0)} className="min-h-11 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">Back</button>
                  <button onClick={nextStep} className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white dark:bg-sky-500 dark:text-slate-950">Next</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Payment simulation</h4>
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  <ShieldAlert size={16} className="mr-1 inline" />
                  Use demo cards only: 4242 4242 4242 4242, 4000 0000 0000 0002, 4000 0000 0000 9995.
                </div>
                <div className="mt-4 grid gap-4">
                  {[
                    ['cardholder', 'Cardholder name'],
                    ['cardNumber', 'Card number'],
                    ['expiry', 'Expiry MM/YY'],
                    ['cvc', 'CVC'],
                  ].map(([field, label]) => (
                    <label key={field} className="block">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                      <input
                        value={payment[field]}
                        onChange={(event) => setPayment((current) => ({ ...current, [field]: event.target.value }))}
                        className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                      {errors[field] && <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errors[field]}</p>}
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => setStep(1)} className="min-h-11 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">Back</button>
                  <button onClick={processPayment} disabled={isProcessing} className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950">
                    {isProcessing ? 'Processing...' : 'Run payment simulation'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Result</h4>
                {result ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <p className={`text-lg font-bold ${result.status === 'success' ? 'text-emerald-700 dark:text-emerald-300' : result.status === 'declined' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>
                      {result.status === 'success' ? 'Payment success' : result.status === 'declined' ? 'Payment declined' : 'Payment pending'}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {result.status === 'success'
                        ? 'Fake receipt generated. No real payment happened.'
                        : result.status === 'declined'
                          ? 'The demo card was declined. You can go back and try another demo card.'
                          : 'The demo payment is pending. Real apps would wait for provider confirmation.'}
                    </p>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <p>Order ID: {result.orderId}</p>
                      <p>Email: {result.email}</p>
                      <p>Total: {currencyFormatter.format(result.total)}</p>
                      <p>Status: {result.status === 'success' ? 'paid' : result.status}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No result yet.</p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => setStep(2)} className="min-h-11 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">Back to payment</button>
                  <button onClick={resetCheckout} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white dark:bg-sky-500 dark:text-slate-950">
                    <RefreshCcw size={16} /> Reset checkout
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="grid gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-bold text-slate-950 dark:text-white">Order summary</h4>
              <div className="mt-4 grid gap-3">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">No items selected.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{item.name} x{item.quantity}</span>
                      <span className="font-semibold text-slate-950 dark:text-white">{currencyFormatter.format(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex justify-between text-lg font-bold text-slate-950 dark:text-white">
                  <span>Total</span>
                  <span>{currencyFormatter.format(total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-slate-950 dark:text-white">Event log</h4>
                <button onClick={() => setEvents([])} className="text-xs font-semibold text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">Clear</button>
              </div>
              <div className="mt-4 grid gap-2">
                {events.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">No checkout events yet.</p>
                ) : (
                  events.map((event) => (
                    <p key={event.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">{event.message}</p>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.section>
  )
}

export default CheckoutFlowSimulator
