import React from 'react'

function StepperField({ label, value, onChange, min = 0 }) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    onChange(value + 1)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold tracking-wide uppercase text-[#2A2A2A]">{label}</span>
      <div className="flex items-center border-1.5 border-[#2A2A2A] rounded-sm w-fit bg-white overflow-hidden">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="stepper-btn border-r-1.5 border-none"
        >
          −
        </button>
        <span className="stepper-value px-4 text-[#2A2A2A]">{value}</span>
        <button
          type="button"
          onClick={handleIncrement}
          className="stepper-btn border-l-1.5 border-none"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default StepperField
