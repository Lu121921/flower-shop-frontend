import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Minus, Layers, Sparkles, ShoppingBag, Heart, Calendar, MessageSquare, Gift, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { bouquetAPI } from '../services/api'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const FLOWER_TYPES = [
  { key: 'roses', label: 'Roses', description: 'Classic romantic bloom' },
  { key: 'peonies', label: 'Peonies', description: 'Lush and fragrant' },
  { key: 'lilies', label: 'Lilies', description: 'Elegant and timeless' },
  { key: 'wildflowers', label: 'Wild Bouquet', description: 'Boho meadow mix' },
  { key: 'sunflowers', label: 'Sunflowers', description: 'Bright and cheerful' },
  { key: 'orchids', label: 'Orchids', description: 'Exotic and refined' },
]

const VASES = [
  { id: 'none', name: 'No Vase', price: 0 },
  { id: 'glass_classic', name: 'Classic Clear Glass Vase', price: 18 },
  { id: 'ceramic_gold', name: 'Luxury Gold Trim Ceramic Vase', price: 28 },
  { id: 'rustic_pot', name: 'Rustic Terracotta Pot', price: 22 },
]

const EXTRA_GIFTS = [
  { id: 'chocolates', name: 'Artisan Chocolates (200g)', price: 15 },
  { id: 'teddy', name: 'Plush Teddy Bear (25cm)', price: 20 },
  { id: 'balloons', name: 'Celebration Balloon Trio', price: 12 },
  { id: 'candle', name: 'Scented Botanical Candle', price: 25 },
]

