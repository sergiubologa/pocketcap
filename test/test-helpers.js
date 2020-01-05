function testEnd(message, assert){
    return (err, res) => {
        if (err) return assert.fail(message);
        assert.pass(message);
        assert.end();
    };
}

module.exports = {
    testEnd: testEnd
};