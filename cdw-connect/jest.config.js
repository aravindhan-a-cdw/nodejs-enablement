module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["services/**/*.js", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/"],
};
