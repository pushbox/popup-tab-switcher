/* eslint-disable no-undef */
import browser from 'webextension-polyfill';

const overlay = document.createElement('div');
overlay.className = 'popup-tab-switcher';

const card = document.createElement('pre');
card.className = 'popup-tab-switcher__card';

overlay.append(card);
document.body.append(overlay);

function hideOverlay() {
  overlay.style.display = 'none';
}

function showOverlay() {
  overlay.style.display = 'flex';
}

function getTabElements(tabs, selectedId) {
  return tabs.map(({ title }, i) => {
    const tabEl = document.createElement('div');
    tabEl.className = 'popup-tab-switcher__tab';
    if (i === selectedId) {
      tabEl.classList.add('popup-tab-switcher__tab--selected');
    }
    tabEl.textContent = title;
    return tabEl;
  });
}

function renderTabs(tabs, selectedId) {
  card.innerHTML = '';
  const tabElements = getTabElements(tabs, selectedId);
  for (const tabElement of tabElements) {
    card.append(tabElement);
  }
  showOverlay();
}

let selectedTabIndex = 0;
let tabsArray;

/**
 * Restricts result of a number increment between [0, maxInteger - 1]
 */
function rangedIncrement(number, increment, maxInteger) {
  return (number + (increment % maxInteger) + maxInteger) % maxInteger;
}

function selectNextTab() {
  selectedTabIndex = rangedIncrement(selectedTabIndex, +1, tabsArray.length);
  renderTabs(tabsArray, selectedTabIndex);
}

function selectPreviousTab() {
  selectedTabIndex = rangedIncrement(selectedTabIndex, -1, tabsArray.length);
  renderTabs(tabsArray, selectedTabIndex);
}

browser.runtime.onMessage.addListener(({ type, tabsData }) => {
  if (type === 'update') {
    tabsArray = tabsData;
  } else if (type === 'next') {
    selectNextTab();
  } else if (type === 'previous') {
    selectPreviousTab();
  }
});

overlay.addEventListener('click', hideOverlay);

document.addEventListener('keyup', ({ key }) => {
  if (key === 'Alt') {
    hideOverlay();
  }
});
