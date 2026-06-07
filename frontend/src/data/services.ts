export interface ServiceDetail {
  overview: string;
  benefits: string[];
  curriculum: string[];
  duration: string;
  target: string;
}

export interface ServiceData {
  num: string;
  title: string;
  slug: string;
  desc: string;
  tag: string;
  details: ServiceDetail;
}

export const services: ServiceData[] = [
  {
    num: "01",
    title: "QuickBooks Training",
    slug: "quickbooks-training",
    desc: "Master QuickBooks Online and Desktop with practical, job-ready exercises tailored for Nepali accounting professionals.",
    tag: "Beginner → Advanced",
    details: {
      overview: "This comprehensive training program takes you from a complete beginner to a confident QuickBooks user. You'll learn both QuickBooks Online and Desktop versions, covering everything from setting up a company file to generating complex financial reports. Our hands-on approach ensures you gain real-world experience with practical exercises based on actual Nepali accounting scenarios.",
      benefits: [
        "Hands-on training with real QuickBooks company files",
        "Covers both Online and Desktop versions",
        "Learn industry best practices for bookkeeping",
        "Job-ready skills for accounting positions",
        "Certificate of completion",
        "Lifetime access to course materials",
      ],
      curriculum: [
        "Setting up QuickBooks for your business",
        "Chart of accounts and customization",
        "Managing customers, vendors, and employees",
        "Bank reconciliation and credit card management",
        "Reporting and financial statement analysis",
        "Payroll setup and processing",
        "Budgeting and forecasting",
        "Advanced features and shortcuts",
      ],
      duration: "8 Weeks (2 sessions per week)",
      target: "Aspiring accountants, bookkeepers, and small business owners looking to master QuickBooks.",
    },
  },
  {
    num: "02",
    title: "Xero Certification Prep",
    slug: "xero-certification-prep",
    desc: "Guided instruction, real case studies, and exam-focused practice to achieve your Xero Advisor Certification.",
    tag: "Certification",
    details: {
      overview: "Prepare for the Xero Advisor Certification exam with our structured program. We provide guided instruction, real-world case studies, and targeted practice exams to ensure you pass with confidence. Our instructors are certified Xero advisors with years of experience in cloud accounting.",
      benefits: [
        "Comprehensive exam preparation materials",
        "Mock exams with real-world scenarios",
        "One-on-one mentoring sessions",
        "Xero Advisor Certification upon passing",
        "Access to Xero practice environment",
        "Job placement assistance for certified candidates",
      ],
      curriculum: [
        "Introduction to Xero and cloud accounting",
        "Setting up organizations and chart of accounts",
        "Invoicing, quotes, and sales management",
        "Purchases, bills, and expense tracking",
        "Bank reconciliation and cash management",
        "Fixed assets and depreciation",
        "Multi-currency and international transactions",
        "Final exam preparation and review",
      ],
      duration: "6 Weeks (2 sessions per week)",
      target: "Accountants and bookkeepers aiming for Xero Advisor Certification and global career opportunities.",
    },
  },
  {
    num: "03",
    title: "Global Opportunity Program",
    slug: "global-opportunity-program",
    desc: "CV building, interview prep, and direct introductions to international accounting firms recruiting from Nepal.",
    tag: "Career Development",
    details: {
      overview: "Our Global Opportunity Program is designed to bridge the gap between Nepali accounting professionals and international employers. We provide end-to-end career support including professional CV building, interview preparation, and direct introductions to a network of international accounting firms actively recruiting from Nepal.",
      benefits: [
        "Professional CV and LinkedIn profile optimization",
        "Mock interviews with industry experts",
        "Direct introductions to international recruiting firms",
        "Visa and relocation guidance",
        "Ongoing career coaching and support",
        "Access to exclusive job opportunities",
      ],
      curriculum: [
        "International CV writing workshop",
        "LinkedIn profile optimization for global roles",
        "Interview techniques and cultural preparation",
        "Understanding international accounting standards (IFRS vs GAAP)",
        "Cross-cultural communication skills",
        "Salary negotiation and contract review",
        "Visa process and relocation planning",
        "Ongoing mentorship and career support",
      ],
      duration: "4 Weeks + Ongoing Support",
      target: "Experienced Nepali accounting professionals seeking international career opportunities.",
    },
  },
  {
    num: "04",
    title: "MYOB & SAGE Training",
    slug: "myob-sage-training",
    desc: "Popular in Australian, UK, and Middle Eastern markets — master these platforms and open more global doors.",
    tag: "Software Mastery",
    details: {
      overview: "MYOB and SAGE are among the most widely used accounting platforms in Australia, the UK, and the Middle East. This course gives you hands-on experience with both platforms, covering everything from basic setup to advanced features. You'll gain the skills needed to work in international accounting roles with confidence.",
      benefits: [
        "Hands-on training with both MYOB and SAGE",
        "Covers Australian, UK, and Middle Eastern tax rules",
        "Real-world scenarios and case studies",
        "International job readiness",
        "Certificate of completion for each platform",
        "Lifetime access to practice files",
      ],
      curriculum: [
        "MYOB basics: company setup and chart of accounts",
        "MYOB payroll and inventory management",
        "MYOB reporting and BAS preparation",
        "SAGE fundamentals: navigation and setup",
        "SAGE accounts payable and receivable",
        "SAGE financial reporting and analysis",
        "International tax compliance (GST, VAT)",
        "Cross-platform comparison and migration",
      ],
      duration: "10 Weeks (2 sessions per week)",
      target: "Accountants seeking proficiency in MYOB and SAGE for roles in Australia, UK, and Middle Eastern markets.",
    },
  },
  {
    num: "05",
    title: "1-on-1 Mentorship",
    slug: "one-on-one-mentorship",
    desc: "Personalized sessions with expert mentors to tackle your specific career challenges and accelerate your growth.",
    tag: "Personalized",
    details: {
      overview: "Our 1-on-1 mentorship program pairs you with an experienced accounting professional who provides personalized guidance tailored to your career goals. Whether you're preparing for a certification, transitioning to a new role, or seeking career advancement, your mentor will work with you one-on-one to create a customized development plan.",
      benefits: [
        "Personalized learning path tailored to your goals",
        "Flexible scheduling to fit your availability",
        "Direct access to industry expert mentors",
        "Focused support on your specific challenges",
        "Career guidance and networking advice",
        "Accountability and progress tracking",
      ],
      curriculum: [
        "Initial assessment and goal setting",
        "Customized skill development plan",
        "Technical skill enhancement sessions",
        "Soft skills and professional development",
        "Industry-specific guidance",
        "Career strategy and progression planning",
        "Networking and personal branding",
        "Ongoing support and progress reviews",
      ],
      duration: "Flexible (3–6 months recommended)",
      target: "Accounting professionals at any career stage seeking personalized guidance and accelerated growth.",
    },
  },
  {
    num: "06",
    title: "Excel for Accountants",
    slug: "excel-for-accountants",
    desc: "Advanced Excel, pivot tables, and financial modelling skills — the power tools every global accountant must have.",
    tag: "Power Skills",
    details: {
      overview: "Excel remains the most essential tool in an accountant's toolkit. This course takes you beyond basic spreadsheets into advanced Excel techniques specifically tailored for accounting and finance professionals. From complex formulas to dynamic dashboards, you'll master the Excel skills that employers value most.",
      benefits: [
        "Accounting-specific Excel training",
        "Master pivot tables and advanced formulas",
        "Build professional financial models",
        "Create interactive dashboards and reports",
        "Automate repetitive tasks with macros",
        "Certificate of completion",
      ],
      curriculum: [
        "Excel fundamentals for accountants",
        "Advanced formulas and functions (VLOOKUP, INDEX-MATCH, IF statements)",
        "Pivot tables and data analysis",
        "Financial modeling and forecasting",
        "Data visualization and dashboard creation",
        "Macros and VBA for automation",
        "Power Query and Power Pivot",
        "Case studies: real accounting scenarios",
      ],
      duration: "6 Weeks (2 sessions per week)",
      target: "Accountants and finance professionals who want to maximize their productivity with advanced Excel skills.",
    },
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find(s => s.slug === slug);
}
