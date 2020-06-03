import React from 'react';
import { Editor } from './editor';
import { ThemeProvider } from './theme';
import { Element } from './editor/editable/nodes/element';
import { Container } from './components';

export function App() {
  return (
    <ThemeProvider>
      <Container width={800}>
        <Editor initialValue={initialValue} />
      </Container>
    </ThemeProvider>
  );
}

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
];
