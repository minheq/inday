import React from 'react';
import { Text } from '../../components/text';

interface ErrorBoundaryState {
  hasError: boolean;
  eventId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, eventId: '' };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, eventId: '' };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo): void {
    console.log(error);
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <Text size="lg" align="center">
          Something went wrong :(
        </Text>
      );
    }

    return children;
  }
}
