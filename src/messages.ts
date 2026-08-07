/**
 * The wire format between the popup and the content script.
 *
 * Both ends previously agreed on these shapes by convention only — the popup
 * built an object literal and the content script read `request.action` off an
 * `any`. Declaring them here makes the agreement checkable.
 */

export interface InjectCurveRequest {
  action: 'injectCurve'
}

export type ExpoGainRequest = InjectCurveRequest

export type ExpoGainResponse = { success: true } | { success: false; error: string }
