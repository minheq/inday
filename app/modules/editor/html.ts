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

        function receiveMessage(event) {
          switch(event.data.type) {
            case 'bold':
              const isBold = quill.getFormat().bold;
              quill.format('bold', !isBold);
              break;
            case 'italic':
              const isItalic = quill.getFormat().italic;
              quill.format('italic', !isItalic);
              break;
            case 'strikethrough':
              const isStriked = quill.getFormat().strike;
              quill.format('strike', !isStriked);
              break;
            case 'inline-code':
              const isCode = quill.getFormat().code;
              quill.format('code', !isCode);
              break;
            case 'link':
              const isLink = quill.getFormat().link;
              if (isLink) {
                quill.format('link', false);
              } else {
                quill.format('link', event.data.url);
              }
              break;
            case 'heading':
              const header = quill.getFormat().header;
              const headingSize = event.data.size;

              if (header == headingSize) {
                quill.format('header', false);
              } else {
                quill.format('header', headingSize);
              }
              break;
            case 'insert-list':
              quill.formatLine(event.data.index, 1, 'list', 'bullet');
              break;
            case 'insert-blockquote':
              quill.formatLine(event.data.index, 1, 'blockquote', true);
              break;
            case 'insert-code-block':
              quill.formatLine(event.data.index, 1, 'code-block', true);
              break;
            case 'insert-image':

              break;
            case 'insert-video':

              break;
            case 'focus':
              quill.focus();
              break;
            case 'get-bounds':
              const bounds = quill.getBounds(event.data.range.index, event.data.range.length);
              sendMessage({ type: 'get-bounds', bounds });
              break;
            case 'get-selection':
              const selection = quill.getSelection();
              sendMessage({ type: 'get-selection', range: selection });
              break;
            case 'get-formats':
              const formats = quill.getFormat();
              sendMessage({ type: 'get-formats', formats });
              break;
            case 'get-line':
              const [blot, offset] = quill.getLine(event.data.index);
              if (!blot) {
                sendMessage({ type: 'get-line', line: null });
              } else {
                const line = {
                  isEmpty: blot.domNode instanceof HTMLParagraphElement && blot.domNode.firstChild instanceof HTMLBRElement,
                  offset,
                }
                sendMessage({ type: 'get-line', line });
              }
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
