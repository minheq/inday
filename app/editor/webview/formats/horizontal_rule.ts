import { BlockEmbed } from 'quill/blots/block';

class HorizontalRule extends BlockEmbed {
  static blotName = 'hr';
  static tagName = 'hr';

  static create(value) {
    const node = super.create(value);
    node.setAttribute('contenteditable', false);
    return node;
  }
}

export default HorizontalRule;
