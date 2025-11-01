

# TechBridge  
**From Drawer to Destiny — One Spare Device at a Time**

> **You don’t need wealth to be a hero. You just need one thing you’re not using.**  
> TechBridge connects everyday people with everyday tools — quietly, anonymously, and without performance.

---

## The Problem  
- **Surplus**: 70% of households have at least one unused device (laptop, phone, BP monitor, tablet, charger).  
- **Gap**: Millions can’t access education, healthcare, or work — not because they’re “poor,” but because they’re **one tool short**.  
- **Current solutions**: Charity models demand stories, photos, and public gratitude. That’s not help. That’s performance.

---

## The Solution  
**TechBridge is the silent handoff.**  
- **List** any device in **30 seconds** (photo + one sentence).  
- **We** pick up, sanitize, and deliver — **no names, no faces, no posts**.  
- **Recipients** browse real, local items and request with **one line**:  
  > “I’m a nurse. My tablet died mid-shift.”  
  > “I need a webcam to interview for a job.”  

**No pity. No cameras. Just flow.**

---

## Features (MVP – Built in 48h)

| Feature | Status |
|-------|--------|
| Device listing with image upload | Done |
| Anonymous request flow | Done |
| Location-based filtering (mock geohash) | Done |
| 100% privacy — no user profiles shown | Done |
| Parallax landing page (Next.js + Framer Motion) | Done |
| Responsive, accessible UI | Done |
| Health devices supported (BP, glucose, etc.) | Done |
| Deployed on Vercel | Done |

---

## Tech Stack

```bash
Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
Supabase (Auth, DB, Realtime, Edge Functions)
Framer Motion + react-parallax
Cloudinary (image optimization)
Vercel (hosting + analytics)

Live Demo**techbridge.vercel.app**  (Try listing a device or browsing — all data is mock but feels real.)Setup (Local Dev)bash

# Clone
git clone https://github.com/yourusername/techbridge.git
cd techbridge

# Install
npm install

# Env (copy .env.example)
cp .env.example .env.local
# Add your Supabase + Cloudinary keys

# Run
npm run dev

Open http://localhost:3000Project Structure

/app
  /auth        → Sign-in / Contributor flows
  /dashboard   → User portals
  /api         → Supabase Edge Functions
/components
  /ui          → shadcn components
  /navigation, /footer
/public
  /images      → Transparent PNGs (laptop, BP monitor, etc.)
  /gifs        → techbridge-hero.gif

What’s NextLocker network API (Amazon, local hubs)  
AI wear-level matching (battery health → use case)  
Non-profit bulk routing  
Health device sanitization certification  
10-city pilot (2026)

Built forHackathons · Humanity · Quiet Impact“I listed my old tablet at 2 AM. By noon, a med student had it. No thank you. No post. Just… done.”
— Anonymous user
TeamYou (the one reading this)  
Your drawer  
5,234 acts of quiet courage

TechBridge
Because you already have what someone needs.

```

