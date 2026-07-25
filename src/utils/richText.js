export const sanitizeHtml = (html) => {
  if (!html) return '';
  const template = document.createElement('template');
  template.innerHTML = html;
  const allowedTags = [
    'B',
    'STRONG',
    'I',
    'EM',
    'U',
    'A',
    'P',
    'DIV',
    'BR',
    'UL',
    'OL',
    'LI',
    'FIGURE',
    'FIGCAPTION',
    'IMG',
    'SPAN',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'BLOCKQUOTE',
  ];
  const allowedAttrs = {
    A: ['href', 'target', 'rel'],
    SPAN: ['style'],
    IMG: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  };

  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (!allowedTags.includes(child.tagName)) {
        child.replaceWith(...child.childNodes);
      } else {
        [...child.attributes].forEach((attr) => {
          const allowed = allowedAttrs[child.tagName] || [];
          if (!allowed.includes(attr.name)) child.removeAttribute(attr.name);
        });
        if (child.tagName === 'A') {
          const href = child.getAttribute('href') || '';
          if (!href.startsWith('http') && !href.startsWith('/')) child.removeAttribute('href');
          child.setAttribute('rel', 'noopener noreferrer');
          child.setAttribute('target', '_blank');
        }
      }
      walk(child);
    });
  };

  walk(template.content);
  return template.innerHTML;
};
