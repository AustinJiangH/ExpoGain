import React from 'react'

interface NoticeProps {
  label: string
  children: React.ReactNode
}

/** A fault panel, tinted oxblood — the only red the palette allows */
export const Notice: React.FC<NoticeProps> = ({ label, children }) => (
  <div className="eg-notice">
    <div className="eg-notice-label">{label}</div>
    <div className="eg-notice-body">{children}</div>
  </div>
)

export default Notice
