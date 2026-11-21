import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { H2, H3 } from '../components/content/guide-blocks';

export interface Heading {
  level: 2 | 3;
  id: string;
  text: string;
}

function textOf(node: ReactNode): string {
  let out = '';
  Children.forEach(node, c => {
    if (typeof c === 'string' || typeof c === 'number') out += c;
    else if (isValidElement(c)) out += textOf((c.props as { children?: ReactNode }).children);
  });
  return out;
}

/** Walks the element tree a guide returns, so the TOC exists in the prerendered HTML. */
export function collectHeadings(node: ReactNode, out: Heading[] = []): Heading[] {
  Children.forEach(node, child => {
    if (!isValidElement(child)) return;
    const props = child.props as { id?: string; children?: ReactNode };
    if (child.type === H2 || child.type === H3) {
      out.push({ level: child.type === H2 ? 2 : 3, id: props.id ?? '', text: textOf(props.children) });
    } else if (props.children) {
      collectHeadings(props.children, out);
    }
  });
  return out;
}