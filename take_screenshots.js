import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  console.log('Launching browser with puppeteer-core...')
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()

  // 1. Screenshot Login
  console.log('Capturing Login page...')
  await page.goto('http://127.0.0.1:5173/web/#/login', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: 'c:/E/ichsan/tugas/screenshot_imk_1_login.png' })

  // 2. Screenshot Chat
  console.log('Capturing Chat page...')
  await page.goto('http://127.0.0.1:5173/web/#/chat', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  // Type a sample question to demonstrate active state
  try {
    const inputSelector = 'input[placeholder="Ketik pertanyaan Anda di sini..."]'
    await page.waitForSelector(inputSelector, { timeout: 3000 })
    await page.type(inputSelector, 'Cara mengajukan cuti')
  } catch (e) {
    console.log('Input typing note:', e.message)
  }
  await page.screenshot({ path: 'c:/E/ichsan/tugas/screenshot_imk_2_chat.png' })

  // 3. Screenshot Dokumen Management
  console.log('Capturing Document Management page...')
  await page.goto('http://127.0.0.1:5173/web/#/admin/documents', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: 'c:/E/ichsan/tugas/screenshot_imk_3_documents.png' })

  // 4. Screenshot System Metrics
  console.log('Capturing System Metrics page...')
  await page.goto('http://127.0.0.1:5173/web/#/admin/metrics', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: 'c:/E/ichsan/tugas/screenshot_imk_4_metrics.png' })

  // 5. Screenshot Audit Log
  console.log('Capturing Audit Log page...')
  await page.goto('http://127.0.0.1:5173/web/#/audit/logs', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: 'c:/E/ichsan/tugas/screenshot_imk_5_audit.png' })

  console.log('All 5 screenshots captured successfully!')
  await browser.close()
}

run().catch((err) => {
  console.error('Error taking screenshots:', err)
  process.exit(1)
})
