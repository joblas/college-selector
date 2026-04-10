import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('React Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <pre style={{ fontSize: 12, textAlign: 'left', maxWidth: '100%', overflow: 'auto' }}>
          {this.state.error?.message || 'Unknown error'}
        </pre>
      </div>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)