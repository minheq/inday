import Delta from 'quill-delta';
import quillJS from './quill';
import quillCSS from './quill.css';

interface GenerateHTMLProps {
  initialContent?: Delta;
}

export function generateHTML(props: GenerateHTMLProps) {
  const { initialContent } = props;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
      <style>
        ${quillCSS}
      </style>
      <style>
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
        }
        
        #editor-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
          "Helvetica Neue", sans-serif;
          font-size: 1em;
          color: rgba(34, 34, 34, 1);
          padding-bottom: 16px;
        }

        #editor-container .ql-editor > * {
          padding-top: 1em;
        }

        .ql-editor {
          outline: none;
          padding: 0;
          overflow-y: initial;
        }

        blockquote {
          padding-left: 1em !important;
          color: rgba(134, 134, 139, 1);
          border-left: 2px solid rgba(134, 134, 139, 1) !important;
          margin-top: 1em !important;
          margin-bottom: 1em !important;
        }

        a {
          color: rgba(34, 34, 34, 1);
        }

        h1 + p,
        h2 + p {
          margin-top: 0.5em; 
        }
        blockquote {
          border-left: 4px solid #111;
          padding-left: 1em;
        }
        hr {
          border: none;
          color: #111;
          letter-spacing: 1em;
          text-align: center;
        }
        hr:before {
          content: '...';
        }
      </style>
    </head>
    <body>
      <div id="editor-container"></div>  
      <script>
        ${quillJS}
      </script>
      <script>
        const observer = new ResizeObserver(entries => {
          const body = entries[0];
          sendMessage({
            type: 'resize', 
            size: {
              height: body.contentRect.height, 
              width: body.contentRect.width, 
            } 
          });
        })

        observer.observe(document.querySelector('body'))

        let quill = new Quill('#editor-container');

        quill.setContents(${JSON.stringify(initialContent)})

        function sendMessage(message) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(message);
          } else {
            window.top.postMessage(message, '*');
          }
        }

        quill.on('text-change', function(delta, oldDelta, source) {
          sendMessage({ type: 'text-change', delta, oldDelta, source });
        });
        
        quill.on('selection-change', function(range, oldRange, source) {
          sendMessage({ type: 'selection-change', range, oldRange, source });
        });

        function handleFormatBold() {
          const isBold = quill.getFormat().bold;
          quill.format('bold', !isBold);
        }

        function handleFormatItalic() {
          const isItalic = quill.getFormat().italic;
          quill.format('italic', !isItalic);
        }
        
        function handleFormatStrike() {
          const isStriked = quill.getFormat().strike;
          quill.format('strike', !isStriked);
        }
        
        function handleFormatCode() {
          const isCode = quill.getFormat().code;
          quill.format('code', !isCode);
        }
        
        function handleRemoveLink(index) {
          const [link, offset] = quill.getLeaf(index);

          if (link && link.parent.domNode instanceof HTMLAnchorElement) {
            const linkRange = { index: index - offset, length: link.length() };
            quill.formatText(linkRange, 'link', false);
          }
        }
        
        function handleFormatLink(range, text, url) {
          quill.deleteText(range.index, range.length);
          quill.insertText(range.index, text, 'link', url);
        }

        function handleFormatHeading(size) {
          const header = quill.getFormat().header;

          if (header == size) {
            quill.format('header', false);
          } else {
            quill.format('header', size);
          }
        }

        function handleFormatList(index) {
          const isList = quill.getFormat().list;
          quill.formatLine(index, 1, 'list', isList ? false : 'bullet');
        }
        
        function handleFormatBlockquote(index) {
          const isBlockquote = quill.getFormat().blockquote;
          quill.formatLine(index, 1, 'blockquote', !isBlockquote);
        }
        
        function handleFormatCodeBlock(index) {
          const isCodeBlock = quill.getFormat()['code-block'];
          quill.formatLine(index, 1, 'code-block', !isCodeBlock);
        }

        function getBounds(range) {
          const bounds = quill.getBounds(range.index, range.length);
          sendMessage({ type: 'get-bounds', bounds });
        }
        
        function getSelection() {
          const selection = quill.getSelection();
          sendMessage({ type: 'get-selection', range: selection });
        }
        
        function getFormats() {
          const formats = quill.getFormat();
          sendMessage({ type: 'get-formats', formats });
        }

        function getText(range) {
          const text = quill.getText(range.index, range.length);
          sendMessage({ type: 'get-text', text });
        }

        function getLinkRange(index) {
          const [link, offset] = quill.getLeaf(index);

          if (link && link.parent.domNode instanceof HTMLAnchorElement) {
            const range = { index: index - offset, length: link.length() };

            sendMessage({ type: 'get-link-range', range });
          } else {
            sendMessage({ type: 'get-link-range', range: null });
          }          
        }
        
        function getLine(index) {
          const [blot, offset] = quill.getLine(index);

          if (!blot) {
            sendMessage({ type: 'get-line', line: null });
          } else {
            const line = {
              isEmpty: blot.domNode instanceof HTMLParagraphElement && blot.domNode.firstChild instanceof HTMLBRElement,
              offset,
            }

            sendMessage({ type: 'get-line', line });
          }
        }

        function receiveMessage(event) {
          switch(event.data.type) {
            case 'format-bold':
              handleFormatBold();
              break;
            case 'format-italic':
              handleFormatItalic();
              break;
            case 'format-strike':
              handleFormatStrike();
              break;
            case 'format-code':
              handleFormatCode();
              break;
            case 'remove-link':
              handleRemoveLink(event.data.index);
              break;
            case 'format-link':
              handleFormatLink(event.data.range, event.data.text, event.data.url);
              break;
            case 'format-heading':
              handleFormatHeading(event.data.size);
              break;
            case 'format-list':
              handleFormatList(event.data.index);
              break;
            case 'format-blockquote':
              handleFormatBlockquote(event.data.index);
              break;
            case 'format-code-block':
              handleFormatCodeBlock(event.data.index);
              break;
            case 'insert-image':
              break;
            case 'insert-video':
              break;
            case 'focus':
              quill.focus();
              break;
            case 'undo':
              quill.history.undo();
              break;
            case 'redo':
              quill.history.redo();
              break;
            case 'set-selection':
              quill.setSelection(event.data.range.index, event.data.range.length);
              break;
            case 'get-bounds':
              getBounds(event.data.range);
              break;
            case 'get-selection':
              getSelection()
              break;
            case 'get-formats':
              getFormats();
              break;
            case 'get-text':
              getText(event.data.range);
              break;
            case 'get-link-range':
              getLinkRange(event.data.index);
              break;
            case 'get-line':
              getLine(event.data.index);
              break;
            default:
              break;
          }
        }

        window.addEventListener('message', receiveMessage);
      </script>
    </body>
  </html>
`;
}
