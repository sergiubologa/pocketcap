const test = require('tape');
const request = require('supertest');
const app = require('app');
const testHelpers = require('test/test-helpers');
const mongooseConnector = require('db/mongoose-connector');

test('get /api', assert => {
    assert.plan(2);
    request(app)
        .get('/api')
        .expect(200)
        .expect(response => {
            assert.equal(response.body.message, 'api is alive!');
        })
        .end(testHelpers.testEnd('should return 200 OK', assert));
});

test('get coins data', assert => {
    assert.plan(5);
    request(app)
        .get('/api/coins')
        .expect(200)
        .expect(response => {
            assert.ok(response.body, 'Response should be truthy');
            assert.ok(response.body.added_at, 'Last update date should be there');
            assert.ok(response.body.data, 'Coins should be there');
            assert.equal(response.body.data[0].id, 'bitcoin');
        })
        .end(testHelpers.testEnd('should return 200 OK', assert));
});

test('get not existing endpoint', assert => {
    assert.plan(1);
    request(app)
        .get('/some/url/that/will/never/exist')
        .expect(200)
        .expect(response => {
            // assert.ok(response.body, 'Response should be truthy');
            // assert.equal(response.body[0].username, 'cardano');
        })
        .end(testHelpers.testEnd('should return 200 OK', assert));
});

// Close the open DB connection otherwise Tape would not exit the tests
test.onFinish(() => mongooseConnector.disconnectIfNeeded());