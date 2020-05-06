import React from 'react';
import { AppProvider } from './app_provider';
import { SafeAreaView } from 'react-native';
import { Editor } from './modules/editor';
import { Container } from './components';

export function App() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: 'blue' }}>
        <Container expanded padding={16}>
          <Editor />
        </Container>
      </SafeAreaView>
    </AppProvider>
  );
}
