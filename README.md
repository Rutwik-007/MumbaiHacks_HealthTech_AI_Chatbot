<p align="center">
  <img src="public/images/logo.png" alt="Arogya Mitra Logo" width="120" height="120">
</p>

<h1 align="center">🏥 Arogya Mitra - AI-Powered Health Advisory System</h1>

<p align="center">
  <strong>Bridging the gap between rural healthcare and modern AI technology</strong>
</p>

<p align="center">
  <a href="#problem-statement">Problem</a> •
  <a href="#solution">Solution</a> •
  <a href="#business-model">Business Model</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## 📋 Project Overview

**Arogya Mitra** (आरोग्य मित्र - "Health Friend" in Hindi) is an AI-powered multilingual health advisory chatbot designed specifically for rural India. The system provides accurate, accessible healthcare information in local languages, connecting citizens with essential health services while empowering ASHA workers and health officers with digital tools.

---

## 🚨 Problem Statement

### The Healthcare Awareness Crisis in India

India faces a critical challenge in disease awareness and preventive healthcare, particularly in rural areas where **65% of the population** resides but has access to only **20% of healthcare resources**.

#### Key Problems:

| Issue | Impact |
|-------|--------|
| **Language Barrier** | 90% of rural Indians don't understand English medical content |
| **Limited Access** | Only 1 doctor per 1,456 people (WHO recommends 1:1000) |
| **Low Awareness** | 60% of rural population unaware of common disease symptoms |
| **Delayed Treatment** | Average delay of 3-7 days in seeking medical help |
| **Misinformation** | Widespread health myths leading to wrong treatments |

### COVID-19 Pandemic: A Wake-Up Call

The COVID-19 pandemic brutally exposed India's healthcare communication gaps:

- **Information Chaos**: Misinformation spread faster than the virus itself
- **Rural Devastation**: Second wave hit rural areas with 3x higher mortality due to delayed awareness
- **ASHA Worker Overload**: 1 million+ ASHA workers struggled without digital tools
- **Language Barrier Deaths**: Many couldn't understand COVID protocols in English
- **Vaccine Hesitancy**: Misinformation in local languages caused widespread vaccine refusal

**Statistics from COVID-19 Impact:**
- 🔴 **530,000+ official deaths** (estimated actual: 4-5 million)
- 🔴 **47% of rural deaths** could have been prevented with timely information
- 🔴 **₹35,000 crore** lost due to misinformation-driven treatment delays
- 🔴 **68% of rural Indians** received COVID information too late

---

## 💰 Business Model & Government Opportunity

### Current Government Spending on Health Awareness

The Indian Government allocates significant budgets for health awareness programs:

| Program | Annual Budget (₹ Crore) |
|---------|------------------------|
| National Health Mission (NHM) | 36,000+ |
| Information, Education & Communication (IEC) | 2,500+ |
| ASHA Worker Program | 8,000+ |
| Digital Health Initiatives | 1,500+ |
| Epidemic/Pandemic Preparedness | 3,000+ |
| **Total Addressable Market** | **50,000+ Crore** |

### Revenue Model

#### 1. **Government B2G Contracts**
- Per-user licensing to State Health Departments
- Integration with National Health Stack (ABDM)
- ASHA worker digital empowerment program
- Pricing: ₹5-15 per citizen per year

#### 2. **CSR Partnerships**
- Healthcare companies' CSR initiatives
- Pharma companies' patient education programs
- Insurance companies' preventive health programs

#### 3. **Value-Based Pricing**
- Cost savings from reduced emergency visits: **₹500-2000 per avoided ER visit**
- Early detection savings: **₹10,000-50,000 per early cancer detection**
- Vaccination compliance improvement: **₹200-500 per completed immunization**

### Projected Revenue (5-Year)

| Year | Users | Revenue (₹ Cr) |
|------|-------|----------------|
| Y1 | 1 Million | 5 |
| Y2 | 10 Million | 50 |
| Y3 | 50 Million | 200 |
| Y4 | 100 Million | 400 |
| Y5 | 200 Million | 800 |

---

## ✨ Features

### Current Implementation

#### 🤖 AI Chatbot (Citizens)
- Multilingual support (Hindi, Marathi, English)
- Voice input/output for low-literacy users
- Disease symptom checker
- Nearest hospital/PHC finder
- Government scheme information
- Vaccination reminders

#### 👩‍⚕️ ASHA Worker Dashboard
- Beneficiary management (pregnant women, children, elderly)
- Vaccination tracking & reminders
- Home visit scheduling
- Pregnancy tracking with ANC checklist
- Health alerts & disease surveillance
- Training resources & IEC materials

#### 🏥 Health Officer Dashboard
- ASHA worker performance monitoring
- Village-wise vaccination coverage analytics
- Disease outbreak surveillance
- Report generation (HMIS integration ready)
- Resource allocation insights

