import React from 'react'

interface TextProps {
  children: React.ReactNode
}

/** Body copy, set in silver against the card face */
export const Text: React.FC<TextProps> = ({ children }) => <p className="eg-body">{children}</p>

export default Text
