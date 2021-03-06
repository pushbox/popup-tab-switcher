import path from 'path';

const webPagesDir = path.resolve(__dirname, '..', 'web-pages');
export function getPagePath(pageFileName) {
  return `file:${path.resolve(webPagesDir, pageFileName)}`;
}

const pageMixin = {
  async queryPopup(queryString, resultFn) {
    // NOTE: This awful string was created because other ways for selecting
    // elements in shadow root did not work. It would be great to rewrite this part
    return this.evaluate(
      `(${resultFn})(Array.from(document.querySelector('#popup-tab-switcher').shadowRoot.querySelectorAll('${queryString}')))`
    );
  },
};

function isBlank(page) {
  return page.url() === 'about:blank';
}

export default class PuppeteerPopupHelper {
  constructor(browser) {
    this.browser = browser;
  }

  async getActiveTab() {
    const pages = await this.browser.pages();
    // eslint-disable-next-line no-undef
    const promises = pages.map((p, i) =>
      p.evaluate((index) => document.visibilityState === 'visible' && index, `${i}`)
    );
    const firstActivePage = pages[(await Promise.all(promises)).find((i) => i)];
    return Object.assign(firstActivePage, pageMixin);
  }

  async selectTabForward() {
    const page = await this.getActiveTab();
    await page.keyboard.down('Alt');
    await page.keyboard.press('KeyY');
  }

  async selectTabBackward() {
    const page = await this.getActiveTab();
    await page.keyboard.down('Alt');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyY');
  }

  async switchToSelectedTab() {
    const page = await this.getActiveTab();
    await page.keyboard.up('Alt');
    await page.keyboard.up('Shift');
  }

  async switchTab(times = 1) {
    for (let i = 0; i < times; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.selectTabForward();
    }
    await this.switchToSelectedTab();
    return this.getActiveTab();
  }

  async openPage(pageFileName, existingPage) {
    let page = existingPage;
    if (!page) {
      const [firstPage] = await this.browser.pages();
      if (isBlank(firstPage)) {
        page = firstPage;
      } else {
        page = await this.browser.newPage();
      }
    }
    await page.goto(getPagePath(pageFileName));
    await page.bringToFront();
    return Object.assign(page, pageMixin);
  }
}
