import React from 'react'

interface CardProps {
  children: React.ReactNode
}

/**
 * The premium-card surface: a dark stage, a silver lining one pixel proud of
 * the face, and a raking sheen across it. Children stack on a single rhythm.
 */
export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="eg-stage">
    <div className="eg-card-lining">
      <div className="eg-card">
        <div aria-hidden className="eg-card-sheen" />
        {children}
      </div>
    </div>
  </div>
)

/** A hairline divider that fades out to the right, the way engraving does */
export const Rule: React.FC = () => <div className="eg-rule" />

export default Card
