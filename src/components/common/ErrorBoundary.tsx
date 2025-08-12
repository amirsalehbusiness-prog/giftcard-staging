import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
  children: ReactNode;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <Card className="rounded-3xl max-w-md w-full">
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <CardTitle className="text-xl text-red-800">خطایی رخ داده است</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                متأسفانه مشکلی در برنامه پیش آمده است. لطفاً صفحه را بازخوانی کنید.
              </p>
              {import.meta.env.MODE === 'development' && this.state.error && (
                <div className="text-left bg-gray-100 p-3 rounded-xl text-sm font-mono text-red-600">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1 rounded-xl"
                >
                  تلاش مجدد
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  بازخوانی صفحه
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}