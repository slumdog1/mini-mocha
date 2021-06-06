const assert = require('assert');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
it('a', async () => {await sleep(8000);assert.equal(await Promise.resolve(1), 0)});
it('b', async () => {await sleep(8000);assert.equal(await Promise.resolve(0), 0)});
