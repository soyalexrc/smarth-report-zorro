module.exports = {
  port: 8000,
  server: {
    baseDir: 'dist/smarth-report-zorro',
    middleware: {
      // overrides the second middleware default with new settings
      1: require('connect-history-api-fallback')({
        index: '/index.html',
        verbose: true,
      }),
    },
  },
};
