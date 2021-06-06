const assert = require('assert');

describe('suite', () => {
  let counter = 0;
  beforeEach(() => counter++);
  it('a', () => assert.equal(counter, 2));
  it('b', () => assert.equal(counter, 4));
  it('c', () => assert.equal(counter, 6));
  describe('sub-suite', () => {
    let counter2;
    beforeEach(() => (counter2 = counter));
    it('a', () => assert.equal(counter2, 8));
    it('b', () => assert.equal(counter2, 10));
    it('c', () => assert.equal(counter2, 12));
  });
  beforeEach(() => counter++);
});
