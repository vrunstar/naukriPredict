import React from 'react'

function SliderField({ label, min = 0, max = 10, step = 1, value, onChange, accentColor = 'var(--accent-yellow)' }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold tracking-wide uppercase text-[#2A2A2A]">{label}</span>
        <span 
          className="px-2.5 py-1 text-sm font-bold border-1.5 border-[#2A2A2A] rounded-sm"
          style={{ backgroundColor: accentColor }}
        >
          {value || 0}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-[#888]">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flat-slider"
          style={{ '--accent-yellow': accentColor }}
        />
        <span className="text-xs font-medium text-[#888]">{max}</span>
      </div>
    </div>
  )
}

export default SliderField
