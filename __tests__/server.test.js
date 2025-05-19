const request = require('supertest');
const express = require('express');

// Import or recreate the app for testing
let app;
beforeAll(() => {
  app = require('../server');
});

describe('Strona główna', () => {
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

describe('Podstrony pakietów', () => {
  it('GET /benefactor-packages.html powinno zwracać 200', async () => {
    const res = await request(app).get('/benefactor-packages.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Pakiet/);
  });
  it('GET /ubermacht-packages.html powinno zwracać 200', async () => {
    const res = await request(app).get('/ubermacht-packages.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Pakiet/);
  });
  it('GET /vapid-packages.html powinno zwracać 200', async () => {
    const res = await request(app).get('/vapid-packages.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Pakiet/);
  });
  it('GET /custom-paints.html powinno zwracać 200', async () => {
    const res = await request(app).get('/custom-paints.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Malowania/);
  });
  it('GET /combat-vehicles.html powinno zwracać 200', async () => {
    const res = await request(app).get('/combat-vehicles.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Bojówkarskie|Bojowe/);
  });
});
