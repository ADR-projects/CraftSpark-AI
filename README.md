# CraftSpark-AI

An art and DIY craft idea generator powered by AI. Discover creative projects based on your skillset and recyclable materials. Got waste? Recycle it into beautiful art.

## Tech Stack

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-39B78F?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

## Features

- AI-powered craft suggestion engine tailored to your materials and skills.
- Custom JWT-based authentication system.
- Direct inline saving of crafts to your personal inspiration board.
- Dynamic Bento Box UI with AI-generated gradients and emojis.
- Manage your account securely with full data deletion capabilities.

## Preview

### Home Page Generation
![Home Page](./public/craft-spark-home.png)

### Saved Ideas Profile
![Saved Ideas](./public/saved-ideas.png)

## Status

Currently using the Groq API (LLaMA 3) for fast AI generation. User authentication and craft saving are fully integrated with MongoDB.

--- 

## Server Execution Guide

**1. Install Dependencies**

```bash
cd CraftSpark-AI
npm install
```

**2. Configure Environment Variables**

Create a `.env` file in the root directory and add the following keys:

```bash
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb://localhost:27017/craftspark
JWT_SECRET=your_secure_jwt_secret_here
```

**3. Run the Development Server**

The project uses `concurrently` to run both the Node backend and Next.js frontend simultaneously.

```bash
npm run dev
```
