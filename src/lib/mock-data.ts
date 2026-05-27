import type { Subscription } from "@/types";

const isoFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const isoAgo = (days: number) => isoFromNow(-days);

export const seedSubscriptions: Subscription[] = [
  {
    id: "sub_netflix",
    name: "Netflix",
    description: "Premium 4K plan",
    category: "Entertainment",
    price: 22.99,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(2),
    startedAt: isoAgo(420),
    status: "active",
    color: "#E50914",
    logo: "netflix"
  },
  {
    id: "sub_spotify",
    name: "Spotify",
    description: "Family plan",
    category: "Music",
    price: 16.99,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(5),
    startedAt: isoAgo(800),
    status: "active",
    color: "#1DB954",
    logo: "spotify"
  },
  {
    id: "sub_chatgpt",
    name: "ChatGPT Plus",
    description: "OpenAI Plus subscription",
    category: "AI",
    price: 20,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(11),
    startedAt: isoAgo(200),
    status: "active",
    color: "#10A37F",
    logo: "openai"
  },
  {
    id: "sub_claude",
    name: "Claude Pro",
    description: "Anthropic Pro plan",
    category: "AI",
    price: 20,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(18),
    startedAt: isoAgo(120),
    status: "active",
    color: "#D97757",
    logo: "anthropic"
  },
  {
    id: "sub_github",
    name: "GitHub Pro",
    description: "Developer tools",
    category: "Developer",
    price: 4,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(8),
    startedAt: isoAgo(900),
    status: "active",
    color: "#ffffff",
    logo: "github"
  },
  {
    id: "sub_vercel",
    name: "Vercel Pro",
    description: "Hosting and deployments",
    category: "Developer",
    price: 20,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(15),
    startedAt: isoAgo(380),
    status: "active",
    color: "#ffffff",
    logo: "vercel"
  },
  {
    id: "sub_notion",
    name: "Notion",
    description: "Plus plan",
    category: "Productivity",
    price: 10,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(22),
    startedAt: isoAgo(640),
    status: "active",
    color: "#ffffff",
    logo: "notion"
  },
  {
    id: "sub_linear",
    name: "Linear",
    description: "Standard plan",
    category: "Productivity",
    price: 8,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(27),
    startedAt: isoAgo(310),
    status: "active",
    color: "#5E6AD2",
    logo: "linear"
  },
  {
    id: "sub_icloud",
    name: "iCloud+",
    description: "2 TB storage",
    category: "Cloud",
    price: 9.99,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(-3),
    startedAt: isoAgo(700),
    status: "active",
    color: "#A5C2DE",
    logo: "icloud"
  },
  {
    id: "sub_disney",
    name: "Disney+",
    description: "Standard with ads",
    category: "Entertainment",
    price: 7.99,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(1),
    startedAt: isoAgo(180),
    status: "active",
    color: "#0E47A1",
    logo: "disneyplus"
  },
  {
    id: "sub_nyt",
    name: "NYTimes",
    description: "All Access",
    category: "News",
    price: 17,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(14),
    startedAt: isoAgo(540),
    status: "active",
    color: "#ffffff",
    logo: "thenewyorktimes"
  },
  {
    id: "sub_figma",
    name: "Figma",
    description: "Professional",
    category: "Productivity",
    price: 15,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(20),
    startedAt: isoAgo(450),
    status: "active",
    color: "#F24E1E",
    logo: "figma"
  },
  {
    id: "sub_amazon",
    name: "Amazon Prime",
    description: "Annual plan",
    category: "Entertainment",
    price: 139,
    currency: "USD",
    billingCycle: "yearly",
    nextRenewal: isoFromNow(60),
    startedAt: isoAgo(330),
    status: "active",
    color: "#FF9900",
    logo: "amazon"
  },
  {
    id: "sub_dropbox",
    name: "Dropbox",
    description: "Plus 2TB",
    category: "Cloud",
    price: 11.99,
    currency: "USD",
    billingCycle: "monthly",
    nextRenewal: isoFromNow(9),
    startedAt: isoAgo(220),
    status: "paused",
    color: "#0061FF",
    logo: "dropbox"
  }
];
