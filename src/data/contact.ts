export const contact = {
  brand: 'Walker Texas Chef',
  tagline: 'Bringing Families Together One Plate at a Time.',
  supportLine: 'Southern Flavor • Texas Smoke',
  phone: '713-377-6483',
  phoneTel: 'tel:7133776483',
  email: 'walkertexaschefllc@gmail.com',
  emailMailto: 'mailto:walkertexaschefllc@gmail.com',
  facebook: {
    label: 'Walker Texas Chef',
    url: 'https://www.facebook.com/search/top?q=Walker%20Texas%20Chef',
  },
  instagram: {
    label: '@walkertexaschef',
    url: 'https://www.instagram.com/walkertexaschef',
  },
  tiktok: {
    label: '@Walker.Texas.Chef',
    url: 'https://www.tiktok.com/@Walker.Texas.Chef',
  },
  /** Replace with preferred Google / Facebook review URL when ready. */
  reviewUrl: '',
} as const;

export const cateringMenuLinks = [
  { href: '/menu/smoked-meats', label: 'Meats' },
  { href: '/menu/sliders-wings', label: 'Sliders & Wings' },
  { href: '/menu/pastas-sides', label: 'Pasta & Sides' },
] as const;

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catering', label: 'Catering', children: cateringMenuLinks },
  { href: '/service', label: 'Service' },
  { href: '/about', label: 'About' },
] as const;
