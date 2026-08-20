/* Portfolio identity, project, and achievement data */

/* Field hubs — large nodes that projects orbit around */
window.PROJECT_FIELDS = [
  { id: "ml", label: "ML", color: "#00f5ff", angle: -Math.PI * 0.5 },
  { id: "web", label: "Web", color: "#9d00ff", angle: -Math.PI * 0.166 },
  { id: "agentic", label: "Agentic", color: "#5eead4", angle: Math.PI * 0.166 },
  { id: "cyber", label: "Cyber", color: "#ff2bd6", angle: Math.PI * 0.5 },
  { id: "devops", label: "DevOps", color: "#ffc857", angle: Math.PI * 0.833 },
  { id: "cloud", label: "Cloud", color: "#7dd3fc", angle: -Math.PI * 0.833 },
];

window.PORTFOLIO_DATA = {
  identity: {
    handle: "your_handle",
    title: "Aspiring AI Engineer | DevOps Focused",
    location: "Kuala Lumpur, Malaysia",
    summary:
      "Driven Diploma in Information Technology student aspiring to become an AI Systems Engineer, with a strong foundation in software engineering, machine learning, and cloud technologies. Building hands-on experience in Agentic AI, production AI systems, Cloud Architecture, and DevOps through projects, internships, and hackathons. Passionate about building reliable, scalable AI systems and cloud-native applications for real-world use.",
    stats: [
      { label: "PROJECTS", value: "07" },
      { label: "DEPLOYED MODELS", value: "01" },
      { label: "COMPETITIONS", value: "11" },
      { label: "YEARS", value: "02" },
    ],
  },

  projects: [
    {
      id: "p1",
      name: "Neural Network From Scratch",
      domain: "AI",
      year: "2025",
      tag: "PROJECT.alpha",
      description:
        "Implemented a 2-layer neural network from scratch using only numpy to understand the underlying mechanics of deep learning",
      stack: ["Python", "numpy", "matplotlib"],
      features: [
        "Backpropagation",
        "Optimization Algorithm (i.e. AdamW, SGDM)",
        "Dropout",
      ],
      fields: ["ml"],
      github: "https://github.com/AloysiusLimMingZhou/Neural-Network-From-Scratch",
      x: 0.18, y: 0.32,
    },
    {
      id: "p2",
      name: "HealthConnect",
      domain: "AI, ML, Web",
      year: "2026",
      tag: "PROJECT.beta",
      tagline: "Final Year Project with Wong Zhen Hao",
      description:
        "A comprehensive web application that deploy Heart Disease Prediction Service with ML Algorithms, RAG Health AI Assistant and Admin Dashboard",
      stack: ["NextJS", "NestJS", "PostgreSQL", "FastAPI", "Scikit-Learn", "LangChain"],
      features: [
        "RAG Health AI Assistant",
        "Admin Dashboard with Role Based Administration Control",
        "ML Algorithm Heart Disease Prediction Service",
      ],
      fields: ["ml", "web"],
      github: "https://github.com/AloysiusLimMingZhou/final-year-project",
      x: 0.04, y: 0.18,
    },
    {
      id: "p3",
      name: "Kuih Classification Model",
      domain: "Deep Learning",
      year: "2025",
      tag: "PROJECT.gamma",
      tagline: "National AI Competition Project with Tang Yi Hui, Jasmine Ng and Jovan Tan",
      description:
        "Fine Tuned Google's ViT Base 16 model on custom dataset that can classify 8 different types of Malaysian kuihs from both images and in real time.",
      stack: ["Pytorch", "HuggingFace ViT", "Python", "Matplotlib", "OpenCV"],
      features: [
        "Real Time Camera Kuih Classification",
        "Fine Tuned Pre-train Model using Pytorch",
        "Achieved Validation Accuracy of 96.88%, along with 96.92% of F1 Score",
        "Achieved Top 10 Finalist in National AI Competition 2025 (NAIC)",
      ],
      fields: ["ml"],
      github: "https://github.com/AloysiusLimMingZhou/NAIC-Competition",
      x: 0.5, y: 0.36,
    },
    {
      id: "p4",
      name: "ML Algorithm from Scratch",
      domain: "AI",
      year: "2025",
      tag: "PROJECT.delta",
      tagline: "Deep Dive Into The World of Machine Learning",
      description:
        "Implemented Basics of Machine Learning algorithms from scratch to understand the theory behind it. Provided rigorous math derivation and theoretical framework for each algorithm.",
      stack: ["Numpy", "Pandas", "Matplotlib"],
      features: [
        "Logistic Regression",
        "Multivariable Linear Regression",
        "Regularized Regression (Lasso & Ridge)",
      ],
      fields: ["ml"],
      github: "https://github.com/AloysiusLimMingZhou/ML-Algorithm",
      x: 0.7, y: 0.22,
    },
    {
      id: "p5",
      name: "EduSign-Bridge",
      domain: "Web",
      year: "2026",
      tag: "PROJECT.epsilon",
      tagline: "Kitahack 2026 with Loke Yu Heng & Punitan",
      description:
        "A comprehensive mobile application that bridge the gap for the deaf and hearing impaired",
      stack: ["Flutter", "Firebase", "Gemini API", "Python", "Tensorflow", "Vertex AI"],
      features: [
        "Hand Gestures Recognition System",
        "Real-time Translation of Sign Language to Speech",
        "Speech to Sign Language Text Translation",
      ],
      fields: ["web"],
      github: "https://github.com/AloysiusLimMingZhou/EduSign-Bridge",
      x: 0.84, y: 0.42,
    },
    {
      id: "p6",
      name: "Retinal Diabetical Severity Classification",
      domain: "AI/ML",
      year: "2026",
      tag: "PROJECT.zeta",
      tagline: "Competition Project for National AI Competition 2026 with Tang Yi Hui, Jovan Tan & Foo Weng Wai",
      description:
        "Fine Tuned and ensembled EfficientNet-B3 and ConvNext-Small CNN models for classifying Retinal Diabetical Severity Disease with Competition's Imbalanced Dataset.",
      stack: ["Pytorch", "HuggingFace", "NextJS", "FastAPI", "Matplotlib"],
      features: [
        "Rank Fusion Ensembled methods",
        "CNN Model Transfer Learning",
        "Developed a Web Application to deploy the model",
        "Achieved Accuracy of 83.7% & Recall Score of 74.54% on Competition's Imbalanced Dataset",
      ],
      fields: ["ml", "web"],
      github: "https://github.com/AloysiusLimMingZhou/NAIC-2026",
      x: 0.62, y: 0.62,
    },
    {
      id: "p7",
      name: "Personal Portfolio",
      domain: "Web",
      year: "2026",
      tag: "PROJECT.eta",
      tagline: "Personal Portfolio",
      description:
        "A personal portfolio website to showcase my projects and achievements.",
      stack: ["NextJS", "React", "EmailJS", "Framer Motion", "Vercel"],
      features: [
        "Clean and modern design",
        "Responsive layout",
        "Knowledge Graph Visualization",
        "Interactive Elements",
      ],
      fields: ["web", "cloud"],
      github: "https://github.com/AloysiusLimMingZhou/Portfolio",
      website: "https://aloysiuslim.dev",
      x: 0.62, y: 0.62,
    },
  ],

  achievements: [
    {
      id: "a0", name: "SunCTF 2024", year: "2024", type: "Capture The Flag", note: "Participation", cluster: "competitions",
      // ── Edit below ──
      description: "Competed in SunCTF 2024, tackling a range of cybersecurity challenges spanning web exploitation, reverse engineering, and cryptography.",
      highlights: [
        "Gained hands-on experience with web exploitation challenges",
        "Practised reverse engineering and binary analysis techniques",
        "Collaborated as a team to solve cryptography puzzles",
      ],
      certificateImage: "/assets/certificates/a0-sunway-ctf-2024.png",
    },
    {
      id: "a1", name: "PayHack 2024", year: "2024", type: "Hackathon", note: "Participation", cluster: "competitions",
      // ── Edit below ──
      description: "Participated in PayHack 2024, a fintech-focused hackathon challenging teams to build innovative payment solutions within 24 hours.",
      highlights: [
        "Our team come up with Loan Shark platform, an innovative solution for users to make educational loan",
        "Designed UI/UX prototype using Figma for our solution platform",
        "Strengthened rapid prototyping and team collaboration skills",
      ],
      certificateImage: "/assets/certificates/a1-payhack-2024.png",
    },
    {
      id: "a2", name: "National AI Competition 2025", year: "2025", type: "AI Competition", note: "Top 10 Finalist", cluster: "competitions",
      // ── Edit below ──
      description: "Fine-tuned Google's ViT Base 16 model on a custom dataset to classify 8 types of Malaysian kuihs with real-time camera inference, achieving Top 10 Finalist placement nationally.",
      highlights: [
        "Achieved 96.88% validation accuracy and 96.92% F1 score",
        "Real-time camera-based kuih classification using fine-tuned ViT",
        "Placed Top 10 Finalist out of all national entries",
      ],
      certificateImage: "/assets/certificates/a2-national-ai-2025.png",
    },
    {
      id: "a3", name: "Sunway CTF 2025", year: "2025", type: "Capture The Flag", note: "Participation (Open Category)", cluster: "competitions",
      // ── Edit below ──
      description: "Competed in the Open Category of Sunway CTF 2025, taking on advanced challenges in reverse engineering, web exploitation, cryptography, forensics, binary exploitation and OSINT.",
      highlights: [
        "Entered the more competitive Open Category, had higher points than 1st team in Sunway Category",
        "Solved all cryptography challenges and 2 forensics challenges",
        "Placed in 32nd place overall in Open Category"
      ],
      certificateImage: "/assets/certificates/a3-sunway-ctf-2025.png",
    },
    {
      id: "a4", name: "APU International Battle of Hackers 2025", year: "2025", type: "Capture The Flag", note: "Participation", cluster: "competitions",
      // ── Edit below ──
      description: "Competed in APU's International Battle of Hackers 2025, an internationally attended CTF event featuring challenges across multiple cybersecurity domains.",
      highlights: [
        "Participated in an internationally attended CTF event",
        "Tackled multi-domain challenges including cryptography, forensics, web exploitation, OSINT, reverse engineering and binary exploitation",
        "Gained exposure to advanced-grade CTF competition and challenges",
      ],
      certificateImage: "/assets/certificates/a4-apu-battle-of-hackers-2025.png",
    },
    {
      id: "a5", name: "Kitahack 2026", year: "2026", type: "Hackathon", note: "Participation", cluster: "competitions",
      // ── Edit below ──
      description: "Built EduSign-Bridge at Kitahack 2026 — a Flutter mobile application bridging the communication gap for the deaf and hearing impaired using Gemini AI and TensorFlow sign language recognition.",
      highlights: [
        "Built real-time hand gesture recognition using TensorFlow",
        "Integrated Gemini API and Vertex AI for real-time translation",
        "Deployed on Firebase real-time database and storage",
      ],
      certificateImage: "/assets/certificates/a5-kitahack-2026.png",
    },
    {
      id: "a6", name: "MAHSA University Engineering, Science and Technology Exhibition 2026", year: "2026", type: "Project Showcase", note: "Bronze (Information Technology Category)", cluster: "competitions",
      // ── Edit below ──
      description: "Showcased HarvestVision at the MAHSA University ESTE 2026 exhibition, earning Bronze in the Information Technology category among competing university teams.",
      highlights: [
        "Showcased HarvestVision, a deep learning-powered mobile application for fruits and vegetables freshness classification using YOLO Nano model",
        "Awarded Bronze in the Information Technology Category",
        "Presented to a panel of industry and academic judges",
        "Competed against entries from multiple universities",
      ],
      certificate: "https://www.linkedin.com/posts/soon-wai-chik-a01a95100_huge-congratulations-to-the-incredible-students-ugcPost-7447960912621207552-2hf2?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFaeq70BBT09D-OoL-2gVND-yiBm4zlaJ8s",
    },
    {
      id: "a7", name: "National AI Competition 2026", year: "2026", type: "AI Competition", note: "Participation", cluster: "competitions",
      // ── Edit below ──
      description: "Competing in the National AI Competition 2026, developing an ensemble deep learning pipeline combining EfficientNet-B3 and ConvNeXt-Small for retinal diabetic severity classification.",
      highlights: [
        "Achieved 83.7% accuracy and 74.54% recall on imbalanced competition dataset",
        "Implemented Rank Fusion ensemble strategy across dual CNN architectures",
        "Deployed a full-stack web application for model inference",
      ],
      certificateImage: "/assets/certificates/a7-national-ai-2026.png",
    },
    {
      id: "a8", name: "Liga CTF 2026", year: "2026", type: "Capture The Flag", note: "Participation", cluster: "competitions",
      description: "Participated in Liga CTF 2026, hosted by the OWASP Kuala Lumpur Chapter from 22 May to 5 July 2026.",
      highlights: [
        "Participated in a multi-stage capture-the-flag competition",
        "Engaged with cybersecurity challenges hosted by the OWASP Kuala Lumpur Chapter",
        "Completed the competition programme conducted from 22 May to 5 July 2026",
      ],
      certificateImage: "/assets/certificates/a8-liga-ctf-2026.png",
    },
    {
      id: "a9", name: "Qwen Brainrot Hackathon", year: "2026", type: "Hackathon", note: "Finalist", cluster: "competitions",
      description: "Advanced to the physical finals of the Qwen Brainrot Hackathon, held on 25 July 2026 at Xsolla Curine Academy in Kuala Lumpur.",
      highlights: [
        "Advanced to the physical finals",
        "Recognized as a finalist in the Qwen Brainrot Hackathon",
        "Participated in the final event on 25 July 2026 in Kuala Lumpur",
      ],
      certificateImage: "/assets/certificates/a9-qwen-brainrot-hackathon-2026.png",
    },
    {
      id: "a10", name: "Tech FYP Competition Showcase & Awards 2026", year: "2026", type: "Project Showcase", note: "Participation", cluster: "competitions",
      description: "A competition recognizing the most innovative and mature final-year projects that provide practical solutions to problems faced by the community.",
      highlights: [
        "Built HealthConnect, an all-in-one Medical RAG, heart disease prediction MLOps, and full-stack application",
        "Implemented OAuth, JWT authentication, and an admin dashboard with role-based access control (RBAC) using PostgreSQL, Prisma, NestJS, Next.js, and Tailwind CSS",
        "Achieved 90% accuracy, 89.7% F1 score, 86.7% precision, 92.9% recall, and 96% ROC-AUC for heart disease prediction",
      ],
      certificateImage: "/assets/certificates/a10-tech-fyp-showcase-2026.png",
    },
  ],
};
