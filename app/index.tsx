import React from 'react';
import { AppProvider } from './app_provider';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Editor } from './modules/editor';

export function App() {
  return (
    <AppProvider>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Editor />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </AppProvider>
  );
}
