import '@webcomponents/custom-elements';
import uiid from './utils/uuid';
import PopupTabSwitcher from './PopupTabSwitcher';

const existingEl = document.querySelector('#popup-tab-switcher');
if (existingEl) {
  existingEl.remove();
}

const id = uiid();
customElements.define(`popup-tab-switcher-${id}`, PopupTabSwitcher);
const tabSwitcherEl = document.createElement(`popup-tab-switcher-${id}`);
tabSwitcherEl.id = 'popup-tab-switcher';
document.body.append(tabSwitcherEl);
