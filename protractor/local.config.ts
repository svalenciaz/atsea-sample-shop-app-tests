import { browser, Config } from 'protractor';
import dotenv = require('dotenv');
dotenv.config();

export const config: Config = {
  framework: 'mocha',
  specs: ['../test/ui/**/*.spec.ts'],
  seleniumAddress: 'http://0.0.0.0:4444',
  SELENIUM_PROMISE_MANAGER : false,
  mochaOpts: {
    reporter: 'mochawesome-screenshots',
    reporterOptions: {
      reportDir: 'report/report-ui',
      reportName: 'index',

      clearOldScreenshots: true,
      multiReport: true
  },
    timeout: 100000,
  },
  onPrepare: async () => {
    await browser.waitForAngularEnabled(false);
    await browser.manage().window().maximize();
    browser.manage().timeouts().implicitlyWait(0);
  },
  multiCapabilities: [{
    browserName: 'firefox',
    name: 'firefox-tests',
    shardTestFiles: true,
    acceptInsecureCerts: true,
    maxInstances: 1,
  }, {
    browserName: 'chrome',
    name: 'chrome-tests',
    shardTestFiles: true,
    maxInstances: 1,
    acceptInsecureCerts: true,
    chromeOptions: {
      args: [
        '--disable-popup-blocking',
        '--no-default-browser-check',
        '--ignore-certificate-errors',
      ],
    },
  }],
};
