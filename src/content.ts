// Content script entry. Each step runs synchronously at module evaluation, in
// this order, on every page the manifest matches.
import {
  installDebugHook,
  listenForMessages,
  logStartup,
  showLoadedIndicator,
} from './content/bootstrap'

logStartup()
showLoadedIndicator()
installDebugHook()
listenForMessages()
