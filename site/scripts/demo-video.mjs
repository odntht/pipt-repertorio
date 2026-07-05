// Demo video do PIPT Repertório usando Playwright.
// Roda contra o dev server local em http://localhost:4321.
//
// Uso: node scripts/demo-video.mjs
// Requer: dev server rodando; Playwright chromium instalado.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../../demo');
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: outDir,
      size: { width: 1280, height: 800 },
    },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // Helper pra clicar em botão por atributo aria-label
  // Usa .first() porque o controle flutuante duplica alguns aria-labels.
  const clickAria = (label) => page.locator(`[aria-label="${label}"]`).first().click();

  console.log('▶ 1/8: Home');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await sleep(2500);

  console.log('▶ 2/8: Clica "Ver a 1 música do repertório"');
  await page.getByRole('link', { name: /Ver a 1 música/ }).click();
  await page.waitForURL('**/musicas');
  await sleep(2000);

  console.log('▶ 3/8: Clica na música');
  await page.getByRole('link', { name: /Nada Além do Sangue/ }).click();
  await page.waitForURL(/musicas\/nada-alem-do-sangue/);
  await sleep(3000);

  console.log('▶ 4/8: Sobe tom pra G# e A');
  await clickAria('Subir meio tom');
  await sleep(1500);
  await clickAria('Subir meio tom');
  await sleep(1500);

  console.log('▶ 5/8: Volta pra G e desce pra Gb (flat)');
  await clickAria('Descer meio tom');
  await sleep(1000);
  await clickAria('Descer meio tom');
  await sleep(1500);
  await clickAria('Descer meio tom');
  await sleep(2500);

  console.log('▶ 6/8: Toggle Graus');
  await page.getByRole('button', { name: 'Graus' }).click();
  await sleep(3500);
  await page.getByRole('button', { name: 'Graus' }).click();
  await sleep(1500);

  console.log('▶ 7/8: Aumenta fonte');
  await page.getByRole('button', { name: 'A+' }).click();
  await page.getByRole('button', { name: 'A+' }).click();
  await sleep(2000);
  await page.getByRole('button', { name: 'A-' }).click();
  await page.getByRole('button', { name: 'A-' }).click();
  await sleep(1000);

  console.log('▶ 8/8: Auto-scroll rápido — mostra o resto da música');
  await clickAria('Aumentar velocidade');
  await clickAria('Aumentar velocidade');
  await clickAria('Aumentar velocidade');
  await clickAria('Aumentar velocidade');
  await clickAria('Aumentar velocidade');
  await sleep(6500);
  // Para o scroll
  for (let i = 0; i < 5; i++) await clickAria('Diminuir velocidade');
  await sleep(1500);

  console.log('▶ Fim');
  await context.close();
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
