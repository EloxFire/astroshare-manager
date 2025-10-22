import type {JSX} from 'react';

import type {EditorConfig, LexicalNode, NodeKey} from 'lexical';
import {DecoratorNode} from 'lexical';

export type ImagePayload = {
  src: string;
  altText?: string;
};

type SerializedImageNode = {
  type: 'image';
  version: 1;
  src: string;
  altText: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src: string, altText?: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText ?? '';
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      src: serializedNode.src,
      altText: serializedNode.altText,
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.className = 'rich-editor__image-wrapper';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        className="rich-editor__image"
      />
    );
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  const {src, altText} = payload;
  return new ImageNode(src, altText);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
