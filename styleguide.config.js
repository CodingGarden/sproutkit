module.exports = {
  title: 'SproutKit',
  exampleMode: 'expand',
  editorConfig: { theme: 'monokai' },
  simpleEditor: false,
  components: 'src/components/**/**.vue',
  template: {
    // TODO: update versions...
    head: {
      links: [{
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/css/flag-icon.min.css',
      }, {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/fontawesome.min.css',
      }, {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/brands.min.css',
      }],
    },
  },
};
