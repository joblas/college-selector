import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }}>
    <h1>College Selector</h1>
    <p>If you see this, it's working!</p>
  </div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)