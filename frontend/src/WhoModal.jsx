/**
 * WhoModal - content for the "Who made this?" info panel.
 */

function WhoModal() {
  return (
    <div>
      <p>
        My name is <strong>Jacintha</strong>, I'm an AI & Cybersecurity specialist. Do you
        like my tool? Consider hiring me! I'm available for full-time permanent contracts
        as well as freelance assignments.
      </p>

      <p>
        <a href="https://www.linkedin.com/in/jacinthawalters/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        {' · '}
        <a href="https://github.com/jacintha-walters" target="_blank" rel="noopener noreferrer">GitHub</a>
        {' · '}
        <a href="mailto:jacintha.walters@gmail.com">jacintha.walters@gmail.com</a>
      </p>

      <h3 style={{ marginBottom: '0.3rem' }}>Skills</h3>

      <p style={{ marginBottom: '0.2rem' }}><strong>AI & Data</strong></p>
      <p style={{ marginTop: 0, color: '#555' }}>
        Generative AI (ChatGPT, Claude, etc.) · AI Governance · Responsible AI · EU AI Act
        · AI Security · Data Engineering · Machine Learning · Large Language Models (LLM)
        · Prompt Engineering · Python
      </p>

      <p style={{ marginBottom: '0.2rem' }}><strong>Technology & Cybersecurity</strong></p>
      <p style={{ marginTop: 0, color: '#555' }}>
        Cloud Architecture · Security Governance · Risk Management · Cloud Security · API
        Architecture · Identity & Access Management (IAM) · Docker Containerisation ·
        Multi Factor Authentication (MFA) · AWS · SQL · Git
      </p>

      <p style={{ marginBottom: '0.2rem' }}><strong>Leadership & Communication</strong></p>
      <p style={{ marginTop: 0, color: '#555' }}>
        Stakeholder Management · Team Leadership · Presenting · Technical Workshops ·
        Writing · Course Development
      </p>

      <h3 style={{ marginBottom: '0.3rem' }}>Experience</h3>

      <p style={{ marginBottom: '0.1rem' }}>
        <strong>Cybersecurity Coordinator</strong> — Amsterdam University of Applied
        Sciences (Make IT Work), Netherlands
      </p>
      <p style={{ marginTop: 0, marginBottom: '0.3rem', fontSize: '0.85rem', color: '#777' }}>08.2023 – 08.2024</p>
       Managed part of an IT career-transition initiative, which supports 300+ non-IT professionals annually.
      <ul style={{ marginTop: 0 }}>
        <li>Led a cross-functional team of 2 employees, 6 guest lecturers, 6 industry experts, and 10 corporate partners.</li>
        <li>Delivered technical workshops on generative AI, AI governance, cyber resilience, and risk management to groups of up to 50.</li>
        <li>Designed AI-focused curriculum modules on responsible AI, AI security, and AI fundamentals.</li>
        <li>Achieved a 93% graduation rate, 100% employment placement rate, and 100% employer satisfaction score.</li>
      </ul>

      <p style={{ marginBottom: '0.1rem' }}>
        <strong>AI Threat Monitoring Internship</strong> — Dutch Police, High Tech Crime Unit, Netherlands
      </p>
      <p style={{ marginTop: 0, marginBottom: '0.3rem', fontSize: '0.85rem', color: '#777' }}>02.2022 – 07.2022</p>
      <ul style={{ marginTop: 0 }}>
        <li>Processed large-scale datasets to improve data quality for machine learning.</li>
        <li>Implemented and evaluated 4 AI models, fine-tuning the best-performing one to improve performance by 12%.</li>
        <li>Developed a proof-of-concept AI solution and validated it against operational Dutch Police datasets.</li>
      </ul>

      <p style={{ marginBottom: '0.1rem' }}>
        <strong>Cybersecurity Lecturer</strong> — Amsterdam University of Applied Sciences (Make IT Work), Netherlands
      </p>
      <p style={{ marginTop: 0, marginBottom: '0.3rem', fontSize: '0.85rem', color: '#777' }}>09.2020 – 02.2022</p>
      <ul style={{ marginTop: 0 }}>
        <li>Redesigned the cybersecurity curriculum with corporate partners around industry needs.</li>
        <li>Developed 8 lectures with assignments on containerization, cloud, and risk assessments.</li>
        <li>Delivered lectures to groups of 30 students.</li>
      </ul>

      <p style={{ marginBottom: '0.1rem' }}>
        <strong>Security Audit Internship</strong> — NEP Group, Netherlands
      </p>
      <p style={{ marginTop: 0, marginBottom: '0.3rem', fontSize: '0.85rem', color: '#777' }}>02.2020 – 07.2020</p>
      <ul style={{ marginTop: 0 }}>
        <li>Identified 23 security risks using Nessus, NMAP, and Snyk to audit internal network infrastructure.</li>
        <li>Delivered a structured technical report outlining mitigation strategies for all 23 risks.</li>
      </ul>

      <p style={{ marginBottom: '0.1rem' }}>
        <strong>Independent Freelancer</strong> — Europe
      </p>
      <p style={{ marginTop: 0, marginBottom: '0.3rem', fontSize: '0.85rem', color: '#777' }}>02.2025 – Present</p>
      <ul style={{ marginTop: 0 }}>
        <li>Built an independent YouTube channel, reaching 15,000 subscribers and 1,000,000 views.</li>
        <li>Improved watch time per viewer by 25% through A/B testing and market research.</li>
      </ul>

      <h3 style={{ marginBottom: '0.3rem' }}>Education</h3>
      <p style={{ marginBottom: '0.1rem' }}>
        <strong>MSc Applied Artificial Intelligence</strong> — Amsterdam University of Applied Sciences
      </p>
      <p style={{ marginTop: 0, marginBottom: '0.6rem', color: '#555' }}>Cum laude</p>

      <p style={{ marginBottom: '0.1rem' }}>
        <strong>BSc Cyber Security</strong> — Amsterdam University of Applied Sciences
      </p>
      <p style={{ marginTop: 0, color: '#555' }}>Cum laude</p>
    </div>
  )
}

export default WhoModal