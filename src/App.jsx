import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Loading from './components/Loading'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Categories = lazy(() => import('./pages/Categories'))
const Occasions = lazy(() => import('./pages/Occasions'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const FlowerMeanings = lazy(() => import('./pages/FlowerMeanings'))
const RecommendationWizard = lazy(() => import('./pages/RecommendationWizard'))
const BouquetBuilder = lazy(() => import('./pages/BouquetBuilder'))
const GiftBundles = lazy(() => import('./pages/GiftBundles'))
const GiftBundleDetail = lazy(() => import('./pages/GiftBundleDetail'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Cart = lazy(() => import('./pages/Cart'))
const Payment = lazy(() => import('./pages/Payment'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminSettings = lazy(() => import('./pages/AdminSettings'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Orders = lazy(() => import('./pages/Orders'))
const Checkout = lazy(() => import('./pages/Checkout'))

export default function App() {
  return (
    <Suspense fallback={<Loading fullScreen text="Loading Luna Bloom's…" />}>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public */}
        <Route index                  element={<Home />} />
        <Route path="shop"            element={<Shop />} />
        <Route path="shop/:id"        element={<ProductDetail />} />
        <Route path="categories"      element={<Categories />} />
        <Route path="occasions"       element={<Occasions />} />
        <Route path="recommendations" element={<RecommendationWizard />} />
        <Route path="bouquet-builder" element={<BouquetBuilder />} />
        <Route path="gift-bundles"    element={<GiftBundles />} />
        <Route path="gift-bundles/:slug" element={<GiftBundleDetail />} />
        <Route path="about"           element={<About />} />
        <Route path="contact"         element={<Contact />} />
        <Route path="faq"             element={<FAQ />} />
        <Route path="flower-meanings" element={<FlowerMeanings />} />
        <Route path="cart"            element={<Cart />} />
        <Route path="payment"         element={<Payment />} />
        <Route path="orders/track"    element={<OrderTracking />} />
        <Route path="login"           element={<Login />} />
        <Route path="register"        element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Protected */}
        <Route path="dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="admin"           element={<ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>} />
        <Route path="admin/settings"  element={<ProtectedRoute><AdminRoute><AdminSettings /></AdminRoute></ProtectedRoute>} />
        <Route path="profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="wishlist"        element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="checkout"        element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="orders"          element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="orders/:id"      element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        <Route path="*"               element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  )
}
