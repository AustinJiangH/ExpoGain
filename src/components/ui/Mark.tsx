import React from 'react'

interface MarkProps {
  /** The wordmark, set in the display serif */
  name: string
  /** The line of small caps beneath it */
  sub: string
}

/** The chip, struck in silver and etched with a contact grid */
export const Chip: React.FC = () => (
  <div aria-hidden className="eg-chip">
    <div className="eg-chip-grid" />
  </div>
)

/** Wordmark and chip, set at opposite corners the way a card is laid out */
export const Mark: React.FC<MarkProps> = ({ name, sub }) => (
  <header className="eg-mark">
    <div>
      <h1 className="eg-wordmark">{name}</h1>
      <p className="eg-wordmark-sub">{sub}</p>
    </div>
    <Chip />
  </header>
)

export default Mark
