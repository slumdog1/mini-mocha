const assert = require('assert');

describe('suite', () => {
  let counter = 0;
  beforeEach(() => counter++);
  it('a', () => assert.equal(counter, 2));
  it('b', () => assert.equal(counter, 4));
  it('c', () => assert.equal(counter, 6));
  beforeEach(() => counter++);
});
