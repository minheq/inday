import React from 'react';
import { AppProvider } from './app_provider';
import { Editor } from './modules/editor';

export function App() {
  return (
    <AppProvider>
      <Editor />
    </AppProvider>
  );
}
