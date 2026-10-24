'use strict';

(() => {
  const data = window.MSDS_DATA;
  const items = data && Array.isArray(data.items) ? data.items : [];
  const list = document.getElementById('document-list');
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');
  document.getElementById('checked-at').textContent = data?.checkedAt || '미확인';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  [...new Set(items.map(item => item.category).filter(Boolean))].forEach(value => {
    const option = element('option', '', value);
    option.value = value;
    category.append(option);
  });

  function render() {
    const query = search.value.trim().toLocaleLowerCase('ko');
    const filtered = items.filter(item => {
      const text = [item.name, item.manufacturer, item.category].join(' ').toLocaleLowerCase('ko');
      return (!query || text.includes(query)) && (!category.value || item.category === category.value);
    });
    list.replaceChildren();
    filtered.forEach(item => {
      const row = element('article', 'document-row');
      const number = element('span', 'document-number', String(items.indexOf(item) + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      const body = element('div', 'document-row-body');
      body.append(element('span', 'category-tag', item.category || '안전자료'));
      const heading = element('h3');
      const link = element('a', 'document-title-link', item.name);
      link.href = `document.html?id=${encodeURIComponent(item.id)}`;
      heading.append(link);
      body.append(heading, element('p', 'document-row-manufacturer', item.manufacturer || '제조·공급사 미확인'));
      const metadata = element('div', 'document-row-meta');
      metadata.append(element('span', 'meta-label', '문서 개정일'), element('strong', '', item.revisionDate || '문서에서 확인'), element('span', 'page-label', `${item.pageCount || '—'}쪽 · PDF`));
      const arrow = element('span', 'row-arrow', '↗');
      arrow.setAttribute('aria-hidden', 'true');
      row.append(number, body, metadata, arrow);
      list.append(row);
    });
    count.textContent = `${filtered.length}개 표시 / 전체 ${items.length}개`;
    empty.hidden = filtered.length !== 0;
    if (!items.length) empty.textContent = '자료 목록을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.';
  }
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  render();
})();
