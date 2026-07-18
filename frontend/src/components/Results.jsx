import React from 'react'
import ResultCard from './ResultCard'
import ImpactBar from './ImpactBar'
import ModelCompare from './ModelCompare'

const FEATURE_LABELS = {
  skill_rating: 'Skill Rating',
  practical_experience: 'Practical Experience',
  cgpa: 'CGPA',
  backlogs: 'Backlogs',
  twelfth_percentage: '12th %',
  family_income_level: 'Family Income',
  city_tier: 'City Tier',
  gender: 'Gender',
  part_time_job: 'Part Time Job',
  internet_access: 'Internet Access',
  extracurricular_involvement: 'Extracurricular',
  branch_CSE: 'Branch: CSE',
  branch_IT: 'Branch: IT',
  branch_ECE: 'Branch: ECE',
  branch_EE: 'Branch: EE',
  branch_ME: 'Branch: ME',
  branch_CE: 'Branch: CE',
}

function labelForFeature(feature) {
  if (FEATURE_LABELS[feature]) return FEATURE_LABELS[feature]
  if (feature.startsWith('branch_')) return `Branch: ${feature.replace('branch_', '')}`
  return feature
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function Results({ result }) {
  const { placed, placement_prob, pred_sal, sal_range, model, shap_values = [] } = result
  const probabilityStr = `${(placement_prob * 100).toFixed(1)}%`

  // Filter out zero SHAP values and sort by absolute impact
  const shapData = shap_values
    .filter((item) => Number.isFinite(item.shap_value) && item.shap_value !== 0)
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .slice(0, 8)
    .map((item) => ({
      ...item,
      label: labelForFeature(item.feature),
    }))

  const maxShap = shapData.reduce((max, item) => Math.max(max, Math.abs(item.shap_value)), 0)

  return (
    <div className="mt-10 pt-8 border-t-2 border-dashed border-[#2A2A2A] space-y-8">
      
      {/* ── Result Card ── */}
      <ResultCard
        placed={placed}
        probability={probabilityStr}
        salary={pred_sal}
        salaryRange={sal_range}
        model={model.replace(/_/g, ' ')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ── Feature Impact (SHAP) ── */}
        <div className="flat-card bg-white">
          <div className="flex items-center gap-2 mb-6">
            <span className="accent-chip bg-var(--accent-blue)">
              EXPLAINER
            </span>
            <h3 className="text-xl font-bold">Feature Impact (SHAP)</h3>
          </div>
          
          <div className="space-y-4">
            {shapData.length > 0 ? (
              shapData.map((item) => (
                <ImpactBar
                  key={item.feature}
                  label={item.label}
                  value={item.shap_value}
                  maxVal={maxShap}
                />
              ))
            ) : (
              <p className="text-sm font-semibold opacity-70">
                No feature impact insights available for this prediction.
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#EFEFEF] text-[10px] uppercase font-bold text-[#888]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 height w-2.5 inline-block bg-[var(--accent-sage)] rounded-sm border border-[#2A2A2A]" />
              Positive Factor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 height w-2.5 inline-block bg-[var(--accent-terracotta)] rounded-sm border border-[#2A2A2A]" />
              Negative Factor
            </span>
          </div>
        </div>

        {/* ── Model Performance & Compare ── */}
        <div className="space-y-6">
          <ModelCompare />
        </div>

      </div>
    </div>
  )
}

export default Results
