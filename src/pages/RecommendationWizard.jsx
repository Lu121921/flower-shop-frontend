import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Gift, Heart, Flower2, Star } from 'lucide-react'
import { recommendationAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'

const OCCASIONS = [
  'Birthday', 'Anniversary', "Valentine's Day", 'Wedding', 'Engagement', 'Graduation',
  "Mother's Day", "Father's Day", 'Thank You', 'Congratulations', 'Get Well Soon',
  'New Baby', "Apology / I'm Sorry", 'Love & Romance', 'Friendship', 'Sympathy & Condolences',
  'Celebration', 'Just Because'
]

const RECIPIENTS = ['Loved One', 'Partner', 'Friend', 'Family', 'Colleague', 'Self']
const FLOWERS = ['Roses', 'Lilies', 'Tulips', 'Peonies', 'Orchids', 'Sunflowers', 'Hydrangeas', 'Carnations', 'Lavender']
const COLORS = ['Red', 'Pink', 'White', 'Yellow', 'Purple', 'Orange', 'Peach']
const STYLES = ['Romantic', 'Modern', 'Rustic', 'Classic', 'Boho', 'Minimal']
const BUDGETS = [
  { label: 'Under 5,000 ETB', min: 1000, max: 5000 },
  { label: '5,000 – 15,000 ETB', min: 5000, max: 15000 },
  { label: '15,000 – 35,000 ETB', min: 15000, max: 35000 },
  { label: 'Over 35,000 ETB', min: 35000, max: 100000 },
]

export default function RecommendationWizard() {
  const [recipient, setRecipient] = useState('Loved One')
  const [occasion, setOccasion] = useState('Birthday')
  const [budget, setBudget] = useState(BUDGETS[1])
  const [favoriteFlower, setFavoriteFlower] = useState('Roses')
  const [favoriteColor, setFavoriteColor] = useState('Pink')
  const [bouquetStyle, setBouquetStyle] = useState('Romantic')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setSubmitted(true)

    try {
      const { data } = await recommendationAPI.wizard({
        recipient,
        occasion,
        budget_min: budget.min,
        budget_max: budget.max === 9999 ? null : budget.max,
        favorite_flower: favoriteFlower,
        favorite_color: favoriteColor,
        bouquet_style: bouquetStyle,
      })
      setRecommendations(data?.products || [])
    } catch (error) {
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-brand-orange-pale to-brand-green-pale py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionHeader
              title="Find the perfect bouquet"
              subtitle="Answer a few simple questions and we’ll curate your ideal flowers and gifts."
              center
            />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Luna Bloom's recommendation wizard blends occasion, style, budget and sentiment into a personalised floral edit.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Recommendations' }]} />
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 mt-8">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-white rounded-3xl shadow-soft p-8"
          >
            <div className="flex items-center gap-3 text-brand-orange">
              <div className="w-12 h-12 rounded-3xl bg-brand-orange-pale flex items-center justify-center">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] font-semibold text-gray-400">Personalized guide</p>
                <h2 className="text-2xl font-bold text-gray-900">Your recommendation profile</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Recipient</span>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange"
                >
                  {RECIPIENTS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Occasion</span>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange"
                >
                  {OCCASIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Budget</span>
                <select
                  value={budget.label}
                  onChange={(e) => setBudget(BUDGETS.find((item) => item.label === e.target.value))}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange"
                >
                  {BUDGETS.map((option) => (
                    <option key={option.label} value={option.label}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Favorite flower</span>
                <select
                  value={favoriteFlower}
                  onChange={(e) => setFavoriteFlower(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange"
                >
                  {FLOWERS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Color palette</span>
                <select
                  value={favoriteColor}
                  onChange={(e) => setFavoriteColor(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange"
                >
                  {COLORS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Bouquet style</span>
                <select
                  value={bouquetStyle}
                  onChange={(e) => setBouquetStyle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange"
                >
                  {STYLES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Answer a few details to uncover florals matched to your sentiment.</p>
              </div>
              <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">Show recommendations</Button>
            </div>
          </motion.form>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-soft p-8"
            >
              <div className="flex items-center gap-3 mb-4 text-brand-orange">
                <div className="w-12 h-12 rounded-3xl bg-brand-orange-pale flex items-center justify-center">
                  <Gift size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Why our wizard works</h3>
                  <p className="text-sm text-gray-500">The wizard uses occasion, favorite blooms, palette and style to find florals that feel intentional.</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <p className="flex items-start gap-2"><Sparkles size={18} className="text-brand-orange mt-0.5" /> Custom matches based on your answers.</p>
                <p className="flex items-start gap-2"><Heart size={18} className="text-brand-orange mt-0.5" /> Thoughtful flowers for every mood and moment.</p>
                <p className="flex items-start gap-2"><Flower2 size={18} className="text-brand-orange mt-0.5" /> Handpicked bouquets from Luna Bloom’s best sellers.</p>
                <p className="flex items-start gap-2"><Star size={18} className="text-brand-orange mt-0.5" /> Fast results in seconds, ready to shop or gift.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-orange/5 rounded-3xl p-8 border border-brand-orange/10">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pro tip</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Pick your favorite color and bouquet style first—the most memorable gifts align mood, meaning and the recipient.</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-12">
          <SectionHeader title="Recommended florals" subtitle="Your curated bouquet suggestions appear here." />
          {loading ? (
            <Loading />
          ) : submitted && recommendations.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <p className="text-gray-500">No recommendations found. Try adjusting your budget or style.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recommendations.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl shadow-soft p-4">
                  <ProductCard product={product} />
                  {product.why?.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-semibold text-gray-800 mb-2">Why this one?</p>
                      <ul className="list-disc list-inside space-y-1">
                        {product.why.map((line, index) => <li key={index}>{line}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
