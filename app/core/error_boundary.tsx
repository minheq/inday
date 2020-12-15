import React from 'react';
import { Text } from '../components/text';

interface ErrorBoundaryState {
  hasError: boolean;
  eventId: string;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, eventId: '' };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Text size="lg" align="center">
          Something went wrong :(
        </Text>
      );
    }

    return this.props.children;
  }
}
