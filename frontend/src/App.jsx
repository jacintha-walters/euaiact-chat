import { useEffect, useState } from 'react'

// Set this to your backend's URL. Locally, that's the FastAPI dev server.
// Once deployed, replace with your Railway/Render backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking...')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.message))
      .catch(() => setBackendStatus('Could not reach backend — is it running?'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>EU AI Act Compliance Checker</h1>
      <p>Skeleton is running. This page will become the risk-tier gate and questionnaire.</p>
      <p>
        <strong>Backend status:</strong> {backendStatus}
      </p>
    </div>
  )
}

export default App
