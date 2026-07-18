import { useState } from 'react'
import PredictForm from './components/PredictForm'
import Results from './components/Results'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.detail || 'Prediction request failed')
      }

      const data = await response.json()
      setResult(data)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* ── Page Header ── */}
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#2A2A2A] pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#2A2A2A] tracking-tight mt-1">
              Naukri<span className="text-[#8FAADC]">Predict</span>
            </h1>
            <p className="mt-2 text-sm md:text-base text-[#666] font-medium max-w-xl">
              Calculate placement likelihood, estimated packages, and crucial profile metrics using active machine learning engines.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <span className="px-3 py-1 text-xs font-bold border border-[#2A2A2A] rounded-sm bg-white">
              v3.0.0
            </span>
            <span className="px-3 py-1 text-xs font-bold border border-[#2A2A2A] rounded-sm bg-[#87A987]">
              ENGINE ACTIVE
            </span>
          </div>
        </header>

        {/* ── Main Form Canvas ── */}
        <main className="space-y-8">
          <PredictForm
            error={error}
            loading={loading}
            onSubmit={handleSubmit}
            submitted={submitted}
          />

          {/* ── Interactive Results Panel ── */}
          {submitted && result && (
            <Results result={result} />
          )}
        </main>
        
        {/* ── Footer ── */}
        <footer className="mt-16 pt-6 border-t border-[#EFEFEF] text-center text-xs font-semibold text-[#888]">
          &copy; {new Date().getFullYear()} NaukriPredict Engine. Built with React &amp; Tailwind CSS.
        </footer>

      </div>
    </div>
  )
}

export default App
