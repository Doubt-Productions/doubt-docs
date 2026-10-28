export interface NavItem {
  title: string;
  href: string;
  description: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const siteName = 'Doubt Docs';

/** The sidebar, search and footer all read this. Every page under app/(docs) belongs here. */
export const navigation: NavGroup[] = [
  {
    title: 'Get started',
    items: [
      { title: 'Introduction', href: '/', description: 'What Doubt does and where to start' },
      {
        title: 'Add Doubt to your server',
        href: '/getting-started',
        description: 'Invite Doubt, check its role and run /setup',
      },
      {
        title: 'Dashboard',
        href: '/dashboard',
        description: 'Sign in, who sees what, and every dashboard page',
      },
    ],
  },
  {
    title: 'Features',
    items: [
      {
        title: 'Moderation and cases',
        href: '/features/moderation',
        description: 'Warn, timeout, kick and ban, with numbered cases and a mod log',
      },
      {
        title: 'AutoMod',
        href: '/features/automod',
        description: "Discord's own AutoMod rules, managed and logged by Doubt",
      },
      {
        title: 'Tickets',
        href: '/features/tickets',
        description: 'A ticket panel, private ticket channels and transcripts',
      },
      {
        title: 'Welcome and join roles',
        href: '/features/welcome',
        description: 'Welcome messages, placeholders and roles for new members',
      },
      {
        title: 'Levelling',
        href: '/features/levelling',
        description: 'XP, rank cards, level-up messages and reward roles',
      },
      {
        title: 'Economy',
        href: '/features/economy',
        description: 'Wallet, bank, begging and top.gg vote rewards',
      },
      {
        title: 'Utility',
        href: '/features/utility',
        description: 'AFK, server and user info, and the embed creator',
      },
      {
        title: 'Reports',
        href: '/features/reports',
        description: "Report a member, a message or a server to Doubt's staff",
      },
      {
        title: 'Premium',
        href: '/features/premium',
        description: 'What server and User Premium add, and how to get them',
      },
    ],
  },
  {
    title: 'Reference',
    items: [
      {
        title: 'Commands',
        href: '/reference/commands',
        description: 'Every command and context menu, with who can use it',
      },
      {
        title: 'Permissions',
        href: '/reference/permissions',
        description: 'What Doubt needs in your server, and why',
      },
      {
        title: 'Security and data',
        href: '/security',
        description: 'What Doubt stores, how long, and how access works',
      },
      { title: 'FAQ', href: '/faq', description: 'Common problems and how to fix them' },
    ],
  },
];
