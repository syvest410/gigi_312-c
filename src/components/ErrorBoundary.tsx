import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-800 p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
            <h2 className="text-2xl font-serif mb-4">Hoppla! Etwas ist schiefgelaufen.</h2>
            <p className="text-stone-600 mb-6">Wir konnten die Seite nicht laden. Bitte versuchen Sie es später noch einmal oder laden Sie die Seite neu.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-brand-dark text-white px-6 py-3 rounded-full hover:bg-brand-primary transition-colors font-semibold uppercase tracking-wider text-sm"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
