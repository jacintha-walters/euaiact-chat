import { useState } from 'react'
import LandingPage from './LandingPage.jsx'
import GateForm from './GateForm.jsx'
import Modal from './Modal.jsx'
import WhyModal from './WhyModal.jsx'
import WhoModal from './WhoModal.jsx'

function App() {
  const [started, setStarted] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // null | 'why' | 'who'

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '4rem auto', padding: '0 1rem' }}>
      <style>{`
        .markdown-answer p { margin: 0.4rem 0; }
        .markdown-answer ul, .markdown-answer ol { margin: 0.4rem 0; padding-left: 1.2rem; }
        .markdown-answer h1, .markdown-answer h2, .markdown-answer h3 { margin: 0.6rem 0 0.3rem; }
        .markdown-answer li { margin-bottom: 0.2rem; }

        .btn-primary {
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.6rem 1.2rem;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .btn-primary:hover { background-color: #1565c0; }
        .btn-primary:disabled { background-color: #b0bec5; cursor: not-allowed; }

        .btn-secondary {
          background-color: white;
          color: #1976d2;
          border: 1px solid #1976d2;
          border-radius: 4px;
          padding: 0.6rem 1.2rem;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .btn-secondary:hover { background-color: #f0f7ff; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
        <button className="btn-secondary" onClick={() => setActiveModal('why')}>
          Why is this made?
        </button>
        <button className="btn-secondary" onClick={() => setActiveModal('who')}>
          Who made this?
        </button>
      </div>
      {started ? <GateForm /> : <LandingPage onStart={() => setStarted(true)} />}

      {activeModal === 'why' && (
        <Modal title="Why is this made?" onClose={() => setActiveModal(null)}>
          <WhyModal />
        </Modal>
      )}
      {activeModal === 'who' && (
        <Modal title="Who made this?" onClose={() => setActiveModal(null)}>
          <WhoModal />
        </Modal>
      )}
    </div>
  )
}

export default App