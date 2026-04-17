import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      let details = "";

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed && typeof parsed === 'object' && parsed.error && parsed.operationType) {
            errorMessage = `Firestore ${parsed.operationType} failed.`;
            details = parsed.error;
          }
        }
      } catch (e) {
        // Not a JSON error, use raw message
        details = this.state.error?.message || "";
      }

      if (!details && this.state.error?.message) {
        details = this.state.error.message;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{errorMessage}</h2>
            <p className="text-gray-600 mb-8 max-h-40 overflow-auto text-sm">
              {details || "Please check your connection and try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
