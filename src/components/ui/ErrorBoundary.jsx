import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('Error caught by boundary:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-vault-50 dark:bg-vault-950 px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-vault-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-vault-600 dark:text-vault-400 mb-6">We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
            <button onClick={() => window.location.reload()} className="btn-primary inline-flex items-center gap-2"><RefreshCw className="w-4 h-4" />Refresh Page</button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left text-xs text-red-800 dark:text-red-300 overflow-auto">{this.state.error.toString()}</pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
