import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'
import { AuthProvider }          from './contexts/AuthContext.jsx'
import { CartProvider }          from './contexts/CartContext.jsx'
import { WishlistProvider }      from './contexts/WishlistContext.jsx'
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <ErrorBoundary><App /></ErrorBoundary>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: '#fff',
                    color: '#1F2937',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
                    fontSize: '14px',
                    fontWeight: '600',
                  },
                  success: { iconTheme: { primary: '#E8500A', secondary: '#fff' } },
                  error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
              />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
