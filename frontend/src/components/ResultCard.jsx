import React from 'react'

function ResultCard({ placed, probability, salary, salaryRange, model }) {
  const bgColor = placed ? 'var(--accent-sage)' : 'var(--accent-terracotta)'
  
  return (
    <div 
      className="flat-card mb-8 text-[#2A2A2A]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="accent-chip bg-white text-[#2A2A2A] mb-2 inline-block">
            VERDICT
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
            {placed ? 'LIKELY PLACED' : 'AT RISK / NOT PLACED'}
          </h2>
          <p className="text-lg font-medium mt-1 opacity-90">
            Placement Probability: <span className="font-extrabold">{probability}</span>
          </p>
          <span className="text-xs font-semibold opacity-75 uppercase block mt-2">
            Predicted via Model: {model}
          </span>
        </div>

        {placed && salary && (
          <div className="bg-white border-2 border-[#2A2A2A] p-5 rounded-sm md:text-right min-w-[200px]">
            <span className="text-xs font-extrabold uppercase text-[#888] block mb-1">
              ESTIMATED SALARY
            </span>
            <div className="text-3xl font-extrabold text-[#2A2A2A]">
              {salary} <span className="text-sm font-bold">LPA</span>
            </div>
            {salaryRange && (
              <span className="text-xs font-semibold text-[#666] block mt-1">
                Expected Range: {salaryRange[0]} - {salaryRange[1]} LPA
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultCard
