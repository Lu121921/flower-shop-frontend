import { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import Button from '../components/Button'
import Loading from '../components/Loading'

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      try {
        const response = await adminAPI.getSettings()
        setSettings(response.data.data.settings)
      } catch (error) {
        // handled by axios interceptor
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  if (loading) {
    return <Loading fullScreen text="Loading settings…" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-orange">Admin Settings</p>
            <h1 className="text-3xl font-extrabold text-gray-900">Store configuration</h1>
            <p className="mt-3 text-sm text-gray-500">Review your store-wide settings and update configuration from the admin console.</p>
          </div>
          <Button variant="secondary">Save changes</Button>
        </div>

        <div className="grid gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General store details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Store name</p>
                <p className="mt-2 text-base font-medium text-gray-900">{settings?.store_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="mt-2 text-base font-medium text-gray-900">{settings?.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fulfillment window</p>
                <p className="mt-2 text-base font-medium text-gray-900">{settings?.fulfillment_hours} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Support email</p>
                <p className="mt-2 text-base font-medium text-gray-900">{settings?.support_email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Next steps</h2>
            <p className="text-sm text-gray-500">This section is a placeholder for additional admin configuration options such as payment providers, shipping rules, newsletter templates, and user permissions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
