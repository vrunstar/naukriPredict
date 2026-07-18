import React from 'react'

function FormSection({ title, accentColor = 'var(--accent-blue)', children }) {
  return (
    <div className="flat-card mb-8">
      <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-dashed border-[#2A2A2A]">
        <span 
          className="accent-chip" 
          style={{ backgroundColor: accentColor }}
        >
          {title}
        </span>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export default FormSection
