/**
 * Every status the popup can be in.
 *
 * This is the full set actually produced by the two actions — declaring it as
 * a union means a comparison against a status the code can never reach is a
 * compile error rather than a branch that silently never runs.
 */
export type Status =
  | 'Ready'
  // Curve injection
  | 'Starting...'
  | 'Finding active tab...'
  | 'Sending message to content script...'
  | 'Injected!'
  // Screenshot capture
  | 'Taking screenshot...'
  | 'Capturing visible tab...'
  | 'Screenshot captured!'
  | 'Screenshot copied to clipboard!'
  | 'Screenshot captured (clipboard failed)'
  | 'Screenshot downloaded!'
  | 'Screenshot downloaded & copied to clipboard!'
  | 'Screenshot downloaded (fallback method)!'
  | 'Screenshot captured'
  // Terminal failures
  | 'Error'
  | 'Failed'

/**
 * How an action reports back to the view.
 *
 * The actions are plain async functions rather than hooks, so they push
 * progress through these setters at exactly the points they always did.
 * Callers must keep passing React's own setters directly: the intermediate
 * statuses depend on running synchronously up to the first real await.
 */
export interface StatusSink {
  setStatus: (status: Status) => void
  setError: (error: string) => void
}

/** Curve injection additionally latches the injected flag */
export interface InjectionSink extends StatusSink {
  setInjected: (injected: boolean) => void
}
