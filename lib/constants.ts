export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const skills = [
  { name: "React", level: 90 },
  { name: "Next.js", level: 85 },
  { name: "TypeScript", level: 88 },
  { name: "Tailwind CSS", level: 92 },
  { name: "Node.js", level: 80 },
  { name: "Python", level: 75 },
  { name: "Framer Motion", level: 85 },
  { name: "JavaScript", level: 88 },
];

export const projects = [
  {
    id: 1,
    title: "AI-Based Cancer Detection from Chest X-Rays",
    description: "Developed an end-to-end AI-powered cancer detection system for chest X-ray analysis using deep learning and full-stack web technologies. Implemented a PyTorch-based transfer learning pipeline (ResNet50/ResNet101) with class balancing, data augmentation, and Grad-CAM interpretability, achieving up to 96% AUC and 91% accuracy. Built RESTful inference APIs using Node.js and Express, along with a React + Vite frontend for real-time predictions, confidence scores, heatmap visualization, and batch analysis—enabling a scalable and clinically interpretable diagnostic workflow.",
    image: "/images/cancer-detection/hero.png",
    gallery: [
      {
        src: "/images/cancer-detection/hero.png",
        alt: "AI Cancer Detection Hero Image",
        caption: "System Overview"
      },
      {
        src: "/images/cancer-detection/dashboard.png",
        alt: "Cancer Detection Dashboard",
        caption: "Analysis Dashboard"
      },
      {
        src: "/images/cancer-detection/heatmap.png",
        alt: "Grad-CAM Heatmap Visualization",
        caption: "Heatmap Visualization"
      },
      {
        src: "/images/cancer-detection/results.png",
        alt: "Detection Results",
        caption: "Results & Analysis"
      }
    ],
    technologies: ["Python", "PyTorch", "Deep Learning", "ResNet", "Grad-CAM", "Node.js", "Express.js", "React", "Vite", "REST APIs"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
  {
    id: 2,
    title: "MEDIAXIS",
    description: "Developed a full-stack hospital management web application to streamline patient–doctor interactions and hospital operations. Implemented secure authentication for patients and doctors, appointment scheduling, and role-based access control. Designed and consumed RESTful APIs following a layered architecture to ensure scalability, maintainability, and clean separation of concerns. Built a mobile-responsive user interface to deliver a seamless experience across devices and integrated the backend with a relational database for efficient data management.",
    image: "/images/MEDIAXIS/hero.png",
    gallery: [
      {
        src: "/images/MEDIAXIS/hero.png",
        alt: "MEDIAXIS Hero Image",
        caption: "System Overview"
      },
      {
        src: "/images/MEDIAXIS/Patient Registration.png",
        alt: "Patient Registration",
        caption: "Patient Registration"
      },
      {
        src: "/images/MEDIAXIS/Appointment Booking.png",
        alt: "Appointment Booking",
        caption: "Patient Booking Appointment"
      },
      {
        src: "/images/MEDIAXIS/Doctor Registration.png",
        alt: "Doctor Registration",
        caption: "Doctor Registration"
      },
      {
        src: "/images/MEDIAXIS/Appointments.png",
        alt: "Appointments",
        caption: "Doctor Accepting or Rejecting the Appointments"
      }
    ],
    technologies: ["Java", "Spring Boot", "REST APIs", "React.js", "MySQL", "HTML", "CSS", "JavaScript"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
  {
    id: 3,
    title: "Crypto Tracker",
    description: "Developed a full-stack cryptocurrency tracking web application using React, Flask, and MySQL, enabling users to monitor real-time crypto prices, analyze historical trends, manage a personalized portfolio, and track top-performing coins. Integrated live market data using the CoinGecko API and implemented features like watchlists, top gainers, and portfolio insights with a scalable backend architecture.",
    image: "/images/crypto_tracker/hero.png",
    gallery: [
      {
        src: "/images/crypto_tracker/hero.png",
        alt: "Crypto Tracker Hero Image",
        caption: "System Overview"
      },
      {
        src: "/images/crypto_tracker/Portfolio.png",
        alt: "Portfolio",
        caption: "Analysis Portfolio"
      },
      {
        src: "/images/crypto_tracker/watchlist.png",
        alt: "Watchlist",
        caption: "Watchlist"
      }
    ],
    technologies: ["React.js", "Flask", "MySQL", "CoinGecko API", "REST APIs"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
  {
    id: 4,
    title: "3D Portfolio Website – Interactive & Animated",
    description: "A modern, interactive 3D portfolio website featuring smooth animations, a Spline-based 3D robot, cinematic transitions, and responsive UI. Built to showcase projects with premium motion design and optimized performance across devices. Includes dynamic background effects, smooth page transitions, and an interactive experience that engages visitors while maintaining excellent performance and accessibility standards.",
    image: "/images/portfolio/hero.png",
    gallery: [
      {
        src: "/images/portfolio/hero.png",
        alt: "3D Portfolio Hero",
        caption: "Interactive Portfolio Hero"
      }
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Spline", "JavaScript"],
    link: "https://example.com",
    github: "https://github.com/example",
  },
];

export const experiences = [
  {
    id: 1,
    title: "Research Co-Head",
    company: "Artificial Intelligence Society, Bennett University",
    period: "Present",
    description: "Currently working as a Research Co-Head, contributing to AI-focused research initiatives and collaborative projects.",
    technologies: ["AI Research", "Collaborative Projects"],
  },
  {
    id: 2,
    title: "Researcher",
    company: "Mobilon, Bennett University",
    period: "Jan 2025 – Aug 2025",
    description: "Worked as a researcher on applied technology projects, focusing on problem-solving and research-driven development.",
    technologies: ["Research", "Applied Technology"],
  },
  {
    id: 3,
    title: "Frontend Developer (Participant)",
    company: "Smart India Hackathon (SIH) 2025, Bennett University",
    period: "2025",
    description: "Participated as a Frontend Developer, building responsive and user-friendly interfaces under competitive conditions.",
    technologies: ["Frontend Development", "React", "UI/UX"],
  },
  {
    id: 4,
    title: "Frontend Developer (Participant)",
    company: "Project Showcase 2025, Bennett University",
    period: "2025",
    description: "Participated as a Frontend Developer, showcasing project work with a focus on UI, usability, and presentation.",
    technologies: ["Frontend Development", "UI Design", "Presentation"],
  },
];

export const socialLinks = {
  github: "https://github.com/Arpit-desgin",
  linkedin: "https://www.linkedin.com/in/arpit-bhardwaj-9a499631a/",
  email: "mailto:bhardwajarpit507@gmail.com",
};

