import axiosInstance from '../config/axios'

// ─── Products ──────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:      (params = {}) => axiosInstance.get('/products', { params }),
  getById:     (id)          => axiosInstance.get(`/products/${id}`),
  getBySlug:   (slug)        => axiosInstance.get(`/products/slug/${slug}`),
  getFeatured: (limit = 8)   => axiosInstance.get('/products/featured', { params: { limit } }),
  getImages:   (id)          => axiosInstance.get(`/products/${id}/images`),
  create:      (formData)    => axiosInstance.post('/products', formData),
  update:      (id, formData) => axiosInstance.patch(`/products/${id}`, formData),
  delete:      (id)          => axiosInstance.delete(`/products/${id}`),
  addImage:    (id, formData) => axiosInstance.post(`/products/${id}/images`, formData),
  deleteImage: (id, imageId)  => axiosInstance.delete(`/products/${id}/images/${imageId}`),
}

// ─── Categories ────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll:      ()     => axiosInstance.get('/categories'),
  getBySlug:   (slug) => axiosInstance.get(`/categories/${slug}`),
  create:      (data) => axiosInstance.post('/categories', data),
  update:      (id, data) => axiosInstance.patch(`/categories/${id}`, data),
  delete:      (id)   => axiosInstance.delete(`/categories/${id}`),
}

// ─── Reviews ───────────────────────────────────────────────────────────────
export const reviewAPI = {
  getByProduct: (productId, params = {}) => axiosInstance.get(`/reviews/product/${productId}`, { params }),
  create:       (data)                   => axiosInstance.post('/reviews', data),
  update:       (id, data)               => axiosInstance.patch(`/reviews/${id}`, data),
  delete:       (id)                     => axiosInstance.delete(`/reviews/${id}`),
  markHelpful:  (id)                     => axiosInstance.post(`/reviews/${id}/helpful`),
}

// ─── Cart ──────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()              => axiosInstance.get('/cart'),
  add:    (data)          => axiosInstance.post('/cart', data),
  update: (id, quantity)  => axiosInstance.patch(`/cart/${id}`, { quantity }),
  remove: (id)            => axiosInstance.delete(`/cart/${id}`),
  clear:  ()              => axiosInstance.delete('/cart'),
}

// ─── Wishlist ──────────────────────────────────────────────────────────────
export const wishlistAPI = {
  get:             ()           => axiosInstance.get('/wishlist'),
  add:             (product_id) => axiosInstance.post('/wishlist', { product_id }),
  removeById:      (id)         => axiosInstance.delete(`/wishlist/${id}`),
  removeByProduct: (product_id) => axiosInstance.delete(`/wishlist/product/${product_id}`),
}

// ─── Orders ────────────────────────────────────────────────────────────────
export const orderAPI = {
  getAll:  (params = {}) => axiosInstance.get('/orders', { params }),
  getById: (id)          => axiosInstance.get(`/orders/${id}`),
  create:  (data)        => axiosInstance.post('/orders', data),
  cancel:  (id, reason)  => axiosInstance.post(`/orders/${id}/cancel`, { cancel_reason: reason }),
}

// ─── Payments ──────────────────────────────────────────────────────────────
export const paymentAPI = {
  createIntent: (order_id)  => axiosInstance.post('/payments/intent', { order_id }),
  confirm:      (data)      => axiosInstance.post('/payments/confirm', data),
  getByOrder:   (orderId)   => axiosInstance.get(`/payments/${orderId}`),
}

