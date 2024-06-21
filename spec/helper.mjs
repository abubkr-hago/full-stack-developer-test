await import('../index.js');

export const mochaHooks = {
  beforeAll: function () {
    return Parse.Config.get(); // ensure server to started before starting tests
  },
};
