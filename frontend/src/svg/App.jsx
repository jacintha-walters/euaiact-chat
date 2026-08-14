import { useEffect, useState } from "react";
import LandingPage from "../LandingPage.jsx";
import GateForm from "../GateForm.jsx";
import ChatInterface from "../ChatInterface.jsx";
import Modal from "../Modal.jsx";
import WhyModal from "../WhyModal.jsx";
import WhoModal from "../WhoModal.jsx";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

function App() {
  const [view, setView] = useState("landing"); // 'landing' | 'assessment' | 'chat'
  const [activeModal, setActiveModal] = useState(null); // null | 'why' | 'who'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const openInfoModal = (modal) => {
    setMobileMenuOpen(false);
    setActiveModal(modal);
  };

  return (
    <div className="mx-auto mb-16 max-w-300 px-[1.5rem]">
      <div className="mb-8 mt-8 flex items-center justify-end gap-2 border-b pb-4 lg:mb-12">
        <button
          className="mr-auto cursor-pointer"
          onClick={() => setView("landing")}
        >
          <h1>EU AI Act Compliance Checker</h1>
        </button>
        <div className="hidden lg:flex">
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => openInfoModal("why")}
          >
            Why is this made?
          </Button>
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => openInfoModal("who")}
          >
            Who made this?
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <button
        type="button"
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close menu"
        tabIndex={mobileMenuOpen ? 0 : -1}
      />

      <aside
        id="mobile-menu"
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(85vw,22rem)] flex-col bg-background p-5 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          {/* <span className="font-heading text-lg font-semibold">Menu</span> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="ml-auto"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Information">
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => {
              setView("landing");
              setMobileMenuOpen(false);
            }}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => openInfoModal("why")}
          >
            Why is this made?
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => openInfoModal("who")}
          >
            Who made this?
          </Button>
        </nav>
      </aside>

      {view === "landing" && (
        <LandingPage
          onStartAssessment={() => setView("assessment")}
          onStartChat={() => setView("chat")}
        />
      )}

      {view === "assessment" && <GateForm />}

      {view === "chat" && (
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-15 xl:gap-30">
          <div className="text-black flex flex-col gap-8  order-2 md:-order-1">
            <Button
              variant="outline"
              className="h-fit w-fit hidden md:block"
              onClick={() => setView("landing")}
            >
              ← Back to home
            </Button>
            {/* HI JACINTA, PUT CONTENT HERE */}
            <div className="flex flex-col gap-8">
              <div className="question-and-answer opacity-60 flex flex-col gap-2">
                <h1 className="font-bold text-lg">
                  Contextual to the business
                </h1>
                <p>
                  Here you may write about the cool things that your chatbot can
                  do.
                </p>
              </div>
              <div className="question-and-answer opacity-60 flex flex-col gap-2">
                <h1 className="font-bold text-lg">What can the chatbot do?</h1>
                <p>
                  The chatbot can answer questions about the EU AI Act, explain
                  its requirements in plain language, and help you understand
                  how the Act may apply to your AI system. If you complete the
                  compliance assessment, it can also discuss your results,
                  highlight weaknesses, and suggest areas for improvement.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="h-fit w-fit block md:hidden"
              onClick={() => setView("landing")}
            >
              ← Back to home
            </Button>
            <ChatInterface />
          </div>
        </div>
      )}

      {activeModal === "why" && (
        <Modal title="Why is this made?" onClose={() => setActiveModal(null)}>
          <WhyModal />
        </Modal>
      )}
      {activeModal === "who" && (
        <Modal title="Who made this?" onClose={() => setActiveModal(null)}>
          <WhoModal />
        </Modal>
      )}
    </div>
  );
}

export default App;
