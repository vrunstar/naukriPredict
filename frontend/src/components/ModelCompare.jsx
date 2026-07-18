import React, { useEffect, useState } from 'react'

function formatModelName(name) {
  return name.replace(/_/g, ' ')
}

function formatMetric(value) {
  return value == null ? '–' : Number(value).toFixed(4)
}

function ModelTable({ title, cols, models, accentBg }) {
  return (
    <div className="flat-card bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="accent-chip" style={{ backgroundColor: accentBg }}>
          METRICS
        </span>
        <h4 className="text-base font-bold">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="py-2 font-bold uppercase tracking-wider text-[#888]">Model</th>
              {cols.map((col) => (
                <th key={col.key} className="py-2 text-right font-bold uppercase tracking-wider text-[#888]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr 
                key={model.name} 
                className={`border-b border-[#EFEFEF] last:border-b-0 ${model.is_best ? 'bg-[#FAF7F2] font-semibold' : ''}`}
              >
                <td className="py-2.5 capitalize pr-4">
                  <span className="flex items-center gap-1.5">
                    {formatModelName(model.name)}
                    {model.is_best && (
                      <span className="px-1 text-[9px] font-bold border border-[#2A2A2A] rounded-[2px] bg-white text-[#2A2A2A] uppercase">
                        Best
                      </span>
                    )}
                  </span>
                </td>
                {cols.map((col) => (
                  <td key={col.key} className="py-2.5 text-right font-mono text-[#2A2A2A]">
                    {formatMetric(model[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ModelCompare() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    fetch('/api/models/compare')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load model comparison')
        return response.json()
      })
      .then((data) => {
        if (isMounted) setModels(data)
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const classifiers = models.filter((model) => model.task === 'classification')
  const regressors = models.filter((model) => model.task === 'regression')

  if (loading) {
    return (
      <div className="flat-card bg-white py-8 text-center text-sm font-semibold opacity-75">
        Comparing active models...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flat-card bg-white p-4 text-center border-dashed border-[#A04A3A] text-[#A04A3A] font-bold">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ModelTable
        title="Classifiers Comparison"
        cols={[
          { key: 'acc', label: 'Acc' },
          { key: 'f1', label: 'F1' },
          { key: 'roc_auc', label: 'AUC' },
        ]}
        models={classifiers}
        accentBg="var(--accent-blue)"
      />
      <ModelTable
        title="Regressors Comparison"
        cols={[
          { key: 'rmse', label: 'RMSE' },
          { key: 'r2', label: 'R²' },
        ]}
        models={regressors}
        accentBg="var(--accent-purple)"
      />
    </div>
  )
}

export default ModelCompare
