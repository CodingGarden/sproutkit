module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      customFileProtocol: './',
      builderOptions: {
        appId: 'com.codinggarden.sproutkit',
      },
    },
  },
};
