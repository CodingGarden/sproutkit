module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './',
      builderOptions: {
        appId: 'com.codinggarden.sproutkit',
      },
    },
  },
};
