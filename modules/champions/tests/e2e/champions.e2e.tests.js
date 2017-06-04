'use strict';

describe('Champions E2E Tests:', function () {
  describe('Test Champions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/champions');
      expect(element.all(by.repeater('champion in champions')).count()).toEqual(0);
    });
  });
});
