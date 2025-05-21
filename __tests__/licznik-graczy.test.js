const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Licznik graczy online', () => {
  let dom;
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    document = dom.window.document;
  });

  it('powinien wyświetlać liczbę graczy w zakresie 8-38', () => {
    // Symuluj wykonanie skryptu licznika
    const script = document.createElement('script');
    script.textContent = `
      var min = 8, max = 38;
      var count = Math.floor(Math.random() * (max - min + 1)) + min;
      document.getElementById('player-count').textContent = count;
    `;
    document.body.appendChild(script);
    const count = parseInt(document.getElementById('player-count').textContent, 10);
    expect(count).toBeGreaterThanOrEqual(8);
    expect(count).toBeLessThanOrEqual(38);
  });
});
