// data/expenses.js

// --- YEAR 1 DATA ---
export const year1Data = {
  meta: {
    year: "Year 1",
    phase: "R&D & Pilot Phase",
    duration: "12 Months",
  },
  economics: {
    pricePerUser: "$0 (Pilot)",
    saasUsers: "50 - 100",
    clients: "0",
    totalRevenue: "₹0",
    totalExpense: "₹11.75 Lakh",
    netBurn: " - ₹11.75 Lakh",
  },
  periods: [
    {
      title: "Phase 1: R&D",
      timeline: "Apr'26 - Sep'26",
      totalCost: "₹4 Lakh",
      categories: [
        {
          name: "Human Resources",
          total: "₹3 Lakh",
          items: [
            { label: "UI/UX Intern", cost: "₹1 Lakh" },
            { label: "AI Engineer", cost: "₹1.5 Lakh" },
            { label: "Freelance Work", cost: "₹50k" },
          ],
        },
        {
          name: "Subscriptions",
          total: "₹70k",
          items: [
            { label: "MS 365", cost: "₹11.5k" },
            { label: "Notion", cost: "₹11k" },
            { label: "Claude", cost: "₹9.2k" },
            { label: "Miro", cost: "₹8.7k" },
            { label: "Jira", cost: "₹8k" },
            { label: "ClickUp", cost: "₹6.5k" },
            { label: "Asana", cost: "₹6k" },
            { label: "Google Workspace", cost: "₹5.2k" },
            { label: "Slack", cost: "₹4k" },
          ],
        },
        {
          name: "Hardware",
          total: "₹30k",
          items: [
            { label: "SSD Storage", cost: "₹25k" },
            { label: "SD Cards", cost: "₹5k" },
          ],
        },
      ],
    },
    {
      title: "Phase 2: Pilot & Infra",
      timeline: "Oct'26 - Mar'27",
      totalCost: "₹7.75 Lakh",
      categories: [
        {
          name: "Cloud Infrastructure",
          total: "₹6 Lakh",
          items: [
            { label: "GPU & Hosting", cost: "₹6 Lakh" },
          ],
        },
        {
          name: "Human Resources",
          total: "₹1 Lakh",
          items: [
            { label: "Sales & Support Team", cost: "₹1 Lakh" },
          ],
        },
        {
          name: "Subscriptions",
          total: "₹75k",
          items: [
            { label: "Backend Hosting", cost: "₹65.8k" },
            { label: "Claude AI", cost: "₹9.2k" },
          ],
        },
      ],
    },
  ],
};

// --- YEAR 2 DATA ---
export const year2Data = {
  meta: {
    year: "Year 2",
    phase: "Growth & Expansion",
    duration: "12 Months",
  },
  economics: {
    pricePerUser: "$18",
    saasUsers: "300",
    clients: "1 (On-Prem)",
    totalRevenue: "₹1.85 Cr",
    totalExpense: "₹1.54 Cr",
    netBurn: "₹31 Lakh ",
  },
  periods: [
    {
      title: "Annual Operations",
      timeline: "Apr'27 - Mar'28",
      totalCost: "₹1.54 Cr",
      categories: [
        {
          name: "Human Resources",
          total: "₹86 Lakh",
          items: [
            { label: "Sales & Support Team", cost: "₹30 Lakh" },
            { label: "AI Engineer", cost: "₹18 Lakh" },
            { label: "System Architect", cost: "₹12 Lakh" },
            { label: "UI/UX Designer", cost: "₹12 Lakh" },
            { label: "Product Head", cost: "₹12 Lakh" },
            { label: "Freelance Work", cost: "₹2 Lakh" },
          ],
        },
        {
          name: "Marketing & GTM",
          total: "₹27 Lakh",
          items: [
            { label: "SI & ISV Marketplaces", cost: "₹21 Lakh" },
            { label: "Performance Marketing", cost: "₹6 Lakh" },
          ],
        },
        {
          name: "Cloud Infrastructure",
          total: "₹20 Lakh",
          items: [
            { label: "GPU & Hosting", cost: "₹20 Lakh" },
          ],
        },
        {
          name: "Rent & Travel",
          total: "₹18 Lakh",
          items: [
            { label: "Office Rent", cost: "₹15 Lakh" },
            { label: "Travel Allowance", cost: "₹3 Lakh" },
          ],
        },
        {
          name: "Subscriptions",
          total: "₹3.18 Lakh",
          items: [
            { label: "Backend Hosting", cost: "₹1.5 Lakh" },
            { label: "MS 365", cost: "₹23k" },
            { label: "GitHub", cost: "₹23k" },
            { label: "Notion", cost: "₹22k" },
            { label: "Claude", cost: "₹18.4k" },
            { label: "Miro", cost: "₹17.5k" },
            { label: "Jira", cost: "₹16k" },
            { label: "ClickUp", cost: "₹13k" },
            { label: "Asana", cost: "₹12k" },
            { label: "Google Workspace", cost: "₹10.4k" },
            { label: "Slack", cost: "₹8k" },
            { label: "Zoho Workplace", cost: "₹4.8k" },
          ],
        },
      ],
    },
  ],
};

