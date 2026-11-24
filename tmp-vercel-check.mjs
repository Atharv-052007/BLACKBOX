import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = 'https://blackbox-iota-five.vercel.app'
const routes = [
  '/',
  '/app',
  '/app/cases',
  '/app/evidence',
  '/app/evidence/e-04',
  '/app/suspects',
  '/app/suspects/mara-voss',
  '/app/board',
  '/app/timeline',
  '/app/reconstruction',
  '/app/verdict',
  '/app/reports',
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
  defaultViewport: { width: 1440, height: 1000 },
})
const page = await browser.newPage()
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`${page.url()} console: ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`${page.url()} pageerror: ${err.message}`))

for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 500))
  const info = await page.evaluate(() => {
    const de = document.documentElement
    const text = document.body.innerText
    return {
      path: location.pathname,
      title: document.title,
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      overflow: de.scrollWidth - de.clientWidth > 2,
      hasTitle:
        text.includes('YOUR FIRST INVESTIGATION STARTS HERE.') ||
        text.includes('BLACKBOX — Every mystery has a hidden truth.'),
      hasWelcome: text.includes('Welcome to BLACKBOX') || text.length > 100,
    }
  })
  const status = (await page.goto(base + route, { waitUntil: 'domcontentloaded' })).status()
  console.log(route, `status=${status}`, JSON.stringify(info))
}

// Test How to Play scroll on landing
await page.goto(base + '/', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 400))
const howToPlay = await page.evaluate(() => {
  const button = Array.from(document.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === 'HOW TO PLAY',
  )
  if (!button) return false
  button.click()
  return true
})
await new Promise((r) => setTimeout(r, 700))
const after = await page.evaluate(() => ({
  scrollY: window.scrollY,
  targetVisible: Boolean(document.querySelector('#first-investigation')),
}))
console.log('HOW TO PLAY:', JSON.stringify({ clicked: howToPlay, ...after }))

// Direct route refresh test (browser reload)
await page.goto(base + '/app/reconstruction', { waitUntil: 'networkidle0' })
const recon = await page.evaluate(() => ({
  path: location.pathname,
  slots: document.querySelectorAll('ol li').length,
  hasValidate: Boolean(Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Validate sequence'))),
}))
console.log('reconstruction direct load', JSON.stringify(recon))

// Broken asset check
const assets = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img, link[rel="stylesheet"], script[src]'))
    .map((el) => ({ src: el.getAttribute('src') || el.getAttribute('href'), ok: el.complete || true }))
    .filter((a) => a.src),
)
console.log('asset count', assets.length)
console.log('ERRORS', errors)
await browser.close()
