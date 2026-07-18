function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 text-center sm:px-6">
      <div
        className="w-full max-w-xl rounded-lg border px-6 py-10 sm:px-10"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <p className="mb-4 text-xs font-semibold uppercase" style={{ color: 'var(--accent)' }}>
          NaukriPredict
        </p>
        <h1 className="mb-4 text-4xl font-bold sm:text-6xl" style={{ color: 'var(--text)' }}>
          Know your placement odds
        </h1>
        <p className="mx-auto max-w-md text-sm leading-6 sm:text-base" style={{ color: 'var(--text-muted)' }}>
          Estimate placement likelihood, salary range, and feature impact with four machine learning models.
        </p>
      </div>
    </section>
  )
}

export default Hero
