import React from 'react'

/** Primary is brushed silver; ghost is a silver hairline over the card face */
export type ButtonVariant = 'primary' | 'ghost'

/** Idle invites a press, working reports back in champagne, done is held bright */
export type ButtonState = 'idle' | 'working' | 'done'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'eg-btn-primary',
  ghost: 'eg-btn-ghost',
}

const STATE_CLASS: Record<ButtonState, string> = {
  idle: '',
  working: 'eg-is-working',
  done: 'eg-is-done',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  state?: ButtonState
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  state = 'idle',
  className,
  ...props
}) => (
  <button
    className={['eg-btn', VARIANT_CLASS[variant], STATE_CLASS[state], className]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
)

/** Stacks the actions at the foot of the card */
export const Actions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="eg-actions">{children}</div>
)

export default Button
