import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ReactPlugin } from '@microsoft/applicationinsights-react-js'

let reactPlugin: any = null
let appInsights: any = null

/**
 * Create the App Insights Telemetry Service
 * @return {{reactPlugin: ReactPlugin, appInsights: Object, initialize: Function}} - Object
 */
const createTelemetryService = () => {
  /**
   * Initialize the Application Insights class
   * @param {string} instrumentationKey - Application Insights Instrumentation Key
   * @param {Object} browserHistory - client's browser history, supplied by the withRouter HOC
   * @return {void}
   */
  const initialize = (instrumentationKey: string, browserHistory: any) => {
    if (!browserHistory) {
      throw new Error('Could not initialize Telemetry Service')
    }
    if (!instrumentationKey) {
      throw new Error('Instrumentation key not provided.')
    }

    reactPlugin = new ReactPlugin()

    appInsights = new ApplicationInsights({
      config: {
        instrumentationKey,
        maxBatchInterval: 0,
        disableFetchTracking: false,
        extensions: [reactPlugin],
        extensionConfig: {
          [reactPlugin.identifier]: {
            history: browserHistory,
          },
        },
      },
    })

    appInsights.loadAppInsights()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    appInsights.addTelemetryInitializer((_: any) => {
      return !/\/\/(localhost|127\.0\.0\.1):/i.test(window.location.href)
    })
  }

  return { reactPlugin, appInsights, initialize }
}

export const ai = createTelemetryService()
export const getAppInsights = () => appInsights