// --- YEAR 3 DATA ---
export const year3Data = {
  meta: {
    year: "Year 3",
    phase: "Scale & Enterprise",
    duration: "12 Months",
  },
  economics: {
    pricePerUser: "$20",
    saasUsers: "1500",
    clients: "5 (On-Prem)",
    totalRevenue: "₹9.5 Cr",
    totalExpense: "₹6.3 Cr",
    netBurn: "₹3.2 Cr ",
  },
  periods: [
    {
      title: "Annual Operations",
      timeline: "Apr'28 - Mar'29",
      totalCost: "₹6.3 Cr",
      categories: [
        {
          name: "Human Resources",
          total: "₹3.74 Cr",
          items: [
            { label: "Sales & Support Team", cost: "₹2.4 Cr" },
            { label: "AI Engineer (x2)", cost: "₹50 Lakh" },
            { label: "Freelance Work", cost: "₹30 Lakh" },
            { label: "System Architect", cost: "₹18 Lakh" },
            { label: "UI/UX Designer", cost: "₹18 Lakh" },
            { label: "Product Head", cost: "₹18 Lakh" },
          ],
        },
        {
          name: "Marketing & GTM",
          total: "₹1.26 Cr",
          items: [
            { label: "SI & ISV Marketplaces", cost: "₹90 Lakh" },
            { label: "Performance Marketing", cost: "₹18 Lakh" },
            { label: "Channel Expansion", cost: "₹18 Lakh" },
          ],
        },
        {
          name: "Cloud Infrastructure",
          total: "₹96 Lakh",
          items: [
            { label: "GPU & Hosting", cost: "₹96 Lakh" },
          ],
        },
        {
          name: "Rent & Travel",
          total: "₹30 Lakh",
          items: [
            { label: "Office Rent", cost: "₹24 Lakh" },
            { label: "Travel Allowance", cost: "₹6 Lakh" },
          ],
        },
        {
          name: "Subscriptions",
          total: "₹4.18 Lakh",
          items: [
            { label: "Backend Hosting", cost: "₹2.5 Lakh" },
            { label: "MS 365", cost: "₹23k" },
            { label: "GitHub", cost: "₹23k" },
            { label: "Notion", cost: "₹22k" },
            { label: "Claude", cost: "₹18.4k" },
            { label: "Miro", cost: "₹17.5k" },
            { label: "Jira", cost: "₹16k" },
            { label: "ClickUp", cost: "₹13k" },
            { label: "Asana", cost: "₹12k" },
            { label: "Google Workspace", cost: "₹10.4k" },
            { label: "Slack", cost: "₹8k" },
            { label: "Zoho Workplace", cost: "₹4.8k" },
          ],
        },
      ],
    },
  ],
};