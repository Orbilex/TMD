# 🍩 Treat Me a Donut

**Treat Me a Donut** is a modern, smooth, and fully functional donation platform built for creators. This project serves as a comprehensive portfolio piece demonstrating a two-sided marketplace flow: from creator onboarding and dashboard management to secure payment processing using Stripe.

Built by **Michael**.

---

## ✨ Features

### 👨‍🎨 For Creators (The /creatordemo Experience)
- **Multi-step Onboarding:** A polished registration flow including profile setup and simulated Stripe Connect bank linking.
- **Personalized Dashboard:** A private area for creators to track their donut count, total revenue, and recent supporters.
- **Dynamic Profile Generation:** Creating an account instantly generates a public-facing donation page with custom branding.

### 🍩 For Supporters (The /demo Experience)
- **Seamless Payments:** Integrated with **Stripe Elements** for a secure, "on-page" checkout experience—no redirects.
- **Donut Multipliers:** Interactive UI to choose between 1, 3, or 5 donuts (or a custom amount).
- **Live Updates:** Payments made on the demo page instantly reflect in the Creator's dashboard stats via React Context.

### 🚀 Technical Highlights
- **Stripe SDK:** Implementation of `PaymentIntents` and official Stripe React components.
- **Framer Motion:** Used for micro-interactions, layout transitions, and the "Success" payment state.
- **Global State Management:** Data persistence using React Context and LocalStorage to simulate a backend experience.
- **Responsive Design:** A mobile-first approach using Tailwind CSS with a custom "Tawny" brand palette.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Payments:** [Stripe](https://stripe.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/treat-me-a-donut.git
cd treat-me-a-donut
