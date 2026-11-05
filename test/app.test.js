import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();
let originalInfo;
let originalError;

before(() => {
  originalInfo = console.info;
  originalError = console.error;
  console.info = () => {};
  console.error = () => {};
});

after(() => {
  console.info = originalInfo;
  console.error = originalError;
});

describe('HTTP service', () => {
  it('returns a healthy status', async () => {
    const response = await request(app).get('/health').expect(200);
    assert.equal(response.body.status, 'ok');
    assert.equal(Number.isNaN(Date.parse(response.body.timestamp)), false);
  });

  it('returns the API welcome response', async () => {
    const response = await request(app).get('/api/v1').expect(200);
    assert.match(response.body.message, /API is running/);
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(app).get('/missing').expect(404);
    assert.equal(response.body.error.message, 'Route not found.');
  });

  it('rejects malformed JSON with a client error', async () => {
    await request(app)
      .post('/api/v1/example')
      .set('Content-Type', 'application/json')
      .send('{')
      .expect(400);
  });
});
