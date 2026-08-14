/**
 * WhoModal - content for the "Who made this?" info panel.
 */

function WhoModal() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p>
          My name is <strong>Jacintha</strong>, I'm an AI & Cybersecurity
          specialist. Do you like my tool? Consider hiring me! I'm available for
          full-time permanent contracts as well as freelance assignments.
        </p>
        <div className="flex flex-wrap gap-1">
          <a
            className="text-primary hover:text-primary-700"
            href="https://www.linkedin.com/in/jacinthawalters/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          {" · "}
          <a
            className="text-primary hover:text-primary-700"
            href="https://github.com/jacintha-walters"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {" · "}
          <a
            className="text-primary hover:text-primary-700"
            href="mailto:jacintha.walters@gmail.com"
          >
            jacintha.walters@gmail.com
          </a>
        </div>
      </div>
      <div className="section flex flex-col gap-4">
        <h3 className="mb-1 pb-2 border-b border-border">Skills</h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>AI & Data</strong>
            </p>
            <p className="mt-0 text-muted-foreground">
              Generative AI (ChatGPT, Claude, etc.) · AI Governance ·
              Responsible AI · EU AI Act · AI Security · Data Engineering ·
              Machine Learning · Large Language Models (LLM) · Prompt
              Engineering · Python
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>Technology & Cybersecurity</strong>
            </p>
            <p className="mt-0 text-muted-foreground">
              Cloud Architecture · Security Governance · Risk Management · Cloud
              Security · API Architecture · Identity & Access Management (IAM) ·
              Docker Containerisation · Multi Factor Authentication (MFA) · AWS
              · SQL · Git
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>Leadership & Communication</strong>
            </p>
            <p className="mt-0 text-muted-foreground">
              Stakeholder Management · Team Leadership · Presenting · Technical
              Workshops · Writing · Course Development
            </p>
          </div>
        </div>
      </div>

           <div className="section flex flex-col gap-4">
        <h3 className="mb-1 border-b border-border pb-2">Education</h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>MSc Applied Artificial Intelligence</strong> — Amsterdam
              University of Applied Sciences
            </p>
            <p className="mt-0 text-muted-foreground">Cum laude</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>BSc Cyber Security</strong> — Amsterdam University of
              Applied Sciences
            </p>
            <p className="mt-0 text-muted-foreground">Cum laude</p>
          </div>
        </div>
      </div>

      <div className="section flex flex-col gap-4">
        <h3 className="mb-1 border-b border-border pb-2">Experience</h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>Cybersecurity Coordinator</strong> — Amsterdam University
              of Applied Sciences (Make IT Work), Netherlands
            </p>
            <p className="mt-0 text-sm text-muted-foreground">
              08.2023 – 08.2024
            </p>
            <p className="mt-0 text-muted-foreground">
              Managed part of an IT career-transition initiative, which supports
              300+ non-IT professionals annually.
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>
                Led a cross-functional team of 2 employees, 6 guest lecturers, 6
                industry experts, and 10 corporate partners.
              </li>
              <li>
                Delivered technical workshops on generative AI, AI governance,
                cyber resilience, and risk management to groups of up to 50.
              </li>
              <li>
                Designed AI-focused curriculum modules on responsible AI, AI
                security, and AI fundamentals.
              </li>
              <li>
                Achieved a 93% graduation rate, 100% employment placement rate,
                and 100% employer satisfaction score.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>AI Threat Monitoring Internship</strong> — Dutch Police,
              High Tech Crime Unit, Netherlands
            </p>
            <p className="mt-0 text-sm text-muted-foreground">
              02.2022 – 07.2022
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>
                Processed large-scale datasets to improve data quality for
                machine learning.
              </li>
              <li>
                Implemented and evaluated 4 AI models, fine-tuning the
                best-performing one to improve performance by 12%.
              </li>
              <li>
                Developed a proof-of-concept AI solution and validated it
                against operational Dutch Police datasets.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>Cybersecurity Lecturer</strong> — Amsterdam University of
              Applied Sciences (Make IT Work), Netherlands
            </p>
            <p className="mt-0 text-sm text-muted-foreground">
              09.2020 – 02.2022
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>
                Redesigned the cybersecurity curriculum with corporate partners
                around industry needs.
              </li>
              <li>
                Developed 8 lectures with assignments on containerization,
                cloud, and risk assessments.
              </li>
              <li>Delivered lectures to groups of 30 students.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>Security Audit Internship</strong> — NEP Group,
              Netherlands
            </p>
            <p className="mt-0 text-sm text-muted-foreground">
              02.2020 – 07.2020
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>
                Identified 23 security risks using Nessus, NMAP, and Snyk to
                audit internal network infrastructure.
              </li>
              <li>
                Delivered a structured technical report outlining mitigation
                strategies for all 23 risks.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <p className="mb-0.5">
              <strong>Independent Freelancer</strong> — Europe
            </p>
            <p className="mt-0 text-sm text-muted-foreground">
              02.2025 – Present
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>
                Built an independent YouTube channel, reaching 15,000
                subscribers and 1,000,000 views.
              </li>
              <li>
                Improved watch time per viewer by 25% through A/B testing and
                market research.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhoModal;
