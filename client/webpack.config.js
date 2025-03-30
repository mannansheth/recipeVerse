module.exports = {
  resolve: {
    fallback: {
      "console": require.resolve("console-browserify"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/")
    }
  }
};
