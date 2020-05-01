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
          height: 100%;
          margin: 0;
          padding: 0;
          width: 100%;
        }
        
        #editor-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
          "Helvetica Neue", sans-serif;
          font-size: 1em;
          height: 100%;
          width: 100%;
          color: rgba(34, 34, 34, 1);
        }
        .ql-editor {
          min-height: 100%;
          padding-bottom: 75px;
          outline: none;
          padding: 0;
        }
        .ql-editor > *:last-child {
          margin-bottom: 50px;
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
      let quill = new Quill('#editor-container');

      quill.setContents(${JSON.stringify(initialContent)})

      function sendMessage(delta) {
        let message = { source: 'editor', data: delta };
        
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(message);
        } else {
          window.top.postMessage(message, '*');
        }
      }

      quill.on('text-change', sendMessage);

      function receiveMessage(event) {
        if (event.data.source !== 'app') {
          return;
        }

        switch(event.data.type) {
          case 'bold':
            const range = quill.getSelection();
            const current = quill.getFormat(range).bold;
            quill.format('bold', !current);
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
