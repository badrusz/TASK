# Premium Task Management App

A high-end task management application built with Next.js 15, MongoDB, and Vanilla CSS.

## Features
- **Task Management**: Create, update, and categorize tasks.
- **Activity Chart**: Visualize your productivity over the last 7 days.
- **Focus Timer**: Built-in Pomodoro-style timer to stay focused.
- **Busy-ness Analysis**: Data-driven analysis of your current workload.
- **Smart Suggestions**: AI-inspired task prioritization.
- **Deadline Tracking**: Indicators for upcoming and overdue tasks.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup MongoDB**:
   Ensure MongoDB is running locally or provide a `MONGODB_URI` in `.env.local`.

3. **Seed Data (Optional)**:
   ```bash
   npx ts-node seed.ts
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Technology Stack
- **Framework**: Next.js (App Router)
- **Database**: MongoDB (Mongoose)
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)
- **Icons**: Lucide React
- **Charts**: Recharts
