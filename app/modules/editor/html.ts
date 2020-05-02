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
          sendMessage({ type: 'resize', height: body.contentRect.height });
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
              const range = quill.getSelection();
              const current = quill.getFormat(range).bold;
              quill.format('bold', !current);
              break;
            case 'get-bounds':
              const bounds = quill.getBounds(event.data.range.index, event.data.range.length);
              sendMessage({ type: 'get-bounds', bounds });
              break;
            case 'get-selection':
              const selection = quill.getSelection();
              sendMessage({ type: 'get-selection', range: selection });
              break;
            case 'get-line':
              const [blot, offset] = quill.getLine(event.data.index);
              if (!blot) {
                sendMessage({ type: 'get-line', line: null });
              } else {
                const line = {
                  isEmpty: blot.domNode.firstChild instanceof HTMLBRElement,
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
