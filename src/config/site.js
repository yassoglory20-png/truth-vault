export const SITE_CONFIG = {
  name: import.meta.env.VITE_SITE_NAME || 'Truth Vault',
  url: import.meta.env.VITE_SITE_URL || 'https://yourusername.github.io/truth-vault',
  description: 'Independent investigative journalism platform uncovering facts and amplifying voices that matter.',
  author: 'Truth Vault Editorial Team',
  logo: '/logo.svg',
  defaultImage: '/og-image.jpg',
  social: {
    twitter: '@truthvault',
    facebook: 'truthvault',
    github: 'truthvault',
  },
  categories: [
    { id: 'politics', name: 'Politics', description: 'Government, policy, and political investigations' },
    { id: 'corporate', name: 'Corporate', description: 'Corporate corruption, fraud, and accountability' },
    { id: 'environment', name: 'Environment', description: 'Climate crisis, pollution, and environmental justice' },
    { id: 'technology', name: 'Technology', description: 'Big tech, data privacy, and digital rights' },
    { id: 'health', name: 'Health', description: 'Healthcare, pharmaceuticals, and public health' },
    { id: 'justice', name: 'Justice', description: 'Legal system, human rights, and social justice' },
    { id: 'education', name: 'Education', description: 'Education policy, access, and reform' },
    { id: 'investigations', name: 'Investigations', description: 'Deep-dive investigative reports' },
  ],
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
};
