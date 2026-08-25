import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Flower2, Tag, Heart, Sparkles, Filter, Users, Globe, Calendar, ShoppingBag, ArrowRight, X, Info } from 'lucide-react'
import { flowerAPI, productAPI } from '../services/api'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { formatPrice } from '../utils/currency'

const ELEGANT_FLOWER_PLACEHOLDER = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80'

const ALL_FLOWERS = [
  {
    slug: 'rose',
    flower_name: 'Rose',
    meaning: 'Love, romance, passion',
    symbolism: 'Deep romantic love, everlasting beauty, and passion',
    emotional_message: 'You are deeply loved and treasured beyond words.',
    colors: ['red', 'pink', 'white', 'yellow', 'orange'],
    occasions: ['anniversary', 'valentines', 'birthday', 'wedding', 'love_romance', 'engagement'],
    recommended_recipients: ['Romantic Partner', 'Spouse', 'Crush', 'Loved One'],
    origin: 'Middle East',
    season: ['spring', 'summer'],
    fun_fact: 'Red roses became the global symbol of love because they were sacred to Aphrodite, the Greek goddess of love.',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80'
  },
  {
    slug: 'tulip',
    flower_name: 'Tulip',
    meaning: 'Perfect love, affection',
    symbolism: 'Grace, true affection, and new spring beginnings',
    emotional_message: 'My feelings for you are pure, genuine, and renewed every day.',
    colors: ['red', 'pink', 'purple', 'white', 'yellow'],
    occasions: ['birthday', 'anniversary', 'spring', 'mothers_day', 'friendship', 'just_because'],
    recommended_recipients: ['Partner', 'Mother', 'Close Friend', 'Mentor'],
    origin: 'Central Asia',
    season: ['spring'],
    fun_fact: 'Tulips were once so valuable in Holland during the 17th century that a single bulb could cost more than a house.',
    image_url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=80'
  },
  {
    slug: 'sunflower',
    flower_name: 'Sunflower',
    meaning: 'Happiness, friendship, positivity',
    symbolism: 'Warmth, unyielding loyalty, longevity, and radiant sunshine',
    emotional_message: 'You bring bright warmth, joy, and laughter into my life.',
    colors: ['yellow', 'orange'],
    occasions: ['birthday', 'thank_you', 'get_well', 'graduation', 'friendship'],
    recommended_recipients: ['Best Friend', 'Colleague', 'Family Member', 'Someone needing cheer'],
    origin: 'North America',
    season: ['summer'],
    fun_fact: 'Sunflowers display a behavior called heliotropism, turning their flowers to follow the movement of the sun across the sky.',
    image_url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80'
  },
  {
    slug: 'lily',
    flower_name: 'Lily',
    meaning: 'Purity, elegance, sympathy',
    symbolism: 'Devotion, refined majesty, spiritual renewal, and honor',
    emotional_message: 'Holding you in deep respect, purity of spirit, and everlasting remembrance.',
    colors: ['white', 'pink', 'orange', 'yellow'],
    occasions: ['sympathy', 'wedding', 'anniversary', 'apology'],
    recommended_recipients: ['Family in grief', 'Bride', 'Honored Guest', 'Respected Elder'],
    origin: 'Asia',
    season: ['summer'],
    fun_fact: 'The lily is one of the oldest cultivated flowers in human history, dating back over 3,000 years.',
    image_url: 'https://images.unsplash.com/photo-1588628566587-dbd176de562b?w=800&q=80'
  },
  {
    slug: 'orchid',
    flower_name: 'Orchid',
    meaning: 'Luxury, beauty, admiration',
    symbolism: 'Rare exotic beauty, refined strength, and noble status',
    emotional_message: 'Your rare grace, strength, and elegance command my deepest admiration.',
    colors: ['purple', 'white', 'pink', 'yellow'],
    occasions: ['birthday', 'anniversary', 'sympathy', 'fathers_day', 'congratulations'],
    recommended_recipients: ['Executive', 'Father', 'Mentor', 'Someone with sophisticated taste'],
    origin: 'Worldwide',
    season: ['year_round'],
    fun_fact: 'Orchids comprise one of the largest families of flowering plants with over 25,000 species worldwide.',
    image_url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80'
  },
  {
    slug: 'peony',
    flower_name: 'Peony',
    meaning: 'Prosperity, honor, good fortune',
    symbolism: 'Wealth, honorable marriage, romantic joy, and bashful grace',
    emotional_message: 'Wishing you a life brimming with prosperity, honor, and everlasting love.',
    colors: ['pink', 'white', 'red', 'coral'],
    occasions: ['wedding', 'anniversary', 'birthday', 'engagement', 'celebration'],
    recommended_recipients: ['Bride & Groom', 'Newlyweds', 'Life Partner', 'Celebrant'],
    origin: 'China',
    season: ['spring'],
    fun_fact: 'Peonies are affectionately known as the "king of flowers" in traditional Chinese culture.',
    image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80'
  },
  {
    slug: 'hydrangea',
    flower_name: 'Hydrangea',
    meaning: 'Gratitude, grace, understanding',
    symbolism: 'Heartfelt emotion, sincere appreciation, abundance, and grace',
    emotional_message: 'Thank you from the bottom of my heart for your grace and deep understanding.',
    colors: ['blue', 'pink', 'white', 'purple'],
    occasions: ['thank_you', 'birthday', 'wedding', 'apology', 'mothers_day'],
    recommended_recipients: ['Mother', 'Mentor', 'Helpful Friend', 'Someone owed thanks'],
    origin: 'Japan',
    season: ['summer'],
    fun_fact: 'Hydrangeas naturally change color based on soil pH: acidic soil produces blue blooms, while alkaline soil produces pink.',
    image_url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80'
  },
  {
    slug: 'carnation',
    flower_name: 'Carnation',
    meaning: 'Pure devotion, motherly love',
    symbolism: 'Unconditional maternal affection, distinction, and enduring loyalty',
    emotional_message: 'Your unwavering care and endless affection anchor my heart.',
    colors: ['pink', 'red', 'white', 'yellow'],
    occasions: ['mothers_day', 'thank_you', 'birthday', 'apology'],
    recommended_recipients: ['Mother', 'Grandmother', 'Teacher', 'Mentor'],
    origin: 'Mediterranean',
    season: ['spring', 'summer'],
    fun_fact: 'Pink carnations are traditionally believed to have first grown from Mary\'s tears, making them the classic symbol of motherly love.',
    image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80'
  },
  {
    slug: 'daisy',
    flower_name: 'Daisy',
    meaning: 'Innocence, loyalty, fresh hope',
    symbolism: 'Purity of heart, cheerful simplicity, loyal love, and bright starts',
    emotional_message: 'With simple truth and cheerful clarity, my loyalty to you remains steadfast.',
    colors: ['white', 'yellow', 'pink'],
    occasions: ['friendship', 'new_baby', 'just_because', 'get_well'],
    recommended_recipients: ['Best Friend', 'New Parents', 'Sibling', 'Dear Companion'],
    origin: 'Europe',
    season: ['spring', 'summer'],
    fun_fact: 'The name "daisy" comes from the Old English "day\'s eye", because the petals open at dawn and close at dusk.',
    image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&q=80'
  },
  {
    slug: 'gerbera',
    flower_name: 'Gerbera',
    meaning: 'Cheerfulness, vibrant joy',
    symbolism: 'Vibrant positivity, energetic optimism, playfulness, and sunny delight',
    emotional_message: 'May your day be filled with bright smiles and boundless, cheerful energy!',
    colors: ['yellow', 'orange', 'pink', 'red'],
    occasions: ['birthday', 'get_well', 'congratulations', 'celebration', 'friendship'],
    recommended_recipients: ['Friend', 'Colleague', 'Sibling', 'Celebrant'],
    origin: 'South Africa',
    season: ['summer'],
    fun_fact: 'Gerbera daisies are known as the fifth most popular cut flower in the world due to their striking color variety.',
    image_url: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&q=80'
  },
  {
    slug: 'chrysanthemum',
    flower_name: 'Chrysanthemum',
    meaning: 'Longevity, truth, joy',
    symbolism: 'Optimism, long life, fidelity, honor, and celebratory cheer',
    emotional_message: 'Celebrating your honorable journey, truth, and long-lasting joy.',
    colors: ['yellow', 'purple', 'white', 'red', 'pink'],
    occasions: ['graduation', 'congratulations', 'celebration', 'mothers_day'],
    recommended_recipients: ['Graduate', 'Leader', 'Parent', 'Honored Elder'],
    origin: 'China',
    season: ['autumn'],
    fun_fact: 'In Japan, the chrysanthemum is the official emblem of the Emperor and the Imperial Family.',
    image_url: 'https://images.unsplash.com/photo-1572454591674-27398d078744?w=800&q=80'
  },
  {
    slug: 'lavender',
    flower_name: 'Lavender',
    meaning: 'Serenity, calm, devotion',
    symbolism: 'Peace of mind, inner tranquility, soothing devotion, and healing rest',
    emotional_message: 'Sending you gentle peace, soothing calm, and quiet devotion.',
    colors: ['purple', 'violet', 'white'],
    occasions: ['sympathy', 'thank_you', 'new_baby', 'just_because', 'get_well'],
    recommended_recipients: ['Someone healing', 'Stressed friend', 'Mother', 'Self-care gift'],
    origin: 'Mediterranean',
    season: ['summer'],
    fun_fact: 'Lavender has been cultivated for over 2,500 years for its soothing essential oils and aromatherapy benefits.',
    image_url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800&q=80'
  },
  {
    slug: 'babys_breath',
    flower_name: "Baby's Breath",
    meaning: 'Everlasting love, purity of heart',
    symbolism: 'Eternal love, divine grace, innocence, and delicate beauty',
    emotional_message: 'My love for you is delicate, pure, and holds true for eternity.',
    colors: ['white', 'pink'],
    occasions: ['wedding', 'new_baby', 'engagement', 'just_because'],
    recommended_recipients: ['Bride', 'Newborn Family', 'Romantic Partner'],
    origin: 'Eastern Europe',
    season: ['summer'],
    fun_fact: "Baby's Breath (Gypsophila) is named for its love of calcium-rich, gypsum-filled soils.",
    image_url: 'https://images.unsplash.com/photo-1557090495-fc9312e77b28?w=800&q=80'
  },
  {
    slug: 'iris',
    flower_name: 'Iris',
    meaning: 'Wisdom, hope, valued friendship',
    symbolism: 'Faith, intellectual wisdom, courageous hope, and inspiring messages',
    emotional_message: 'Your wisdom inspires me, and my hope for our future shines bright.',
    colors: ['purple', 'blue', 'yellow', 'white'],
    occasions: ['graduation', 'sympathy', 'congratulations', 'friendship'],
    recommended_recipients: ['Mentor', 'Scholar', 'Wise Friend', 'Respected Family Member'],
    origin: 'Southern Europe',
    season: ['spring'],
    fun_fact: 'Iris is named after the Greek goddess of the rainbow, who delivered messages from heaven to earth.',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'
  },
  {
    slug: 'lotus',
    flower_name: 'Lotus',
    meaning: 'Spiritual rebirth, purity, resilience',
    symbolism: 'Rising above adversity, spiritual enlightenment, purity, and grace',
    emotional_message: 'Through every trial, you bloom with magnificent resilience and grace.',
    colors: ['pink', 'white'],
    occasions: ['get_well', 'just_because', 'congratulations', 'celebration'],
    recommended_recipients: ['Someone overcoming adversity', 'Spiritual Seeker', 'Dear Friend'],
    origin: 'Asia',
    season: ['summer'],
    fun_fact: 'Lotus seeds can remain viable for over 1,000 years, re-emerging from muddy waters to bloom in perfection.',
    image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80'
  },
  {
    slug: 'daffodil',
    flower_name: 'Daffodil',
    meaning: 'New beginnings, hope, rebirth',
    symbolism: 'Renewal, bright optimism, spring rebirth, and warm friendship',
    emotional_message: 'A fresh new chapter begins today; may it bring endless joy!',
    colors: ['yellow', 'white'],
    occasions: ['spring', 'birthday', 'congratulations', 'just_because'],
    recommended_recipients: ['Colleague starting new role', 'New Homeowner', 'Friend starting anew'],
    origin: 'Western Europe',
    season: ['spring'],
    fun_fact: 'Daffodils are the heralds of spring; giving a single daffodil brings good luck for the year ahead.',
    image_url: 'https://images.unsplash.com/photo-1587554801485-3432c7370464?w=800&q=80'
  },
  {
    slug: 'alstroemeria',
    flower_name: 'Alstroemeria',
    meaning: 'Devoted friendship, mutual support',
    symbolism: 'Enduring companionship, prosperity, strength of bond, and connection',
    emotional_message: 'Through thick and thin, our bond grows stronger every single day.',
    colors: ['orange', 'pink', 'yellow', 'white', 'purple'],
    occasions: ['friendship', 'thank_you', 'birthday', 'congratulations'],
    recommended_recipients: ['Best Friend', 'Trusted Partner', 'Sibling'],
    origin: 'South America',
    season: ['summer'],
    fun_fact: 'Also known as the Peruvian Lily, each flower stem has six petals symbolizing commitment, empathy, respect, humor, patience, and understanding.',
    image_url: 'https://images.unsplash.com/photo-1596073413225-300dd1d416c2?w=800&q=80'
  },
  {
    slug: 'anemone',
    flower_name: 'Anemone',
    meaning: 'Anticipation, protective care',
    symbolism: 'Eager expectation, protective affection, enchantment, and sincere care',
    emotional_message: 'I eagerly await our next moment together under life\'s protective care.',
    colors: ['purple', 'red', 'white', 'pink'],
    occasions: ['valentines', 'anniversary', 'love_romance', 'just_because'],
    recommended_recipients: ['Fiancée', 'Romantic Partner', 'Loved One far away'],
    origin: 'Mediterranean',
    season: ['spring'],
    fun_fact: 'Anemones are often called "windflowers" because their delicate petals open gracefully in the spring breeze.',
    image_url: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800&q=80'
  }
]