export default function BouquetBuilder() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [options, setOptions] = useState(null)
  const [size, setSize] = useState('medium')
  const [wrappingStyle, setWrappingStyle] = useState('classic')
  const [ribbonColor, setRibbonColor] = useState('pink')
  const [flowers, setFlowers] = useState(FLOWER_TYPES.map((flower) => ({ item: flower.key, quantity: 1 })))
  const [selectedVase, setSelectedVase] = useState('none')
  const [extraGifts, setExtraGifts] = useState([])
  const [greetingMessage, setGreetingMessage] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [previewPrice, setPreviewPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { data } = await bouquetAPI.getOptions()
        setOptions(data)
        setSize(data.sizes[1]?.size || 'medium')
        setWrappingStyle(data.wrapping_styles[0]?.style || 'classic')
      } catch {
        setOptions({
          sizes: [
            { size: 'small', base_price: 35 },
            { size: 'medium', base_price: 55 },
            { size: 'large', base_price: 80 },
            { size: 'extra_large', base_price: 120 },
          ],
          wrapping_styles: [
            { style: 'classic', extra_price: 0 },
            { style: 'luxury', extra_price: 15 },
            { style: 'rustic', extra_price: 8 },
            { style: 'modern', extra_price: 10 },
          ],
          flower_colors: ['red', 'pink', 'white', 'yellow', 'purple', 'gold'],
        })
      } finally {
        setLoading(false)
      }
    }
    loadOptions()
  }, [])

  // Calculate dynamic price
  useEffect(() => {
    const basePrices = { small: 35, medium: 55, large: 80, extra_large: 120 }
    const wrapPrices = { classic: 0, luxury: 15, rustic: 8, modern: 10 }
    
    const base = basePrices[size] || 55
    const wrap = wrapPrices[wrappingStyle] || 0
    const flowerTotal = flowers.reduce((sum, f) => sum + (f.quantity * 3.5), 0)
    const vaseObj = VASES.find(v => v.id === selectedVase)
    const vasePrice = vaseObj ? vaseObj.price : 0
    const giftsPrice = extraGifts.reduce((sum, giftId) => {
      const g = EXTRA_GIFTS.find(x => x.id === giftId)
      return sum + (g ? g.price : 0)
    }, 0)
    const cardPrice = greetingMessage.trim() ? 5 : 0

    const total = base + wrap + flowerTotal + vasePrice + giftsPrice + cardPrice
    setPreviewPrice(+total.toFixed(2))
  }, [size, wrappingStyle, flowers, selectedVase, extraGifts, greetingMessage])

  const updateFlowerQuantity = (key, delta) => {
    setFlowers((current) => current.map((flower) => flower.item === key ? { ...flower, quantity: Math.max(0, flower.quantity + delta) } : flower))
  }

  const toggleExtraGift = (giftId) => {
    setExtraGifts((prev) => prev.includes(giftId) ? prev.filter((id) => id !== giftId) : [...prev, giftId])
  }

  const handleAddToCart = () => {
    const totalStems = flowers.reduce((sum, f) => sum + f.quantity, 0)
    if (totalStems === 0) {
      toast.error('Please select at least one flower stem for your bouquet')
      return
    }

    const customBouquetProduct = {
      id: `custom-bouquet-${Date.now()}`,
      name: `Custom ${size.replace('_', ' ')} Bouquet`,
      price: previewPrice,
      image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80',
      customization_data: {
        size,
        wrappingStyle,
        ribbonColor,
        flowers: flowers.filter(f => f.quantity > 0),
        vase: VASES.find(v => v.id === selectedVase)?.name,
        extraGifts: extraGifts.map(gId => EXTRA_GIFTS.find(x => x.id === gId)?.name),
        greetingMessage,
        deliveryDate,
      }
    }

    addToCart(customBouquetProduct, 1)
    toast.success('Custom bouquet added to cart! 🌸')
    navigate('/cart')
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save bouquets to your profile')
      return
    }
    setSaving(true)
    try {
      const bouquet = {
        size,
        wrapping_style: wrappingStyle,
        ribbon_color: ribbonColor,
        flowers: flowers.filter((flower) => flower.quantity > 0),
        add_ons: extraGifts.map(g => ({ item: g })),
        name: `Custom ${size} bouquet`,
        total_price: previewPrice,
        is_saved: true,
      }
      await bouquetAPI.create(bouquet)
      toast.success('Bouquet saved to your profile!')
    } catch {
      toast.error('Could not save bouquet')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading fullScreen text="Preparing bouquet builder…" />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-brand-green-pale to-brand-orange-pale py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeader
            title="Build your own bouquet"
            subtitle="Create a custom floral arrangement with the blooms, wrapping, vase and personal card you love."
            center
          />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Choose your size, stem mix, wrapping style, vase and gift items, then add directly to your cart.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24 lg:pb-12">
        <Breadcrumb items={[{ label: 'Bouquet Builder' }]} />

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 mt-8">
          <div className="bg-white rounded-3xl shadow-soft p-4 sm:p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Bouquet Size & Wrapping</h2>
              <p className="text-sm text-gray-500 mb-4">Select the scale and wrapping aesthetic for your bouquet.</p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-gray-200 p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Bouquet Size</h3>
                  <div className="space-y-2.5">
                    {options?.sizes?.map((option) => (
                      <button
                        key={option.size}
                        type="button"
                        onClick={() => setSize(option.size)}
                        className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold transition ${size === option.size ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="capitalize">{option.size.replace('_', ' ')}</span>
                          <span>{formatPrice(option.base_price * 100)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Wrapping Style</h3>
                  <div className="space-y-2.5">
                    {options?.wrapping_styles?.map((style) => (
                      <button
                        key={style.style}
                        type="button"
                        onClick={() => setWrappingStyle(style.style)}
                        className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold transition ${wrappingStyle === style.style ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="capitalize">{style.style.replace('_', ' ')}</span>
                          <span>{style.extra_price > 0 ? `+${formatPrice(style.extra_price * 100)}` : 'Free'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Flower & Stem Selection</h2>
              <p className="text-sm text-gray-500 mb-4">Add your favourite flower stems ($3.50 / stem).</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FLOWER_TYPES.map((flower) => {
                  const current = flowers.find((item) => item.item === flower.key)
                  return (
                    <div key={flower.key} className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{flower.label}</p>
                        <p className="text-xs text-gray-500">{flower.description}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1">
                        <button type="button" onClick={() => updateFlowerQuantity(flower.key, -1)} className="w-7 h-7 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center"><Minus size={13} /></button>
                        <span className="w-6 text-center text-sm font-bold">{current?.quantity || 0}</span>
                        <button type="button" onClick={() => updateFlowerQuantity(flower.key, 1)} className="w-7 h-7 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center"><Plus size={13} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Ribbon Color & Vase</h2>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div className="rounded-3xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Ribbon Color</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['pink', 'red', 'white', 'gold', 'lavender', 'green'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setRibbonColor(color)}
                        className={`h-11 rounded-2xl border flex items-center justify-center capitalize text-xs font-bold transition ${ribbonColor === color ? 'border-brand-orange bg-brand-orange-pale text-brand-orange' : 'border-gray-200 bg-white text-gray-700'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Add a Vase</h3>
                  <div className="space-y-2">
                    {VASES.map((vase) => (
                      <button
                        key={vase.id}
                        type="button"
                        onClick={() => setSelectedVase(vase.id)}
                        className={`w-full text-left rounded-2xl px-3 py-2.5 text-xs font-semibold transition ${selectedVase === vase.id ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{vase.name}</span>
                          <span>{vase.price > 0 ? `+$${vase.price}` : 'None'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Extra Gift Add-Ons</h2>
              <div className="grid gap-3 sm:grid-cols-2 mt-3">
                {EXTRA_GIFTS.map((gift) => {
                  const active = extraGifts.includes(gift.id)
                  return (
                    <button
                      key={gift.id}
                      type="button"
                      onClick={() => toggleExtraGift(gift.id)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition ${active ? 'border-brand-orange bg-brand-orange-pale text-brand-orange' : 'border-gray-200 bg-white text-gray-700'}`}
                    >
                      <div>
                        <p className="font-bold text-sm">{gift.name}</p>
                        <p className="text-xs text-gray-500">+$${gift.price}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-300'}`}>
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Personal Card & Delivery Date</h2>
              <div className="space-y-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Greeting Card Message (+$5)</label>
                  <textarea
                    rows={3}
                    value={greetingMessage}
                    onChange={(e) => setGreetingMessage(e.target.value)}
                    placeholder="Write a custom message for the recipient..."
                    className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-brand-orange outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-soft p-4 sm:p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-5 text-brand-green">
                <div className="w-12 h-12 rounded-3xl bg-brand-green-pale flex items-center justify-center">
                  <Layers size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Custom Bouquet Summary</h3>
                  <p className="text-sm text-gray-500">Live price recalculation</p>
                </div>
              </div>

              <div className="rounded-3xl bg-gray-50 p-4 sm:p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Bouquet Price</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{formatPrice(previewPrice * 100)}</p>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-600 border-t border-b border-gray-100 py-4">
                <div className="flex justify-between"><span>Size</span><span className="font-semibold capitalize">{size.replace('_', ' ')}</span></div>
                <div className="flex justify-between"><span>Wrapping</span><span className="font-semibold capitalize">{wrappingStyle}</span></div>
                <div className="flex justify-between"><span>Ribbon</span><span className="font-semibold capitalize">{ribbonColor}</span></div>
                <div className="flex justify-between"><span>Total Stems</span><span className="font-semibold">{flowers.reduce((s, f) => s + f.quantity, 0)}</span></div>
                {selectedVase !== 'none' && <div className="flex justify-between"><span>Vase</span><span className="font-semibold">{VASES.find(v => v.id === selectedVase)?.name}</span></div>}
                {extraGifts.length > 0 && <div className="flex justify-between"><span>Extras</span><span className="font-semibold">{extraGifts.length} items</span></div>}
                {greetingMessage.trim() && <div className="flex justify-between"><span>Card</span><span className="font-semibold">Custom Card Included</span></div>}
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={handleAddToCart} variant="primary" className="w-full justify-center py-4 text-base font-bold">
                  <ShoppingBag size={18} /> Add Custom Bouquet to Cart
                </Button>

                <Button onClick={handleSave} variant="outline" loading={saving} className="w-full justify-center">
                  <Heart size={16} /> {user ? 'Save Design to Account' : 'Log in to Save Design'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sticky Summary Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Price ({flowers.reduce((s, f) => s + f.quantity, 0)} stems)</p>
          <p className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">{formatPrice(previewPrice * 100)}</p>
        </div>
        <Button onClick={handleAddToCart} variant="primary" className="!py-2.5 !px-4 text-xs sm:text-sm font-bold">
          <ShoppingBag size={16} /> Add to Cart
        </Button>
      </div>
    </div>
  )
}
