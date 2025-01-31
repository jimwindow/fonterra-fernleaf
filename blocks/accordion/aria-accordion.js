import { toClassName } from '../../scripts/lib-franklin.js';

const HEADINGS_SELECTOR = 'h1,h2,h3,h4,h5,h6';

export const constants = {
  tagName: 'hlx-aria-accordion',
};

export class AriaAccordion extends HTMLElement {
  connectedCallback() {
    this.selectedIndex = 0;
    this.itemsCount = this.children.length;
    this.decorate();
    this.attachListeners();
    const firstAccordion = document.querySelector('.accordion-section:first-of-type h4 button');
    if (firstAccordion) {
      this.toggleItem(firstAccordion);
    }
  }

  attachListeners() {
    const items = this.querySelectorAll('button[aria-expanded]');
    items.forEach((item) => {
      item.addEventListener('click', this.handleClick);
      item.addEventListener('keydown', this.handleKeyDown);
    });
  }

  handleClick = (ev) => {
    this.toggleItem(ev.currentTarget);
    if (!ev.detail) {
      ev.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  handleKeyDown = (ev) => {
    switch (ev.key) {
      case 'Home':
        ev.preventDefault();
        this.focusItem(0);
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.focusItem(this.selectedIndex - 1);
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.focusItem(this.selectedIndex + 1);
        break;
      case 'End':
        ev.preventDefault();
        this.focusItem(this.itemsCount - 1);
        break;
      default:
        break;
    }
  };

  async decorate() {
    let idBtn;
    let idPnl;
    const previousHeadings = [...document.querySelectorAll(HEADINGS_SELECTOR)]
      // eslint-disable-next-line no-bitwise
      .filter((h) => h.compareDocumentPosition(this) & Node.DOCUMENT_POSITION_FOLLOWING);
    const headingLevel = previousHeadings.length
      ? Number(previousHeadings.pop().tagName.substring(1)) + 1
      : 1;
    [...this.children].forEach((el, i) => {
      idBtn = Math.random().toString(32).substring(2);
      idPnl = Math.random().toString(32).substring(2);

      const button = document.createElement('button');
      button.id = idBtn;
      button.setAttribute('aria-expanded', false);
      button.setAttribute('aria-controls', idPnl);
      button.setAttribute('tabindex', i === this.selectedIndex ? 0 : -1);
      if (el.firstElementChild.matches(HEADINGS_SELECTOR)) {
        button.append = el.firstElementChild.innerHTML;
        el.firstElementChild.innerHTML = '';
        el.firstElementChild.append(button);
      } else {
        button.append(el.firstElementChild);
        const heading = document.createElement(`h${headingLevel}`);
        heading.id = toClassName(button.textContent);
        heading.append(button);
        el.prepend(heading);
      }

      const panel = document.createElement('div');
      panel.id = idPnl;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-hidden', true);
      panel.setAttribute('aria-labelledby', idBtn);
      panel.append(el.firstElementChild.nextElementSibling);
      el.append(panel);
    });
  }

  toggleAll(visible) {
    this.querySelectorAll('button[aria-expanded]').forEach((btn) => {
      btn.setAttribute('aria-expanded', visible);
      btn.parentElement.nextElementSibling.setAttribute('aria-hidden', !visible);
    });
  }

  toggleItem(el) {
    const expanded = el.getAttribute('aria-expanded') === 'true';
    this.toggleAll(false);
    const index = [...this.querySelectorAll('button[aria-expanded]')].indexOf(el);
    if (index !== this.selectedIndex) {
      this.focusItem(index);
    }
    el.setAttribute('aria-expanded', !expanded);
    el.parentElement.nextElementSibling.setAttribute('aria-hidden', expanded);
  }

  focusItem(index) {
    let rotationIndex = index;
    if (index < 0) {
      rotationIndex = this.itemsCount - 1;
    } else if (index > this.itemsCount - 1) {
      rotationIndex = 0;
    }
    const buttons = this.querySelectorAll('button[aria-expanded]');
    buttons[this.selectedIndex].setAttribute('tabindex', -1);
    this.selectedIndex = rotationIndex;
    buttons[this.selectedIndex].setAttribute('tabindex', 0);
    buttons[this.selectedIndex].focus();
  }
}

customElements.define(constants.tagName, AriaAccordion);
