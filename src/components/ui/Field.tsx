import React from 'react'

/** The three registers the interface speaks in. Silver at rest, champagne
 *  while working, oxblood at fault — the only departures from the ramp. */
export type Tone = 'ready' | 'working' | 'fault'

const TONE_CLASS: Record<Tone, string> = {
  ready: 'eg-tone-ready',
  working: 'eg-tone-working',
  fault: 'eg-tone-fault',
}

interface FieldProps {
  label: string
  value: string
  tone: Tone
}

/** An engraved row, as a field is stamped into card stock: label at the
 *  left, a lit lamp and the value at the right. */
export const Field: React.FC<FieldProps> = ({ label, value, tone }) => (
  <div className="eg-field">
    <span className="eg-label">{label}</span>
    <span className={`eg-field-value ${TONE_CLASS[tone]}`}>
      <span className="eg-field-lamp" />
      {value}
    </span>
  </div>
)

export default Field
