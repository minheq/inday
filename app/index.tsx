import React from 'react';
import { AppProvider } from './app_provider';
import { KeyboardAvoidingView } from 'react-native';
import { Editor } from './modules/editor';

export function App() {
  return (
    <AppProvider>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <Editor />
      </KeyboardAvoidingView>
    </AppProvider>
  );
}
