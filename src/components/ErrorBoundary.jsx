import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  componentDidCatch(error, info) {
    // Keep diagnostics available without exposing implementation details to customers.
    console.error('Application error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="min-h-screen grid place-items-center bg-brand-cream px-6 text-center">
        <section className="max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">Luna Bloom's</p>
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">Please refresh the page. If the problem continues, our team will be happy to help.</p>
          <button onClick={() => window.location.reload()} className="btn-orange mt-6">Refresh page</button>
        </section>
      </main>
    )
  }
}
