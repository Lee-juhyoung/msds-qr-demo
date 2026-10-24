'use strict';

(() => {
  const data = window.MSDS_DATA;
  const id = new URLSearchParams(window.location.search).get('id');
  const item = data && Array.isArray(data.items) ? data.items.find(entry => entry.id === id) : null;
  if (!item) {
    document.getElementById('not-found').hidden = false;
    document.title = '자료를 찾을 수 없습니다 · MSDS 자료실';
    return;
  }
  const setText = (id, value) => { document.getElementById(id).textContent = value; };
  const setLink = (id, value) => { document.getElementById(id).href = value; };
  const labeledAsset = path => `${path}?v=center-1`;
  const pageCount = Number.isInteger(Number(item.pageCount)) && Number(item.pageCount) > 0 ? Number(item.pageCount) : 0;
  document.title = `${item.name} · MSDS 자료실`;
  setText('document-title', item.name);
  setText('document-category', item.category || '안전자료');
  setText('document-manufacturer', `제조·공급사 · ${item.manufacturer || '미확인'}`);
  setText('revision-date', item.revisionDate || '문서에서 확인');
  setText('collection-date', data.checkedAt || '미확인');
  setText('page-count', `${pageCount}쪽${item.language === 'English' ? ' · 영문 원문' : ''}`);
  setText('preview-count', `전체 ${pageCount}쪽`);
  setLink('open-pdf', item.pdf);
  setLink('download-pdf', item.pdf);
  setLink('open-cover', `${item.cover}?v=add-3`);
  setLink('open-safety-summary', `summaries/${encodeURIComponent(item.id)}.pdf?v=add-3`);
  setLink('download-qr', labeledAsset(item.qr));
  document.getElementById('download-qr').download = `${item.id}-qr.png`;
  document.getElementById('product-qr').src = labeledAsset(item.qr);
  document.getElementById('product-qr').alt = `${item.name} MSDS 페이지로 연결되는 QR 코드`;
  const source = item.sourcePageUrl || item.sourceUrl;
  try {
    const url = new URL(source);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported source');
    setLink('official-source', url.href);
  } catch (_) {
    document.getElementById('official-source').hidden = true;
  }
  const pages = document.getElementById('preview-pages');
  for (let page = 1; page <= pageCount; page += 1) {
    const figure = document.createElement('figure');
    figure.className = 'preview-page';
    const caption = document.createElement('figcaption');
    caption.textContent = `${page} / ${pageCount} 페이지`;
    const img = document.createElement('img');
    img.src = `previews/${encodeURIComponent(item.id)}/page-${String(page).padStart(3, '0')}.webp`;
    img.alt = `${item.name} 물질안전보건자료 ${page}페이지. 텍스트 내용은 원문 PDF에서 확인할 수 있습니다.`;
    img.loading = page === 1 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      img.hidden = true;
      const error = document.createElement('p');
      error.className = 'preview-error';
      error.textContent = '이 페이지의 미리보기를 불러오지 못했습니다. 상단의 원문 PDF를 열어 확인해 주세요.';
      figure.append(error);
    }, { once: true });
    figure.append(caption, img);
    pages.append(figure);
  }
  if (!pageCount) {
    const message = document.createElement('p');
    message.className = 'preview-error';
    message.textContent = '미리보기가 없습니다. 원문 PDF를 열어 확인해 주세요.';
    pages.append(message);
  }
  document.getElementById('document-content').hidden = false;
})();
