/**
 * WhyModal - content for the "Why is this made?" info panel.
 */


function WhyModal() {
  return (
    <div>
      <p>This is a compliance checker for the EU AI Act.</p>

      <p>
        This tool builds on the 2023 paper{' '}
        <a href="https://arxiv.org/abs/2307.10458" target="_blank" rel="noopener noreferrer">
          "Complying with the EU AI Act"
        </a>{' '}
        by Jacintha Walters, Diptish Dey, Debarati Bhaumik, and Sophie Horsman, which is
        now cited over 50 times.
      </p>

      <h3 style={{ marginBottom: '0.3rem' }}>Why was this made?</h3>
      <p>
        This paper is very successful, and although a good start for further research, it
        lacks the tools to actually help organizations with their compliance. That's where
        this new tool comes in! It enables organizations, no matter their size or
        expertise, to dive into the EU AI Act in a way that is not overwhelming. The
        questions help them assess their current level, and most importantly, the chatbot
        for high-risk AI models helps them actually understand their compliance level and what they can do to
        improve.
      </p>
    </div>
  )
}

export default WhyModal