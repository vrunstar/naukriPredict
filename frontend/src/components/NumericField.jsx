import React from 'react'

function NumericField({ label, value, onChange, placeholder, unit, min, max, step }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold tracking-wide uppercase text-[#2A2A2A]">{label}</span>
      <div className="relative flex items-center">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flat-input pr-12"
          required
        />
        {unit && (
          <span className="absolute right-4 text-sm font-bold text-[#888]">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default NumericField
