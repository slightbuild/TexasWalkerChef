import type { PriceRow } from './catering';

export const smokedMeatsContent = {
  pageTitle: 'Smoked Meats & Sandwiches',
  pageLead: 'Bringing Families Together One Plate at a Time.',
  pageSupport: 'Southern Flavor • Texas Smoke',
  meats: {
    title: 'Smoked Meats',
    rows: [
      { item: 'Leg Quarters — 10 Pieces', price: '$65' },
      { item: 'Leg Quarters — 20 Pieces', price: '$125' },
      { item: 'Pulled Pork', price: '$18/lb' },
      { item: 'Beef Sausage — 5 lbs', price: '$90' },
      { item: 'Beef Sausage — 10 lbs', price: '$175' },
      { item: 'Spare Ribs', price: '$35/slab' },
      { item: 'Smoked Beef Brisket', price: '$32/lb' },
    ] as PriceRow[],
  },
  sandwiches: {
    title: 'Full-Size Sandwiches',
    description:
      'Served on a soft potato bread bun with Walker Sauce, pickles and onions. Meat sandwiches are loaded with a generous ⅓ lb portion.',
    rows: [
      { item: 'Smoked Chicken Sandwich', price: '$10' },
      { item: 'Pulled Pork Sandwich', price: '$11' },
      { item: 'Beef Sausage Sandwich', price: '$12' },
      { item: '3-Rib Sandwich', price: '$14' },
      { item: 'Smoked Beef Brisket Sandwich', price: '$16' },
    ] as PriceRow[],
  },
} as const;