// ─── Users ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:     ()       => axiosInstance.get('/users/profile'),
  updateProfile:  (data)   => axiosInstance.patch('/users/profile', data),
  uploadAvatar:   (file)   => {
    const form = new FormData(); form.append('image', file)
    return axiosInstance.post('/users/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getAddresses:   ()       => axiosInstance.get('/users/addresses'),
  createAddress:  (data)   => axiosInstance.post('/users/addresses', data),
  updateAddress:  (id, d)  => axiosInstance.patch(`/users/addresses/${id}`, d),
  deleteAddress:  (id)     => axiosInstance.delete(`/users/addresses/${id}`),
}

// ─── Contact & Newsletter ──────────────────────────────────────────────────
export const contactAPI = {
  send:        (data)  => axiosInstance.post('/contact', data),
  subscribe:   (data)  => axiosInstance.post('/newsletter/subscribe', data),
  unsubscribe: (email) => axiosInstance.post('/newsletter/unsubscribe', { email }),
}

// ─── Flower Meanings ───────────────────────────────────────────────────────
export const flowerAPI = {
  getAll:     (params = {}) => axiosInstance.get('/flower-meanings', { params }),
  getBySlug:  (slug)        => axiosInstance.get(`/flower-meanings/${slug}`),
  create:     (data)        => axiosInstance.post('/flower-meanings', data),
  update:     (id, data)    => axiosInstance.patch(`/flower-meanings/${id}`, data),
  delete:     (id)          => axiosInstance.delete(`/flower-meanings/${id}`),
}

// ─── Gift Bundles ──────────────────────────────────────────────────────────
export const bundleAPI = {
  getAll:     (params = {}) => axiosInstance.get('/gift-bundles', { params }),
  getBySlug:  (slug)        => axiosInstance.get(`/gift-bundles/${slug}`),
  create:     (data)        => axiosInstance.post('/gift-bundles', data),
  update:     (id, data)    => axiosInstance.patch(`/gift-bundles/${id}`, data),
  delete:     (id)          => axiosInstance.delete(`/gift-bundles/${id}`),
}

// ─── Recommendations ───────────────────────────────────────────────────────
export const recommendationAPI = {
  get:      (params = {}) => axiosInstance.get('/recommendations', { params }),
  trending: (limit = 8)   => axiosInstance.get('/recommendations/trending', { params: { limit } }),
  wizard:   (data)        => axiosInstance.post('/recommendations/wizard', data),
}

export const adminAPI = {
  getDashboard:        ()                           => axiosInstance.get('/admin/dashboard'),
  getAnalytics:        (params = {})               => axiosInstance.get('/admin/analytics', { params }),
  getReports:          (params = {})               => axiosInstance.get('/admin/reports', { params }),
  getPayments:         (params = {})               => axiosInstance.get('/admin/payments', { params }),
  getOrders:           (params = {})               => axiosInstance.get('/admin/orders', { params }),
  updateOrderStatus:   (orderId, data)             => axiosInstance.patch(`/admin/orders/${orderId}/status`, data),
  getUsers:            (params = {})               => axiosInstance.get('/admin/users', { params }),
  updateUserRole:      (userId, data)              => axiosInstance.patch(`/admin/users/${userId}/role`, data),
  getReviews:          (params = {})               => axiosInstance.get('/admin/reviews', { params }),
  approveReview:       (reviewId, data)            => axiosInstance.patch(`/admin/reviews/${reviewId}/approve`, data),
  getContacts:         (params = {})               => axiosInstance.get('/contact', { params }),
  replyContact:        (id, data)                  => axiosInstance.patch(`/contact/${id}/reply`, data),
  getNewsletterSubscribers: (params = {})          => axiosInstance.get('/admin/newsletter/subscribers', { params }),
  updateNewsletterSubscriber: (id, data)          => axiosInstance.patch(`/admin/newsletter/subscribers/${id}`, data),
  getRecommendationRules:   (params = {})          => axiosInstance.get('/admin/recommendation-rules', { params }),
  createRecommendationRule: (data)                 => axiosInstance.post('/admin/recommendation-rules', data),
  updateRecommendationRule: (id, data)             => axiosInstance.patch(`/admin/recommendation-rules/${id}`, data),
  deleteRecommendationRule: (id)                    => axiosInstance.delete(`/admin/recommendation-rules/${id}`),
  getSettings:         ()                           => axiosInstance.get('/admin/settings'),
}

// ─── Bouquet Builder ───────────────────────────────────────────────────────
export const bouquetAPI = {
  getOptions:  ()      => axiosInstance.get('/bouquets/options'),
  preview:     (data)  => axiosInstance.post('/bouquets/preview', data),
  getUserAll:  ()      => axiosInstance.get('/bouquets'),
  create:      (data)  => axiosInstance.post('/bouquets', data),
  update:      (id, d) => axiosInstance.patch(`/bouquets/${id}`, d),
  delete:      (id)    => axiosInstance.delete(`/bouquets/${id}`),
}
