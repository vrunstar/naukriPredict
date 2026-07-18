import React from 'react'

function PillGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold tracking-wide uppercase text-[#2A2A2A]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`pill-btn ${isActive ? 'active' : ''}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PillGroup
