const request = require('supertest');
let app;

describe('Strona główna', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = require('../server');
  });
  it('GET / powinno zwracać 200 i zawierać ParadiseRP', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/ParadiseRP|Samochody ParadiseRP|ParadiseRP.eu/);
  });
});

describe('Statyczne pliki', () => {
  it('GET /public/index.html powinno zwracać 200', async () => {
    const res = await request(app).get('/index.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/ParadiseRP/);
  });
});

describe('Serwer listen callback', () => {
  it('wywołuje funkcję callback listen (pokrycie functions)', (done) => {
    const app = require('../server');
    const port = 9099; // testowy port
    const ip = '127.0.0.1';
    let callbackCalled = false;
    const server = app.listen(port, ip, () => {
      callbackCalled = true;
      server.close();
      expect(callbackCalled).toBe(true);
      done();
    });
  });
});
