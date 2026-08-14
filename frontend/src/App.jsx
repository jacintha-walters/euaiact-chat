import { useState } from 'react'
import LandingPage from './LandingPage.jsx'
import GateForm from './GateForm.jsx'
import ChatInterface from './ChatInterface.jsx'
import Modal from './Modal.jsx'
import WhyModal from './WhyModal.jsx'
import WhoModal from './WhoModal.jsx'

function App() {
  const [view, setView] = useState('landing') // 'landing' | 'assessment' | 'chat'
  const [activeModal, setActiveModal] = useState(null) // null | 'why' | 'who'

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '4rem auto', padding: '0 1rem' }}>
      <style>{`
        /* ...your existing markdown/button styles, unchanged... */
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
        <button className="btn-secondary" onClick={() => setActiveModal('why')}>
          Why is this made?
        </button>
        <button className="btn-secondary" onClick={() => setActiveModal('who')}>
          Who made this?
        </button>
      </div>

      {view === 'landing' && (
        <LandingPage
          onStartAssessment={() => setView('assessment')}
          onStartChat={() => setView('chat')}
        />
      )}

      {view === 'assessment' && <GateForm />}

      {view === 'chat' && (
        <div>
          <button className="btn-secondary" onClick={() => setView('landing')} style={{ marginBottom: '1rem' }}>
            ← Back to home
          </button>
          <h1>EU AI Act Chatbot</h1>
          <p style={{ fontStyle: 'italic', color: '#555' }}>
            This assistant can make mistakes. It's grounded in the EU AI Act but is not a
            substitute for legal advice.
          </p>
          <ChatInterface />
        </div>
      )}

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