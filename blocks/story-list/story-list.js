import {
  getLanguage, adjustImageSize, fetchSearch, CATEGORY_STORIES,
} from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

async function printList(list) {
  const placeholders = await fetchPlaceholders(`/${getLanguage()}`);
  const getListHTML = (row) => `<div class="story-image"><img alt="${row.shorttitle}" src="${row.image}" width="300" height="218"></div>
            <div class="story-content">
                <div class="story-title"><a href="${row.path}" title="${row.shorttitle}" aria-label="${row.shorttitle}">${row.shorttitle}</a></div>
                <p class="story-desc">${row.description}</p>
                <a href="${row.path}" title="${row.shorttitle}" aria-label="${row.shorttitle}" class="button primary">${placeholders.readmore}</a>
            </div>`;

  const ul = document.createElement('ul');
  list.forEach((row) => {
    row.image = adjustImageSize(row.image, 300);
    const li = document.createElement('li');
    li.classList.add('story');
    li.innerHTML = getListHTML(row);

    ul.append(li);
  });
  return ul;
}

export default async function decorate(block) {
  const list = await fetchSearch(CATEGORY_STORIES);

  block.textContent = '';
  if (list.length > 0) {
    const objects = await printList(list);
    block.append(objects);
  } else {
    block.append('no result found');
  }
}
