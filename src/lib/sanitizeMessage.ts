import DOMPurify from 'dompurify';
import showdown from 'showdown';

import { allowUrl } from '../allowlist';

const converter = new showdown.Converter();

const so = (option: string) => {
  converter.setOption(option, true);
};

[
  'underline',
  'strikethrough',
  'emoji',
  'tables',
  'tasklists',
  'smoothLivePreview',
  'openLinksInNewWindow',
  'simplifiedAutoLink',
].forEach(so);

interface MessageNode extends Element {
  maxLevel: boolean;
  nestLevel: number;
}

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  const messageNode = node as MessageNode;
  const parentMessageNode = (messageNode.parentElement as unknown as MessageNode);
  if (messageNode.maxLevel || parentMessageNode?.maxLevel) return;
  if (parentMessageNode) {
    parentMessageNode.nestLevel = parentMessageNode.nestLevel || 0;
    messageNode.nestLevel = parentMessageNode.nestLevel + 1;
  }
  if (messageNode.nestLevel - 1 >= 10) {
    messageNode.maxLevel = true;
    const getInnerMostNode = (innerNode) => {
      if (innerNode.children && innerNode.children.length) {
        return getInnerMostNode(innerNode.children[0]);
      }
      return innerNode;
    };
    node.innerHTML = getInnerMostNode(node).outerHTML;
  }
  if (node.tagName === 'IMG' && node.parentElement?.tagName !== 'SPAN' && !node.getAttribute('data-wrapped')) {
    node.setAttribute('data-wrapped', 'true');
    node.outerHTML = `<span data-wrapper="true" data-title="${node.getAttribute('alt')}">${node.outerHTML}</span>`;
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.hasAttribute('src')) {
    const src = node.getAttribute('src') || '';
    if (!allowUrl(src)) {
      node.setAttribute('src', 'https://i.giphy.com/media/xUPGcl3ijl0vAEyIDK/giphy.webp');
    } else if (node.parentElement?.tagName !== 'SPAN') {
      node.setAttribute('title', node.getAttribute('alt') || '');
    }
  }
});

export default function sanitizeMessage(message: string, trusted: boolean) {
  if (trusted) {
    return DOMPurify.sanitize(converter.makeHtml(message), {
      FORBID_ATTR: ['style', 'size', 'onerror', 'onload', 'class'],
      FORBID_TAGS: [
        'svg',
        'dialog',
        'canvas',
        'table',
        'script',
        'audio',
        'video',
        'style',
        'iframe',
        'object',
        'embed',
        'textarea',
        'frame',
        'frameset',
        'meta',
      ],
    });
  }
  return DOMPurify.sanitize(converter.makeHtml(message), {
    ALLOWED_TAGS: ['img', 'font', 'big', 'small', 'mark', 'span'],
    ALLOWED_ATTR: ['src', 'color', 'face', 'dir', 'title', 'alt'],
  });
}
