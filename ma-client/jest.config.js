module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts'],
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
        '\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!@ma-dev)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^Shared/(.*)$': '<rootDir>/../shared/$1'
    },
    snapshotSerializers: ['jest-serializer-vue'],
    testMatch: [
        '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
    ],
    collectCoverageFrom: ['src/common/**/*.{js,vue}', 'src/components/**/*.{js,vue}', 'src/pages/main/**/*.{js,vue}'],
    coverageDirectory: '<rootDir>/coverage',
    'collectCoverage': true,
    'coverageReporters': [
        'lcov',
        'text-summary'
    ],
    testURL: 'http://localhost/'
};

