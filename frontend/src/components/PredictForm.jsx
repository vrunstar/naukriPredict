import React, { useState } from 'react'
import FormSection from './FormSection'
import PillGroup from './PillGroup'
import SliderField from './SliderField'
import StepperField from './StepperField'
import NumericField from './NumericField'

const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE']
const CITY_TIERS = ['Tier 1', 'Tier 2', 'Tier 3']
const INCOME_BINS = ['0-3', '3-6', '6-10', '10-15', '15+']
const LEVELS = ['Low', 'Medium', 'High']
const YES_NO = ['Yes', 'No']
const GENDERS = ['Male', 'Female', 'Not choose to disclose']

const initialForm = {
  twelfth_pct: '75',
  cgpa: '7.8',
  backlogs: 0,
  branch: 'CSE',
  gender: 'Male',
  city: 'Tier 1',
  income: '6-10',
  extracurricular: 'Medium',
  part_time: 'No',
  internet: 'Yes',
  coding: 6,
  comms: 5,
  aptitude: 6,
  projects: 2,
  internship: 1,
  hackathon: 1,
}

function PredictForm({ error, loading, onSubmit, submitted }) {
  const [form, setForm] = useState(initialForm)

  const handleFieldChange = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      twelfth_pct: parseFloat(form.twelfth_pct),
      cgpa: parseFloat(form.cgpa),
      backlogs: parseInt(form.backlogs, 10),
      coding: parseInt(form.coding, 10),
      comms: parseInt(form.comms, 10),
      aptitude: parseInt(form.aptitude, 10),
      projects: parseInt(form.projects, 10),
      internship: parseInt(form.internship, 10),
      hackathon: parseInt(form.hackathon, 10),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ── ACADEMIC SECTION ── */}
      <FormSection title="Academic Metrics" accentColor="var(--accent-blue)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumericField
            label="12th Percentage"
            value={form.twelfth_pct}
            onChange={handleFieldChange('twelfth_pct')}
            placeholder="e.g. 75.5"
            unit="/ 100"
            min={0}
            max={100}
            step={0.01}
          />
          <NumericField
            label="CGPA"
            value={form.cgpa}
            onChange={handleFieldChange('cgpa')}
            placeholder="e.g. 8.2"
            unit="/ 10"
            min={0}
            max={10}
            step={0.01}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <StepperField
            label="Active Backlogs"
            value={form.backlogs}
            onChange={handleFieldChange('backlogs')}
          />
          <PillGroup
            label="Branch / Major"
            options={BRANCHES}
            value={form.branch}
            onChange={handleFieldChange('branch')}
          />
        </div>
      </FormSection>

      {/* ── PERSONAL SECTION ── */}
      <FormSection title="Personal Profile" accentColor="var(--accent-purple)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PillGroup
            label="Gender"
            options={GENDERS}
            value={form.gender}
            onChange={handleFieldChange('gender')}
          />
          <PillGroup
            label="City Tier"
            options={CITY_TIERS}
            value={form.city}
            onChange={handleFieldChange('city')}
          />
          <PillGroup
            label="Family Income (LPA)"
            options={INCOME_BINS}
            value={form.income}
            onChange={handleFieldChange('income')}
          />
          <PillGroup
            label="Extracurricular Level"
            options={LEVELS}
            value={form.extracurricular}
            onChange={handleFieldChange('extracurricular')}
          />
          <PillGroup
            label="Part-time Job"
            options={YES_NO}
            value={form.part_time}
            onChange={handleFieldChange('part_time')}
          />
          <PillGroup
            label="Internet Access"
            options={YES_NO}
            value={form.internet}
            onChange={handleFieldChange('internet')}
          />
        </div>
      </FormSection>

      {/* ── SKILLS SECTION ── */}
      <FormSection title="Core Skills (0-10 Scale)" accentColor="var(--accent-yellow)">
        <div className="grid grid-cols-1 gap-6">
          <SliderField
            label="Coding Skill"
            value={form.coding}
            onChange={handleFieldChange('coding')}
            accentColor="var(--accent-yellow)"
          />
          <SliderField
            label="Communication Skill"
            value={form.comms}
            onChange={handleFieldChange('comms')}
            accentColor="var(--accent-blue)"
          />
          <SliderField
            label="Aptitude Skill"
            value={form.aptitude}
            onChange={handleFieldChange('aptitude')}
            accentColor="var(--accent-purple)"
          />
        </div>
      </FormSection>

      {/* ── EXPERIENCE SECTION ── */}
      <FormSection title="Experience Counts" accentColor="var(--accent-purple)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepperField
            label="Projects Completed"
            value={form.projects}
            onChange={handleFieldChange('projects')}
          />
          <StepperField
            label="Internships"
            value={form.internship}
            onChange={handleFieldChange('internship')}
          />
          <StepperField
            label="Hackathons"
            value={form.hackathon}
            onChange={handleFieldChange('hackathon')}
          />
        </div>
      </FormSection>

      {error && (
        <div className="p-4 border-2 border-dashed border-[#A04A3A] bg-[#FAF3F1] text-[#A04A3A] font-bold rounded-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full md:w-auto"
      >
        {loading ? 'CALCULATING ODDS...' : submitted ? 'RE-CALCULATE PLACEMENT ODDS' : 'PREDICT PLACEMENT ODDS'}
      </button>
    </form>
  )
}

export default PredictForm
