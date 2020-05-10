import React from 'react';
import { Editor } from './editor';
import { ThemeProvider } from './theme';

export function App() {
  return (
    <ThemeProvider>
      <Editor />
    </ThemeProvider>
  );
}
