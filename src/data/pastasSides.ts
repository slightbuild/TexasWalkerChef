import type { PanPriceRow } from './catering';

export const pastasSidesContent = {
  pageTitle: 'Pastas & Southern Sides',
  pageLead: 'Bringing Families Together One Plate at a Time.',
  pageSupport: 'Southern Flavor • Texas Smoke',
  pastas: {
    title: 'Pastas',
    rows: [
      {
        item: 'Spaghetti with Ground Turkey',
        half: '$70',
        full: '$130',
      },
      { item: 'Chicken Pasta', half: '$80', full: '$150' },
      {
        item: 'Smoked Chicken & Beef Sausage Pasta',
        half: '$85',
        full: '$160',
      },
      { item: 'Jerk Chicken Pasta', half: '$85', full: '$160' },
    ] as PanPriceRow[],
  },
  sides: {
    title: 'Southern Sides',
    rows: [
      { item: 'Homemade Potato Salad', half: '$50', full: '$90' },
      { item: 'Broccoli Cheese Casserole', half: '$55', full: '$100' },
      { item: 'BBQ Beans with Ground Turkey', half: '$55', full: '$100' },
      { item: 'Fried Cabbage with Turkey Bacon', half: '$55', full: '$100' },
      { item: 'Greens with Smoked Turkey', half: '$60', full: '$110' },
      { item: 'Poultry Dirty Rice', half: '$60', full: '$110' },
      { item: 'Mac & Cheese', half: '$60', full: '$110' },
    ] as PanPriceRow[],
  },
} as const;
