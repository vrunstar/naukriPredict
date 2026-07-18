import React from 'react'

function ImpactBar({ label, value, maxVal }) {
  const percentage = maxVal ? Math.min(Math.round((Math.abs(value) / maxVal) * 100), 100) : 0
  const isPositive = value >= 0

  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex justify-between text-xs font-bold text-[#2A2A2A]">
        <span>{label}</span>
        <span className={isPositive ? 'text-[#3E6B3E]' : 'text-[#A04A3A]'}>
          {isPositive ? '+' : ''}{value.toFixed(4)}
        </span>
      </div>
      <div className="shap-bar-container">
        <div 
          className={`shap-bar-fill ${!isPositive ? 'negative' : ''}`}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: isPositive ? 'var(--accent-sage)' : 'var(--accent-terracotta)'
          }}
        />
      </div>
    </div>
  )
}

export default ImpactBar