const OCCASION_FILTERS = [
  { id: 'all', label: 'All Flowers' },
  { id: 'love_romance', label: 'Love & Romance' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'mothers_day', label: "Mother's Day" },
  { id: 'thank_you', label: 'Thank You' },
  { id: 'sympathy', label: 'Sympathy' },
  { id: 'friendship', label: 'Friendship' },
  { id: 'congratulations', label: 'Congratulations' },
  { id: 'get_well', label: 'Get Well' },
]

export default function FlowerMeanings() {
  const [flowers, setFlowers] = useState(ALL_FLOWERS)
  const [search, setSearch] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('all')
  const [selectedFlower, setSelectedFlower] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    flowerAPI.getAll()
      .then(r => {
        if (r.data?.flowers && r.data.flowers.length > 0) {
          setFlowers(r.data.flowers)
        }
      })
      .catch(() => setFlowers(ALL_FLOWERS))
      .finally(() => setLoading(false))
  }, [])

  // When a flower modal is opened, fetch related shop products
  useEffect(() => {
    if (!selectedFlower) {
      setRelatedProducts([])
      return
    }
    setLoadingProducts(true)
    productAPI.getAll({ search: selectedFlower.flower_name, limit: 4 })
      .then(r => setRelatedProducts(r.data?.products || []))
      .catch(() => setRelatedProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [selectedFlower])

  const filteredFlowers = flowers.filter(flower => {
    const matchesSearch =
      flower.flower_name.toLowerCase().includes(search.toLowerCase()) ||
      flower.meaning.toLowerCase().includes(search.toLowerCase()) ||
      (flower.symbolism && flower.symbolism.toLowerCase().includes(search.toLowerCase())) ||
      (flower.emotional_message && flower.emotional_message.toLowerCase().includes(search.toLowerCase()))

    const matchesOccasion =
      selectedOccasion === 'all' ||
      (flower.occasions && flower.occasions.includes(selectedOccasion))

    return matchesSearch && matchesOccasion
  })

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-emerald-50/30 to-neutral-50/50 border-b border-emerald-950/5 py-16 md:py-24">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/90 shadow-sm border border-emerald-950/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-800 mb-6">
              <Sparkles size={14} className="text-amber-500" /> The Silent Language of Blooms
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-5" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Every Flower Has a Story
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10 font-normal">
              Flowers communicate feelings that words sometimes cannot express. Explore what each bloom symbolizes, uncover its emotional message, and gift flowers with purpose.
            </p>

            {/* Search Input Box */}
            <div className="max-w-xl mx-auto relative shadow-xl rounded-full">
              <Search size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search flower by name, meaning, or emotion (e.g. Rose, Love, Hope)…"
                className="w-full pl-12 pr-12 py-4 text-sm md:text-base border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-gray-800 placeholder-gray-400 font-medium"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Flower Meanings' }]} />

        {/* Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mr-2 flex-shrink-0">
            <Filter size={14} /> Filter:
          </div>
          {OCCASION_FILTERS.map(occ => (
            <button
              key={occ.id}
              onClick={() => setSelectedOccasion(occ.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedOccasion === occ.id
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {occ.label}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="py-20">
            <Loading text="Loading botanical meanings..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredFlowers.map((flower, idx) => (
                <motion.div
                  key={flower.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card-hover transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Flower Image */}
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative cursor-pointer" onClick={() => setSelectedFlower(flower)}>
                      <img
                        src={flower.image_url || ELEGANT_FLOWER_PLACEHOLDER}
                        alt={`${flower.flower_name} bloom representing ${flower.meaning}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={e => { e.target.src = ELEGANT_FLOWER_PLACEHOLDER }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-900 shadow-sm">
                          {flower.flower_name}
                        </span>
                        {flower.colors?.length > 0 && (
                          <div className="flex gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                            {flower.colors.slice(0, 4).map(c => (
                              <span
                                key={c}
                                className="w-2.5 h-2.5 rounded-full border border-white/60"
                                style={{ backgroundColor: c === 'coral' ? '#FF7F50' : c === 'lavender' ? '#967bb6' : c === 'violet' ? '#8F00FF' : c }}
                                title={c}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-xs uppercase font-extrabold tracking-wider text-amber-600 mb-1">
                          Core Symbolism
                        </p>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-emerald-800 transition-colors">
                          "{flower.meaning}"
                        </h3>
                      </div>

                      {/* Emotional Message Quote */}
                      {flower.emotional_message && (
                        <div className="bg-amber-50/60 border-l-2 border-amber-400 p-3 rounded-r-xl text-xs text-amber-950 font-medium italic">
                          "{flower.emotional_message}"
                        </div>
                      )}

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {flower.symbolism}
                      </p>

                      {/* Occasions Badges */}
                      {flower.occasions?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {flower.occasions.slice(0, 3).map(occ => (
                            <span key={occ} className="bg-neutral-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 capitalize">
                              <Tag size={9} className="text-gray-400" /> {occ.replace('_', ' ')}
                            </span>
                          ))}
                          {flower.occasions.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-bold self-center">+{flower.occasions.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setSelectedFlower(flower)}
                      className="w-full py-2.5 px-4 rounded-2xl bg-neutral-100 hover:bg-emerald-800 hover:text-white text-gray-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      Discover Story & Shop <ArrowRight size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredFlowers.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-soft mt-8">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flower2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No flower meanings match your search</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Try searching for another flower name, meaning, or clear your filters.
                </p>
                <button
                  onClick={() => { setSearch(''); setSelectedOccasion('all') }}
                  className="btn-orange text-xs !py-2.5 !px-5"
                >
                  Clear Filters & View All
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Flower Detail Modal */}
      <AnimatePresence>
        {selectedFlower && (
          <Modal isOpen={!!selectedFlower} onClose={() => setSelectedFlower(null)} size="lg" title={`${selectedFlower.flower_name} Meaning & Symbolism`}>
            <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto hide-scrollbar">
              {/* Top Banner */}
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-soft">
                  <img
                    src={selectedFlower.image_url || ELEGANT_FLOWER_PLACEHOLDER}
                    alt={`${selectedFlower.flower_name} high resolution bloom`}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = ELEGANT_FLOWER_PLACEHOLDER }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Flower2 size={13} /> {selectedFlower.flower_name}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    "{selectedFlower.meaning}"
                  </h2>

                  {selectedFlower.emotional_message && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1">
                      <p className="text-xs uppercase font-extrabold text-amber-800 tracking-wider">Emotional Message</p>
                      <p className="text-sm font-semibold text-gray-800 italic">
                        "{selectedFlower.emotional_message}"
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="flex items-center gap-2">
                      <Globe size={14} className="text-emerald-700 flex-shrink-0" />
                      <strong>Native Origin:</strong> {selectedFlower.origin || 'Worldwide'}
                    </p>
                    {selectedFlower.season?.length > 0 && (
                      <p className="flex items-center gap-2">
                        <Calendar size={14} className="text-emerald-700 flex-shrink-0" />
                        <strong>Peak Bloom Season:</strong> {selectedFlower.season.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Symbolism */}
              <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 space-y-2">
                <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-500" /> Botanical Symbolism & Heritage
                </h4>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {selectedFlower.symbolism}
                </p>
              </div>

              {/* Recommended Recipients & Occasions */}
              <div className="grid md:grid-cols-2 gap-4">
                {selectedFlower.recommended_recipients?.length > 0 && (
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Users size={13} /> Ideal Recipients
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFlower.recommended_recipients.map(r => (
                        <span key={r} className="bg-white border border-emerald-200 text-emerald-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFlower.occasions?.length > 0 && (
                  <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Tag size={13} /> Suitable Occasions
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFlower.occasions.map(occ => (
                        <span key={occ} className="bg-white border border-amber-200 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                          {occ.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fun Fact */}
              {selectedFlower.fun_fact && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-1">
                  <p className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                    <Info size={13} /> Botanical Fun Fact
                  </p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {selectedFlower.fun_fact}
                  </p>
                </div>
              )}

              {/* Connected Products Shop CTA */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <ShoppingBag size={18} className="text-brand-orange" />
                    Shop {selectedFlower.flower_name} Arrangements
                  </h4>
                  <Link
                    to={`/shop?search=${encodeURIComponent(selectedFlower.flower_name)}`}
                    onClick={() => setSelectedFlower(null)}
                    className="text-xs text-brand-orange font-bold hover:underline"
                  >
                    View All in Shop →
                  </Link>
                </div>

                {loadingProducts ? (
                  <div className="py-6 text-center text-xs text-gray-400">Searching shop for matching arrangements…</div>
                ) : relatedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {relatedProducts.map(prod => (
                      <Link
                        key={prod.id}
                        to={`/shop?search=${encodeURIComponent(prod.name)}`}
                        onClick={() => setSelectedFlower(null)}
                        className="bg-white rounded-2xl p-2.5 border border-gray-100 hover:border-brand-orange hover:shadow-soft transition-all group"
                      >
                        <img src={prod.image_url} alt={prod.name} className="aspect-square w-full rounded-xl object-cover mb-2 group-hover:scale-105 transition-transform" />
                        <p className="font-bold text-xs text-gray-900 truncate">{prod.name}</p>
                        <p className="text-xs font-extrabold text-brand-orange mt-0.5">{formatPrice(prod.price)}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-500">Explore our custom bouquet builder to design your personalized {selectedFlower.flower_name} arrangement!</p>
                    <Link
                      to="/bouquet-builder"
                      onClick={() => setSelectedFlower(null)}
                      className="inline-flex items-center gap-1.5 btn-orange text-xs !py-2 !px-4 mt-3"
                    >
                      Build Custom {selectedFlower.flower_name} Bouquet <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
