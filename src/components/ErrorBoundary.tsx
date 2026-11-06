// import  React from 'react';

// export default class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     logErrorToMyService(
//       error,
//       // Example "componentStack":
//       //   in ComponentThatThrows (created by App)
//       //   in ErrorBoundary (created by App)
//       //   in div (created by App)
//       //   in App
//       info.componentStack,
//       // Warning: `captureOwnerStack` is not available in production.
//       React.captureOwnerStack(),
//     );
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return this.props.fallback;
//     }

//     return this.props.children;
//   }
// }

import { Component, ErrorInfo, ReactNode } from 'react';

// 1. Define Props and State interfaces
interface Props {
  children: ReactNode;
  fallback: ReactNode; // Allows you to pass custom fallback UI
}

interface State {
  hasError: boolean;
}

// 2. Pass Props and State types to the Component generic
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to your error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;