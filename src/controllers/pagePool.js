const puppeteer = require("puppeteer");
const genericPool = require("generic-pool");

class PagePool {
  constructor(max, min) {
    var browser;
    const factory = {
      create: function() {
        return browser.newPage();
      },
      destroy: function(client) {},
    };

    const opts = {
      max: max ?? 4,
      min: min ?? 2,
    };

    puppeteer
      .launch({
        headless: true, // process.env['DISPLAY'] = ':0'; in index.js, xorg running.
        //ignoreDefaultArgs: true, // needed ?
        //devtools: false, // not needed so far, we can see websocket frames and xhr responses without that.
        //dumpio: true,
        //defaultViewport: null,
        args: [
          // "--enable-resource-load-scheduler=false",
          // "--disable-canvas-aa", // Disable antialiasing on 2d canvas
          // "--disable-2d-canvas-clip-aa", // Disable antialiasing on 2d canvas clips
          // "--disable-gl-drawing-for-tests", // Disable the GL output will not be correct but tests will run faster.
          // "--disable-dev-shm-usage",
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
      })
      .then((b) => {
        browser = b;
        this.pagePool = genericPool.createPool(factory, opts);
      });
  }

  async acquire() {
    return this.pagePool.acquire();
  }

  async release(page) {
    return this.pagePool.release(page);
  }
}
module.exports = PagePool;
