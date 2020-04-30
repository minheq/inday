import quillJS from './quill';
import quillCSS from './quill.css';

export function generateHTML() {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
      <style>
        document.querySelector{quillCSS}
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
          font-family: 'Open Sans', Helvetica, sans-serif;
          font-size: 1.2em;
          height: 100%;
          width: 100%;
        }
        #editor-container .ql-editor {
          min-height: 100%;
          height: inherit;
          overflow-y: inherit;
          padding-bottom: 75px;
        }
        #editor-container .ql-editor > * {
          margin-top: 1.5em;
        }
        #editor-container .ql-editor > *:last-child {
          margin-bottom: 50px;
        }
        #editor-container h1 + p,
        #editor-container h2 + p {
          margin-top: 0.5em; 
        }
        #editor-container blockquote {
          border-left: 4px solid #111;
          padding-left: 1em;
        }
        #editor-container hr {
          border: none;
          color: #111;
          letter-spacing: 1em;
          text-align: center;
        }
        #editor-container hr:before {
          content: '...';
        }
        
        #tooltip-controls {
          background-color: #111;
          border-radius: 4px;
          display: none;
          padding: 5px 10px;
          position: absolute;
        }
        #tooltip-controls::before {
          box-sizing: border-box;
          border-bottom: 6px solid #111;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          content: ' ';
          display: block;
          height: 6px;
          left: 50%;
          position: absolute;
          margin-left: -6px;
          margin-top: -6px;
          top: 0;
          width: 6px;
        }
        #tooltip-controls button {
          background-color: transparent;
          color: #fff;
          border: none;
        }
        #tooltip-controls button.active {
          color: #21b384;
        }
        
        #sidebar-controls {
          display: none;
          position: absolute;
        }
        #sidebar-controls button {
          background-color: transparent;
          border: none;
          padding: 0;
        }
        #sidebar-controls i.fa {
          background-color: #fff;
          border: 1px solid #111;
          border-radius: 50%;
          color: #111;
          width: 32px;
          height: 32px;
          line-height: 32px;
        }
        #sidebar-controls .controls {
          display: none;
          margin-left: 15px;
        }
        #sidebar-controls #show-controls i.fa::before {
          content: "\f067";
        }
        #sidebar-controls.active .controls {
          display: inline-block;
        }
        #sidebar-controls.active #show-controls i.fa::before {
          content: "\f00d";
        }
        
        button {
          cursor: pointer;
          display: inline-block;
          font-size: 18px;
          padding: 0;
          height: 32px;
          width: 32px;
          text-align: center;
        }
        button:active, button:focus {
          outline: none;
        }
      
      </style>
    </head>
    <body>
      <div id="tooltip-controls">
        <button id="bold-button"><i class="fa fa-bold"></i></button>
        <button id="italic-button"><i class="fa fa-italic"></i></button>
        <button id="link-button"><i class="fa fa-link"></i></button>
        <button id="blockquote-button"><i class="fa fa-quote-right"></i></button>
        <button id="header-1-button"><i class="fa fa-header"><sub>1</sub></i></button>
        <button id="header-2-button"><i class="fa fa-header"><sub>2</sub></i></button>
      </div>
      <div id="sidebar-controls">
        <button id="show-controls"><i class="fa fa-plus"></i></button>
        <span class="controls">
          <button id="image-button"><i class="fa fa-camera"></i></button>
          <button id="video-button"><i class="fa fa-play"></i></button>
          <button id="tweet-button"><i class="fa fa-twitter"></i></button>
          <button id="divider-button"><i class="fa fa-minus"></i></button>
        </span>
      </div>
      <div id="editor-container">
        <p>Tell your story...</p>
      </div>  
      <script>
        ${quillJS}
      </script>
      <script>

      let Inline = Quill.import('blots/inline');
      let Block = Quill.import('blots/block');
      let BlockEmbed = Quill.import('blots/block/embed');
      
      class BoldBlot extends Inline {}
      BoldBlot.blotName = 'bold';
      BoldBlot.tagName = 'strong';
      
      class ItalicBlot extends Inline {}
      ItalicBlot.blotName = 'italic';
      ItalicBlot.tagName = 'em';
      
      class LinkBlot extends Inline {
        static create(url) {
          let node = super.create();
          node.setAttribute('href', url);
          node.setAttribute('target', '_blank');
          return node;
        }
      
        static formats(node) {
          return node.getAttribute('href');
        }
      }
      LinkBlot.blotName = 'link';
      LinkBlot.tagName = 'a';
      
      class BlockquoteBlot extends Block {}
      BlockquoteBlot.blotName = 'blockquote';
      BlockquoteBlot.tagName = 'blockquote';
      
      class HeaderBlot extends Block {
        static formats(node) {
          return HeaderBlot.tagName.indexOf(node.tagName) + 1;
        }
      }
      HeaderBlot.blotName = 'header';
      HeaderBlot.tagName = ['H1', 'H2'];
      
      class DividerBlot extends BlockEmbed {}
      DividerBlot.blotName = 'divider';
      DividerBlot.tagName = 'hr';
      
      class ImageBlot extends BlockEmbed {
        static create(value) {
          let node = super.create();
          node.setAttribute('alt', value.alt);
          node.setAttribute('src', value.url);
          return node;
        }
      
        static value(node) {
          return {
            alt: node.getAttribute('alt'),
            url: node.getAttribute('src'),
          };
        }
      }
      ImageBlot.blotName = 'image';
      ImageBlot.tagName = 'img';
      
      class VideoBlot extends BlockEmbed {
        static create(url) {
          let node = super.create();
          node.setAttribute('src', url);
          node.setAttribute('frameborder', '0');
          node.setAttribute('allowfullscreen', true);
          return node;
        }
      
        static formats(node) {
          let format = {};
          if (node.hasAttribute('height')) {
            format.height = node.getAttribute('height');
          }
          if (node.hasAttribute('width')) {
            format.width = node.getAttribute('width');
          }
          return format;
        }
      
        static value(node) {
          return node.getAttribute('src');
        }
      
        format(name, value) {
          if (name === 'height' || name === 'width') {
            if (value) {
              this.domNode.setAttribute(name, value);
            } else {
              this.domNode.removeAttribute(name, value);
            }
          } else {
            super.format(name, value);
          }
        }
      }
      VideoBlot.blotName = 'video';
      VideoBlot.tagName = 'iframe';
      
      class TweetBlot extends BlockEmbed {
        static create(id) {
          let node = super.create();
          node.dataset.id = id;
          twttr.widgets.createTweet(id, node);
          return node;
        }
      
        static value(domNode) {
          return domNode.dataset.id;
        }
      }
      TweetBlot.blotName = 'tweet';
      TweetBlot.tagName = 'div';
      TweetBlot.className = 'tweet';
      
      Quill.register(BoldBlot);
      Quill.register(ItalicBlot);
      Quill.register(LinkBlot);
      Quill.register(BlockquoteBlot);
      Quill.register(HeaderBlot);
      Quill.register(DividerBlot);
      Quill.register(ImageBlot);
      Quill.register(TweetBlot);
      Quill.register(VideoBlot);
      
      function sidebar() {
        return document.querySelector('#sidebar-controls');
      }
      
      function tooltip() {
        return document.querySelector('#tooltip-controls');
      }
      
      let quill = new Quill('#editor-container');
      quill.addContainer(tooltip());
      quill.addContainer(sidebar());
      quill.on(Quill.events.EDITOR_CHANGE, function (eventType, range) {
        if (eventType !== Quill.events.SELECTION_CHANGE) return;
        if (range == null) return;
        if (range.length === 0) {
          tooltip().style.display = 'none';
          let [block, offset] = quill.scroll.descendant(Block, range.index);
          if (block != null && block.domNode.firstChild instanceof HTMLBRElement) {
            let lineBounds = quill.getBounds(range);
            sidebar().classList.remove('active');
            sidebar().style.display = 'block';
            sidebar().style.left = lineBounds.left - 50 + 'px';
            sidebar().style.top = lineBounds.top - 2 + 'px';
          } else {
            tooltip().style.display = 'none';
            sidebar().style.display = 'none';
            sidebar().classList.remove('active');
          }
        } else {
          sidebar().style.display = 'none';
          sidebar().classList.remove('active');
      
          let rangeBounds = quill.getBounds(range);
          tooltip().style.display = 'block';
          tooltip().style.left =
            rangeBounds.left +
            rangeBounds.width / 2 -
            tooltip().offsetWidth / 2 +
            'px';
          tooltip().style.top = rangeBounds.bottom + 10 + 'px';
        }
      });
      
      document.querySelector('#bold-button').addEventListener('click', function () {
        quill.format('bold', true);
      });
      
      document.querySelector('#italic-button').addEventListener('click', function () {
        let active = document.querySelector(this).hasClass('active');
        quill.format('italic', true);
      });
      
      document.querySelector('#link-button').addEventListener('click', function () {
        let value = prompt('Enter link URL');
        quill.format('link', value);
      });
      
      document
        .querySelector('#blockquote-button')
        .addEventListener('click', function () {
          console.log('blockquote');
          quill.format('blockquote', true);
        });
      
      document
        .querySelector('#header-1-button')
        .addEventListener('click', function () {
          quill.format('header', 1);
        });
      
      document
        .querySelector('#header-2-button')
        .addEventListener('click', function () {
          quill.format('header', 2);
        });
      
      document
        .querySelector('#divider-button')
        .addEventListener('click', function () {
          let range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
          quill.setSelection(range.index + 1, Quill.sources.SILENT);
          sidebar().style.display = 'none';
        });
      
      document.querySelector('#image-button').addEventListener('click', function () {
        let range = quill.getSelection(true);
        quill.insertEmbed(
          range.index,
          'image',
          {
            alt: 'Quill Cloud',
            url: 'https://quilljs.com/0.20/assets/images/cloud.png',
          },
          Quill.sources.USER,
        );
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
        sidebar().style.display = 'none';
      });
      
      document.querySelector('#video-button').addEventListener('click', function () {
        let range = quill.getSelection(true);
        let url = 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0';
        quill.insertEmbed(range.index, 'video', url, Quill.sources.USER);
        quill.formatText(range.index + 1, 1, { height: '170', width: '400' });
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
        sidebar().style.display = 'none';
      });
      
      document.querySelector('#tweet-button').addEventListener('click', function () {
        let range = quill.getSelection(true);
        let id = '464454167226904576';
        quill.insertEmbed(range.index, 'tweet', id, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
        sidebar().style.display = 'none';
      });
      
      document.querySelector('#show-controls').addEventListener('click', function () {
        sidebar().classList.toggle('active');
        quill.focus();
      });
            </script>
    </body>
  </html>
`;
}
