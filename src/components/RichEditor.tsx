import {useCallback, useEffect, useState} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import type {InitialConfigType} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';

import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type EditorThemeClasses,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import {HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode, $isHeadingNode} from '@lexical/rich-text';
import {mergeRegister} from '@lexical/utils';
import {$isLinkNode, LinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$setBlocksType} from '@lexical/selection';
import {CodeNode, $createCodeNode} from '@lexical/code';

import '../styles/components/rich-editor.scss';
import ImagesPlugin, {INSERT_IMAGE_COMMAND, type InsertImagePayload} from './plugins/ImagesPlugin';
import {ImageNode} from './plugins/ImageNode';

const theme: EditorThemeClasses = {
  root: 'rich-editor__editor',
  paragraph: 'rich-editor__paragraph',
  quote: 'rich-editor__quote',
  code: 'rich-editor__code',
  list: {
    listitem: 'rich-editor__list-item',
    nested: {
      listitem: 'rich-editor__list-item--nested',
    },
    ol: 'rich-editor__list--ordered',
    ul: 'rich-editor__list',
  },
  text: {
    bold: 'rich-editor__text--bold',
    italic: 'rich-editor__text--italic',
    underline: 'rich-editor__text--underline',
    strikethrough: 'rich-editor__text--strike',
    code: 'rich-editor__text--code',
  },
};

function onError(error: Error) {
  console.error(error);
}

const Placeholder = () => (
  <div className="rich-editor__placeholder">Commencez à écrire votre contenu...</div>
);

type BlockType = 'paragraph' | 'bullet' | 'number' | 'quote' | 'code' | 'h1' | 'h2' | 'h3';
const selectableBlockTypes: BlockType[] = ['paragraph', 'h1', 'h2', 'h3', 'quote', 'code'];

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsCode(selection.hasFormat('code'));

    const anchorNode = selection.anchor.getNode();
    const topElement =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
    const parent = anchorNode.getParent();

    if ($isLinkNode(anchorNode) || $isLinkNode(parent)) {
      setIsLink(true);
    } else {
      setIsLink(false);
    }

    if ($isListNode(topElement)) {
      const listType = topElement.getListType();
      if (listType === 'bullet' || listType === 'number') {
        setBlockType(listType);
      } else {
        setBlockType('paragraph');
      }
      return;
    }

    const type = topElement.getType();

    if ($isHeadingNode(topElement)) {
      setBlockType(topElement.getTag() as BlockType);
      return;
    }

    if (type === 'quote' || type === 'code') {
      setBlockType(type);
    } else {
      setBlockType('paragraph');
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const toggleBulletList = () => {
    if (blockType === 'bullet') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const toggleNumberList = () => {
    if (blockType === 'number') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const applyBlockFormat = (format: BlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }

      switch (format) {
        case 'paragraph':
          $setBlocksType(selection, () => $createParagraphNode());
          break;
        case 'quote':
          $setBlocksType(selection, () => $createQuoteNode());
          break;
        case 'code':
          $setBlocksType(selection, () => $createCodeNode());
          break;
        case 'h1':
        case 'h2':
        case 'h3':
          $setBlocksType(selection, () => $createHeadingNode(format));
          break;
        default:
          $setBlocksType(selection, () => $createParagraphNode());
          break;
      }
    });
  };

  const toggleLink = useCallback(() => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }

    const url = window.prompt('Entrez l’URL du lien :');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
    }
  }, [editor, isLink]);

  const insertImage = useCallback(() => {
    const url = window.prompt('Entrez l’URL de votre image :');
    if (!url) {
      return;
    }

    const payload: InsertImagePayload = {
      src: url.trim(),
      altText: 'Image insérée',
    };

    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  }, [editor]);

  const selectableValue = selectableBlockTypes.includes(blockType)
    ? blockType
    : 'paragraph';

  return (
    <div className="rich-editor__toolbar" role="toolbar" aria-label="Outils de formatage">
      <label className="rich-editor__visually-hidden" htmlFor="rich-editor-block-select">
        Sélection du format de bloc
      </label>
      <select
        id="rich-editor-block-select"
        className="rich-editor__toolbar-select"
        value={selectableValue}
        onChange={(event) => {
          const format = event.target.value as BlockType;
          applyBlockFormat(format);
        }}
      >
        <option value="paragraph">Paragraphe</option>
        <option value="h1">Titre niveau 1</option>
        <option value="h2">Titre niveau 2</option>
        <option value="h3">Titre niveau 3</option>
        <option value="quote">Citation</option>
        <option value="code">Bloc de code</option>
      </select>
      <span className="rich-editor__toolbar-separator" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`rich-editor__toolbar-button${isBold ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={() => formatText('bold')}
        aria-label="Mettre en gras"
        aria-pressed={isBold}
      >
        Gras
      </button>
      <button
        type="button"
        className={`rich-editor__toolbar-button${isItalic ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={() => formatText('italic')}
        aria-label="Mettre en italique"
        aria-pressed={isItalic}
      >
        Italique
      </button>
      <button
        type="button"
        className={`rich-editor__toolbar-button${isUnderline ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={() => formatText('underline')}
        aria-label="Souligner"
        aria-pressed={isUnderline}
      >
        Souligner
      </button>
      <button
        type="button"
        className={`rich-editor__toolbar-button${isCode ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={() => formatText('code')}
        aria-label="Mettre en code"
        aria-pressed={isCode}
      >
        Code
      </button>
      <span className="rich-editor__toolbar-separator" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`rich-editor__toolbar-button${blockType === 'bullet' ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={toggleBulletList}
        aria-label="Liste à puces"
        aria-pressed={blockType === 'bullet'}
      >
        Puces
      </button>
      <button
        type="button"
        className={`rich-editor__toolbar-button${blockType === 'number' ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={toggleNumberList}
        aria-label="Liste numérotée"
        aria-pressed={blockType === 'number'}
      >
        Numérotée
      </button>
      <span className="rich-editor__toolbar-separator" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`rich-editor__toolbar-button${blockType === 'quote' ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={() => applyBlockFormat('quote')}
        aria-label="Bloc citation"
        aria-pressed={blockType === 'quote'}
      >
        Citation
      </button>
      <button
        type="button"
        className={`rich-editor__toolbar-button${blockType === 'code' ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={() => applyBlockFormat('code')}
        aria-label="Bloc code"
        aria-pressed={blockType === 'code'}
      >
        Code
      </button>
      <span className="rich-editor__toolbar-separator" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`rich-editor__toolbar-button${isLink ? ' rich-editor__toolbar-button--active' : ''}`}
        onClick={toggleLink}
        aria-label={isLink ? 'Supprimer le lien' : 'Ajouter un lien'}
        aria-pressed={isLink}
      >
        Lien
      </button>
      <button
        type="button"
        className="rich-editor__toolbar-button"
        onClick={insertImage}
        aria-label="Insérer une image"
      >
        Image
      </button>
      <span className="rich-editor__toolbar-separator" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className="rich-editor__toolbar-button"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label="Annuler"
      >
        Annuler
      </button>
      <button
        type="button"
        className="rich-editor__toolbar-button"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label="Rétablir"
      >
        Rétablir
      </button>
    </div>
  );
};

export const RichEditor = () => {
  const initialConfig: InitialConfigType = {
    namespace: 'astroshare-editor',
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, ImageNode, CodeNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rich-editor">
        <ToolbarPlugin />
        <div className="rich-editor__editor-wrapper">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label="Zone de saisie de contenu riche"
                className="rich-editor__editor"
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <ImagesPlugin />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
};

export default RichEditor;
