import {
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions,
} from "puppeteer"

export type ScraperOptions = LaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions

const defaultWidth = 1472
const defaultHeight = 828
const linkedinCrawlLocations = [
  101174742, // Canada
  103644278, // USA
]
const browserDefaults: ScraperOptions = {
  headless: true,
  args: [
    "--enable-automation",
    "--start-maximized",
    `--window-size=${defaultWidth},${defaultHeight}`,
    // "--single-process",
    "--lang=en-GB",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-accelerated-2d-canvas",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--proxy-server='direct://",
    "--proxy-bypass-list=*",
    "--allow-running-insecure-content",
    "--disable-web-security",
    "--disable-client-side-phishing-detection",
    "--disable-notifications",
    "--mute-audio",
  ],
  // @ts-ignore
  defaultViewport: null,
  pipe: true,
  slowMo: 500,
}

export { browserDefaults }
