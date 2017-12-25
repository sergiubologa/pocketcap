const test = require('tape');
const request = require('supertest');
const testHelpers = require('test/test-helpers');

const app = require('app');

test('get /api', assert => {
    request(app)
        .get('/api')
        .expect(200)
        .expect(response => {
            assert.equal(response.body.message, 'api is alive!');
        })
        .end(testHelpers.testEnd('should return 200 OK', assert));
});

test('get coin data', assert => {
    request(app)
        .get('/api/coins/cardano')
        .expect(200)
        .expect(response => {
            assert.ok(response.body, 'Response should be truthy');
            assert.equal(response.body[0].username, 'cardano');
        })
        .end(testHelpers.testEnd('should return 200 OK', assert));
});

test('get not existing endpoint', assert => {
    request(app)
        .get('/some/url/that/will/never/exist')
        .expect(200)
        .expect(response => {
            // assert.ok(response.body, 'Response should be truthy');
            // assert.equal(response.body[0].username, 'cardano');
        })
        .end(testHelpers.testEnd('should return 200 OK', assert));
});