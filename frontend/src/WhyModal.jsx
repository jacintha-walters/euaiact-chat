/**
 * WhyModal - content for the "Why is this made?" info panel.
 */
function WhyModal() {
  return (
    <div className="flex flex-col gap-8">
      <div className="section flex flex-col gap-4">
        <h3 className="mb-1 border-b border-border pb-2">About this tool</h3>
        <div className="flex flex-col gap-4">
          <p>This is a compliance checker for the EU AI Act.</p>
          <p className="text-muted-foreground">
            This tool builds on the 2023 paper{" "}
            <a
              className="text-primary hover:text-primary-700"
              href="https://arxiv.org/abs/2307.10458"
              target="_blank"
              rel="noopener noreferrer"
            >
              “Complying with the EU AI Act”
            </a>{" "}
            by Jacintha Walters, Diptish Dey, Debarati Bhaumik, and Sophie
            Horsman, which is now cited over 50 times.
          </p>
        </div>
      </div>

      <div className="section flex flex-col gap-4">
        <h3 className="mb-1 border-b border-border pb-2">
          Why was this made?
        </h3>
        <div className="flex flex-col gap-4">
          <p>
            This paper is very successful, and although a good start for further
            research, it lacks the tools to actually help organizations with
            their compliance. That's where this new tool comes in!
          </p>
          <p className="text-muted-foreground">
            It enables organizations, no matter their size or expertise, to dive
            into the EU AI Act in a way that is not overwhelming. The questions
            help them assess their current level, and most importantly, the
            chatbot for high-risk AI models helps them actually understand their
            compliance level and what they can do to improve.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhyModal;