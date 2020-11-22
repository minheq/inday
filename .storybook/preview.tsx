import { ThemeProvider } from '../app/components/theme';
import React from 'react';

export const decorators = [
  (Story: React.ElementType) => (
    <div
      style={{
        height: 'calc(100vh - 32px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </div>
  ),
];
