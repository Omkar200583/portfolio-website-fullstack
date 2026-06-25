/**
 * Database Seeder
 * Run: node seed.js          → seed the database
 * Run: node seed.js --clear  → wipe everything
 * Run: node seed.js --admin  → seed only the admin user
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Certificate from "./models/Certificate.js";
import Experience from "./models/Experience.js";
import Blog from "./models/Blog.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_db";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const adminUser = {
  name: "Portfolio Admin",
  email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
  password: process.env.ADMIN_PASSWORD || "Admin@123",
  role: "admin",
};

const skills = [
  { name: "React", category: "frontend", proficiency: 90, color: "#61DAFB", featured: true },
  { name: "Node.js", category: "backend", proficiency: 88, color: "#339933", featured: true },
  { name: "TypeScript", category: "languages", proficiency: 85, color: "#3178C6", featured: true },
  { name: "MongoDB", category: "database", proficiency: 82, color: "#47A248", featured: true },
  { name: "Python", category: "languages", proficiency: 80, color: "#3776AB" },
  { name: "Express.js", category: "frameworks", proficiency: 87, color: "#000000" },
  { name: "Tailwind CSS", category: "frontend", proficiency: 90, color: "#06B6D4" },
  { name: "Docker", category: "devops", proficiency: 70, color: "#2496ED" },
  { name: "PostgreSQL", category: "database", proficiency: 75, color: "#4169E1" },
  { name: "OpenAI API", category: "tools", proficiency: 88, color: "#412991", featured: true },
  { name: "Git", category: "tools", proficiency: 92, color: "#F05032" },
  { name: "AWS", category: "devops", proficiency: 65, color: "#FF9900" },
];

const projects = [
  {
    title: "AI Portfolio Platform",
    description: "A full-stack portfolio platform with integrated AI tools including chat assistant, resume analyzer, mock interviewer, and career advisor powered by OpenAI GPT-4.",
    shortDescription: "AI-powered developer portfolio with GPT-4 integrations.",
    techStack: ["React", "Node.js", "MongoDB", "OpenAI", "Cloudinary"],
    category: "fullstack",
    demoUrl: "https://yourportfolio.com",
    githubUrl: "https://github.com/yourusername/portfolio",
    featured: true,
    status: "completed",
  },
  {
    title: "Real-Time Chat Application",
    description: "A scalable real-time messaging app built with Socket.io, featuring rooms, direct messages, file sharing, and read receipts.",
    shortDescription: "Real-time messaging with Socket.io.",
    techStack: ["React", "Node.js", "Socket.io", "Redis", "MongoDB"],
    category: "fullstack",
    githubUrl: "https://github.com/yourusername/chat-app",
    featured: true,
    status: "completed",
  },
  {
    title: "E-Commerce REST API",
    description: "A production-ready REST API for e-commerce with authentication, product management, orders, payments via Stripe, and comprehensive admin dashboard.",
    shortDescription: "Production REST API with Stripe payments.",
    techStack: ["Node.js", "Express", "MongoDB", "Stripe", "Redis"],
    category: "backend",
    githubUrl: "https://github.com/yourusername/ecommerce-api",
    featured: false,
    status: "completed",
  },
];

const experiences = [
  {
    title: "Full Stack Developer",
    company: "Tech Startup Inc.",
    location: "Remote",
    type: "full-time",
    startDate: new Date("2023-01-01"),
    isCurrent: true,
    description: "Building scalable web applications and AI-powered features for a SaaS platform serving 10,000+ users.",
    responsibilities: [
      "Architected and developed RESTful APIs using Node.js and Express",
      "Built React frontends with TypeScript and Tailwind CSS",
      "Integrated OpenAI APIs for AI-driven product features",
      "Improved system performance by 40% through caching and query optimization",
    ],
    achievements: [
      "Reduced API response time by 60% through Redis caching",
      "Led migration from monolith to microservices architecture",
    ],
    techStack: ["React", "Node.js", "TypeScript", "MongoDB", "Redis", "Docker"],
    companyUrl: "https://techstartup.com",
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Co.",
    location: "Hybrid",
    type: "full-time",
    startDate: new Date("2021-06-01"),
    endDate: new Date("2022-12-31"),
    isCurrent: false,
    description: "Developed responsive web applications and e-commerce solutions for multiple clients.",
    responsibilities: [
      "Developed 15+ client websites using React and Next.js",
      "Implemented SEO best practices resulting in 30% traffic increase",
      "Collaborated with design team to implement pixel-perfect UIs",
    ],
    achievements: ["Delivered all projects on time", "Received client satisfaction score of 4.9/5"],
    techStack: ["React", "Next.js", "JavaScript", "CSS", "WordPress"],
  },
];

const certificates = [
  {
    title: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    issueDate: new Date("2023-06-15"),
    expiryDate: new Date("2026-06-15"),
    credentialUrl: "https://aws.amazon.com/certification/",
    category: "cloud",
    skills: ["AWS", "Cloud Architecture", "Lambda", "S3"],
    featured: true,
  },
  {
    title: "MongoDB Certified Developer",
    issuer: "MongoDB University",
    issueDate: new Date("2023-02-10"),
    category: "database",
    skills: ["MongoDB", "NoSQL", "Aggregation"],
    featured: true,
  },
];

const sampleBlog = {
  title: "Building an AI-Powered Portfolio with OpenAI and Node.js",
  content: `# Building an AI-Powered Portfolio

In this post, I'll walk you through how I integrated OpenAI's GPT-4 API into a developer portfolio to create AI-powered tools.

## Why AI in a Portfolio?

A portfolio is more than a list of projects. With AI, you can offer visitors:
- An intelligent chat assistant that answers questions about your work
- A resume analyzer that gives instant ATS feedback  
- A mock interviewer to help job seekers practice

## Architecture Overview

The backend is built on Node.js + Express, with OpenAI SDK handling all AI calls...`,
  excerpt: "Learn how to build AI-powered tools in your developer portfolio using OpenAI's GPT-4 API and Node.js.",
  tags: ["AI", "OpenAI", "Node.js", "Portfolio"],
  category: "tutorial",
  status: "published",
  featured: true,
  publishedAt: new Date(),
};

// ─── Seeder Functions ─────────────────────────────────────────────────────────

const clearDatabase = async () => {
  console.log("🗑️  Clearing database...");
  await Promise.all([
    User.deleteMany(),
    Project.deleteMany(),
    Skill.deleteMany(),
    Certificate.deleteMany(),
    Experience.deleteMany(),
    Blog.deleteMany(),
  ]);
  console.log("✅ Database cleared.");
};

const seedAdmin = async () => {
  const existing = await User.findOne({ email: adminUser.email });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${adminUser.email}`);
    return existing;
  }
  const admin = await User.create(adminUser);
  console.log(`✅ Admin created: ${admin.email}`);
  return admin;
};

const seedAll = async (admin) => {
  console.log("🌱 Seeding skills...");
  await Skill.insertMany(skills);

  console.log("🌱 Seeding projects...");
  await Project.insertMany(projects);

  console.log("🌱 Seeding experiences...");
  await Experience.insertMany(experiences);

  console.log("🌱 Seeding certificates...");
  await Certificate.insertMany(certificates);

  console.log("🌱 Seeding blog post...");
  await Blog.create({ ...sampleBlog, author: admin._id });

  console.log("✅ All seed data inserted.");
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("📦 MongoDB Connected");

    const args = process.argv.slice(2);

    if (args.includes("--clear")) {
      await clearDatabase();
    } else if (args.includes("--admin")) {
      await seedAdmin();
    } else {
      await clearDatabase();
      const admin = await seedAdmin();
      await seedAll(admin);

      console.log("\n🎉 SEED COMPLETE");
      console.log("Admin:", adminUser.email);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err.message);
    process.exit(1);
  }
};

run();

run().catch((err) => {
  console.error("❌ Seeder error:", err.message);
  process.exit(1);
});