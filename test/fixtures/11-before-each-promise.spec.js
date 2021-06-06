const assert = require('assert');

describe('suite', () => {
  let counter = 0;
  beforeEach(async () => (counter = counter + (await Promise.resolve(1))));
  it('a', async () => assert.equal(counter, await Promise.resolve(1)));
  it('b', async () => assert.equal(counter, await Promise.resolve(2)));
  it('c', async () => assert.equal(counter, await Promise.resolve(3)));
});