#### 👨‍💼 Admin Dashboard
- User management across roles
- System analytics & usage metrics
- Content management
- Alert broadcasting

---

## 🚀 Future Integrations

### Phase 1: Communication (Q1 2026)
- **WhatsApp Business API Integration**
  - Reach 500M+ WhatsApp users in India
  - No app download required
  - Works on basic smartphones
  - Voice message support for low-literacy users

### Phase 2: Government Integration (Q2 2026)
- **Ayushman Bharat Digital Mission (ABDM)**
  - ABHA ID integration for health records
  - DigiLocker integration for document storage
  - CoWIN integration for vaccination records

- **National Health Stack**
  - Unified Health Interface (UHI) compliance
  - Health Facility Registry integration
  - Healthcare Professional Registry integration

### Phase 3: Advanced Features (Q3 2026)
- **AI Enhancements**
  - Image-based diagnosis (skin conditions, eye diseases)
  - X-ray/scan preliminary analysis
  - Personalized health recommendations

- **IoT Integration**
  - Bluetooth BP monitor sync
  - Glucometer integration
  - Pulse oximeter readings

### Phase 4: Ecosystem (Q4 2026)
- **Telemedicine Integration**
  - Video consultation with doctors
  - E-prescription support
  - Medicine delivery integration

- **Insurance & Payments**
  - Ayushman Bharat claim assistance
  - UPI payments for services
  - Health insurance recommendations

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library with Server Components |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **Framer Motion** | Smooth animations |

### Backend & AI
| Technology | Purpose |
|------------|---------|
| **Vercel AI SDK** | Unified LLM interface |
| **xAI Grok** | Primary LLM for chat responses |
| **OpenAI GPT-4** | Fallback and specialized tasks |
| **Fireworks AI** | Fast inference for real-time responses |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| **PostgreSQL (Neon)** | Primary database for users, chats |
| **Drizzle ORM** | Type-safe database queries |
| **Vercel Blob** | File storage (images, documents) |
| **ChromaDB** | Vector database for RAG |

### Authentication & Security
| Technology | Purpose |
|------------|---------|
| **Auth.js (NextAuth)** | Authentication with role-based access |
| **bcrypt** | Password hashing |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Vercel** | Deployment & edge functions |
| **Vercel AI Gateway** | LLM routing & rate limiting |

### Why These Technologies?

1. **xAI Grok**: Selected for its strong multilingual capabilities, especially Hindi/Marathi, and cost-effective API pricing for government-scale deployment.

2. **Next.js 15 App Router**: Server Components reduce client-side JavaScript by 60%, crucial for users on slow 2G/3G networks.

3. **PostgreSQL with Drizzle**: Enterprise-grade reliability required for health data, with type-safe queries preventing SQL injection.

4. **Vercel Edge Network**: 100+ global edge locations ensure <100ms response times across India.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 9+
- PostgreSQL database (or Neon account)
- API keys for AI providers

### Environment Variables

Create a `.env.local` file with:

```env
# Database
POSTGRES_URL=your_postgres_connection_string

# Authentication
AUTH_SECRET=your_auth_secret_key

# AI Providers
XAI_API_KEY=your_xai_api_key
OPENAI_API_KEY=your_openai_api_key
FIREWORKS_API_KEY=your_fireworks_api_key

# Optional: Vercel AI Gateway (for production)
AI_GATEWAY_API_KEY=your_gateway_key

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Installation

```bash
# Clone the repository
git clone https://github.com/shitolerutwik-collab/arogya-mitra.git
cd arogya-mitra

# Install dependencies
pnpm install

# Set up database
pnpm db:generate
pnpm db:migrate

# Start development server
pnpm dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@arogya.gov.in | demo123 |
| Health Officer | officer@arogya.gov.in | demo123 |
| ASHA Worker | asha@arogya.gov.in | demo123 |
| Citizen | citizen@example.com | demo123 |

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/           # Login, Register pages
│   ├── (chat)/           # Citizen chatbot
│   ├── (admin)/          # Admin dashboard
│   ├── (asha)/           # ASHA worker portal
│   └── (officer)/        # Health officer portal
├── components/           # Reusable UI components
├── lib/
│   ├── ai/              # AI configuration & prompts
│   ├── db/              # Database schema & queries
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── tests/               # E2E tests with Playwright
```

---

## 🧪 Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test tests/e2e/chat.spec.ts
```

---

## 📊 Database Commands

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Push schema changes (development)
pnpm db:push
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shitolerutwik-collab/arogya-mitra)

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for Rural India

---

## 📞 Contact

- **Email**: contact@arogyamitra.in
- **Website**: [arogyamitra.in](https://arogyamitra.in)
- **Twitter**: [@ArogyaMitraAI](https://twitter.com/ArogyaMitraAI)

---

<p align="center">
  <strong>🇮🇳 Made in India | स्वस्थ भारत, समृद्ध भारत 🇮🇳</strong>
</p>
