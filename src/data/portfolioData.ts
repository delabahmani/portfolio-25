import type { IconData } from "../types";

export const desktopIcons: IconData[] = [
  {
    id: "about-me",
    name: "about me",
    icon: "/assets/images/folder-closed.webp",
    type: "folder",
    x: 50,
    y: 50,
    content: [
      {
        id: "about-txt",
        name: "about.txt",
        icon: "/assets/images/notepad.webp",
        type: "file",
        x: 0,
        y: 0,
        description: `frontend developer & UX/UI enthusiast
        hi! i'm a passionate developer who loves creating beautiful, functional web experiences.

        🚀 What I Do:
        • Build responsive web applications
        • Create intuitive user interfaces
        • Develop with modern frameworks
        • Focus on performance & accessibility

        💻 Tech Stack:
        • React, Next.js, TypeScript
        • Tailwind CSS, SCSS
        • Node.js, Express
        • MongoDB, PostgreSQL
        • Git, Docker, AWS

        🎯 Currently:
        • Learning new technologies
        • Building exciting projects
        • Open to new opportunities`,
      },
    ],
  },
  {
    id: "projects",
    name: "projects",
    icon: "/assets/images/folder-closed.webp",
    type: "folder",
    x: 50,
    y: 180,
    content: [
      {
        id: "nsanity",
        name: "nsanity",
        icon: "/assets/images/nsanity.webp",
        type: "folder",
        x: 0,
        y: 0,
        content: [
          {
            id: "nsanity-img1",
            name: "img 1",
            icon: "/assets/images/projects/nsanity/nsanity-img1.JPG",
            type: "file",
            x: 0,
            y: 0,
            description: "/assets/images/projects/nsanity/nsanity-img1.JPG",
          },
          {
            id: "nsanity-img2",
            name: "img 2",
            icon: "/assets/images/nsanity-img2.webp",
            type: "file",
            x: 80,
            y: 0,
            description: "/assets/images/projects/nsanity/screenshot2.png",
          },
          {
            id: "nsanity-link",
            name: "nsanity link",
            icon: "/assets/images/explorer1.webp",
            type: "app",
            x: 160,
            y: 0,
            url: "https://nsanity.shop",
          },
          {
            id: "nsanity-info",
            name: "info.txt",
            icon: "/assets/images/notepad.webp",
            type: "file",
            x: 240,
            y: 0,
            description: `nsanity is an ecommerce platform made with next.js, tailwind css and typescript.`,
          },
        ],
      },
      {
        id: "pantheras-project",
        name: "pantheras",
        icon: "/assets/images/pantheras.webp",
        type: "folder",
        x: 80,
        y: 0,
        content: [
          {
            id: "pantheras-img1",
            name: "img 1",
            icon: "/assets/images/folder-open-note.webp",
            type: "file",
            x: 0,
            y: 0,
            description: "/assets/images/projects/pantheras/screenshot1.png",
          },
          {
            id: "pantheras-img2",
            name: "img 2",
            icon: "/assets/images/folder-open-note.webp",
            type: "file",
            x: 80,
            y: 0,
            description: "/assets/images/projects/pantheras/screenshot2.png",
          },
          {
            id: "pantheras-link",
            name: "link to site",
            icon: "/assets/images/explorer2.webp",
            type: "app",
            x: 160,
            y: 0,
            url: "https://pantheras.ca",
          },
          {
            id: "pantheras-info",
            name: "info.txt",
            icon: "/assets/images/notepad.webp",
            type: "file",
            x: 240,
            y: 0,
            description: `🛒 Pantheras - E-commerce Platform

📋 Project Overview:
Modern e-commerce platform with sleek design and seamless shopping experience.

🔧 Technologies Used:
• Frontend: React, TypeScript, Styled Components
• Backend: Node.js, Express.js
• Database: MongoDB with Mongoose
• Payments: Stripe API integration
• State Management: Redux Toolkit
• Deployment: Netlify + Heroku

✨ Key Features:
• Product catalog with advanced filtering
• Shopping cart and wishlist
• Secure checkout process
• User account management
• Order tracking system
• Admin dashboard
• Mobile-responsive design

🎯 Challenges Solved:
• Payment processing integration
• Inventory management system
• Search and filtering logic
• Cart state persistence
• Image optimization

💡 What I Learned:
• E-commerce best practices
• Payment gateway integration
• Advanced React patterns
• MongoDB aggregation pipelines`,
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    name: "contact",
    icon: "/assets/images/folder-closed.webp",
    type: "folder",
    x: 50,
    y: 310,
    content: [
      {
        id: "contact-info",
        name: "contact.txt",
        icon: "/assets/images/notepad.webp",
        type: "file",
        x: 0,
        y: 0,
        description: `📧 Get In Touch

I'm always open to discussing new opportunities, collaborations, or just having a chat about technology!

📬 Contact Information:
• Email: your.email@example.com
• Phone: +1 (555) 123-4567
• Location: Your City, State

🌐 Online Presence:
• Portfolio: https://your-portfolio.com
• LinkedIn: linkedin.com/in/yourprofile
• GitHub: github.com/yourusername
• Twitter: @yourusername

💼 Available For:
• Full-time positions
• Freelance projects
• Contract work
• Consulting opportunities

🕒 Response Time:
I typically respond to emails within 24 hours.

Let's build something amazing together! 🚀`,
      },
    ],
  },
];
