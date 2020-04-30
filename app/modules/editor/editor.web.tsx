import React from 'react';
import { generateHTML } from './html';

interface EditorProps {}

export function Editor() {
  return <iframe srcDoc={generateHTML()} style={styles.iframe} />;
}

const styles = {
  iframe: {
    width: '100%',
    borderWidth: 0,
  },
};
