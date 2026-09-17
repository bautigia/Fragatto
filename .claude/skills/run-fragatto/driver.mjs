// REPL driver for the Fragatto Next.js site. Run against `npm run dev`
// (localhost:3000) with a headless Chromium (Playwright). Designed for
// agents: run it directly, or under tmux with send-keys/capture-pane.
import { chromium } from 'playwright';
import * as readline from 'node:readline';
import * as fs from 'node:fs';
import * as path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const SHOT_DIR = process.env.SCREENSHOT_DIR || path.join(import.meta.dirname, 'screenshots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

// The main public routes (see app/(site)/ in the repo). Used by `all`.
const ROUTES = ['/', '/catalogo', '/nosotros', '/contacto'];

let browser = null;
let page = null;
const log = []; // console + page errors, newest last

function shotPath(name, fallback) {
  return path.join(SHOT_DIR, (name || fallback) + '.png');
}

const COMMANDS = {
  async launch() {
    if (browser) return console.log('already launched');
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    page = await context.newPage();
    page.on('console', msg => { if (msg.type() === 'error') log.push(`[console.error] ${page.url()}: ${msg.text()}`); });
    page.on('pageerror', err => log.push(`[pageerror] ${page.url()}: ${err.message}`));
    console.log('launched.');
  },

  async nav(route) {
    if (!page) return console.log('ERROR: launch first');
    const url = (route || '/').startsWith('http') ? route : BASE + (route || '/');
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('nav ->', page.url());
  },

  async scroll(y) {
    if (!page) return console.log('ERROR: launch first');
    await page.evaluate((y) => window.scrollTo({ top: Number(y), behavior: 'instant' }), y || 0);
    await page.waitForTimeout(300); // let ScrubHero's rAF/lerp settle
    console.log('scrolled to', y || 0);
  },

  // Plain viewport screenshot - whatever's on screen right now.
  async ss(name) {
    if (!page) return console.log('ERROR: launch first');
    const f = shotPath(name, `ss-${Date.now()}`);
    await page.screenshot({ path: f });
    console.log('screenshot:', f);
  },

  // Full-page screenshot that first walks down the page in viewport-sized
  // steps (like a real user scrolling) so every RevealOnScroll /
  // IntersectionObserver element actually fires before the capture.
  // See Gotchas in SKILL.md - a naive `screenshot({fullPage:true})` at
  // scroll position 0 captures below-the-fold sections at opacity:0.
  async 'shot-full'(name) {
    if (!page) return console.log('ERROR: launch first');
    const height = await page.evaluate(() => document.body.scrollHeight);
    const step = 700;
    for (let y = 0; y < height; y += step) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(200);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const f = shotPath(name, `full-${Date.now()}`);
    await page.screenshot({ path: f, fullPage: true });
    console.log('screenshot:', f);
  },

  // Drive through the main public routes and shot-full each one - "see
  // the site the way a client would," one screenshot per page.
  async all() {
    if (!page) return console.log('ERROR: launch first');
    for (const route of ROUTES) {
      await COMMANDS.nav(route);
      const name = route === '/' ? 'home' : route.replace(/\//g, '');
      await COMMANDS['shot-full'](name);
    }
    console.log('done. errors so far:', log.length);
  },

  async click(sel) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.click(sel, { timeout: 5000 }); console.log('click', sel, '-> OK'); }
    catch (e) { console.log('click', sel, '-> ERROR:', e.message.split('\n')[0]); }
  },

  // Real pointer hover (moves Playwright's virtual mouse there), unlike a
  // page.evaluate() dispatchEvent of mouseenter which never sets CSS :hover.
  async hover(sel) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.hover(sel, { timeout: 5000 }); console.log('hover', sel, '-> OK'); }
    catch (e) { console.log('hover', sel, '-> ERROR:', e.message.split('\n')[0]); }
  },

  async 'click-text'(text) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.getByText(text, { exact: false }).first().click({ timeout: 5000 }); console.log('click-text', JSON.stringify(text), '-> OK'); }
    catch (e) { console.log('click-text', JSON.stringify(text), '-> ERROR:', e.message.split('\n')[0]); }
  },

  async fill(rest) {
    if (!page) return console.log('ERROR: launch first');
    const [sel, ...words] = rest.split(/\s+/);
    try { await page.fill(sel, words.join(' ')); console.log('fill', sel, '-> OK'); }
    catch (e) { console.log('fill', sel, '-> ERROR:', e.message.split('\n')[0]); }
  },

  async type(text) { if (page) await page.keyboard.type(text, { delay: 20 }); },
  async press(key) { if (page) await page.keyboard.press(key); },

  async wait(sel) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.waitForSelector(sel, { timeout: 10_000 }); console.log('found:', sel); }
    catch { console.log('TIMEOUT:', sel); }
  },

  async eval(expr) {
    if (!page) return console.log('ERROR: launch first');
    try { console.log(JSON.stringify(await page.evaluate(expr))); }
    catch (e) { console.log('ERROR:', e.message); }
  },

  async text(sel) {
    if (!page) return console.log('ERROR: launch first');
    console.log(await page.evaluate(
      s => (s ? document.querySelector(s) : document.body)?.innerText ?? '(null)',
      sel || null));
  },

  errors() {
    const errs = log.filter(l => l.startsWith('[console.error]') || l.startsWith('[pageerror]'));
    console.log(errs.length ? errs.join('\n') : 'no console/page errors so far');
  },

  async quit() { if (browser) await browser.close().catch(() => {}); browser = null; page = null; },
  help() { console.log('commands:', Object.keys(COMMANDS).join(', ')); },
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'driver> ' });

// readline emits 'line' for every buffered line as fast as input arrives -
// it does NOT wait for an async handler to finish. Piping several commands
// via heredoc (the agent path below) fires them all before `launch`
// resolves unless we queue and run them one at a time ourselves.
const queue = [];
let busy = false;
let closed = false; // stdin (heredoc/pipe) hit EOF - drain the queue, then exit

async function pump() {
  if (busy) return;
  if (queue.length === 0) {
    if (closed) { await COMMANDS.quit(); process.exit(0); }
    return;
  }
  busy = true;
  const line = queue.shift();
  const [cmd, ...rest] = line.trim().split(/\s+/);
  if (cmd) {
    const fn = COMMANDS[cmd];
    if (!fn) console.log('unknown:', cmd, '- try: help');
    else { try { await fn(rest.join(' ')); } catch (e) { console.log('ERROR:', e.message); } }
  }
  busy = false;
  if (cmd === 'quit') { process.exit(0); return; } // COMMANDS.quit() already closed the browser
  // readline auto-closes itself once stdin (heredoc/pipe) hits EOF - calling
  // .prompt() after that throws ERR_USE_AFTER_CLOSE, so only prompt while live.
  if (!closed) rl.prompt();
  pump();
}

rl.on('line', line => { queue.push(line); pump(); });
rl.on('close', () => { closed = true; pump(); });

console.log('fragatto driver - "help" for commands, "launch" to start, "all" to shoot every page');
rl.prompt();
