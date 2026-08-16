export type PriceRow = {
  item: string;
  price: string;
  note?: string;
};

export type PanPriceRow = {
  item: string;
  half: string;
  full: string;
};

export type SliderRow = {
  flavor: string;
  count12: string;
  count25: string;
};

export const cateringContent = {
  pageTitle: 'Catering',
  pageLead: 'Bringing Families Together One Plate at a Time.',
  pageSupport: 'Southern Flavor • Texas Smoke',
  smallGroup: {
    title: 'Small-Group Catering',
    subtitle: '10–24 Guests',
    description:
      'Perfect for smaller celebrations, house parties, game nights, birthdays and family gatherings.',
    rows: [
      { item: '1 Meat + 1 Side', price: '$20 per person' },
      { item: '2 Meats + 2 Sides', price: '$25 per person' },
      { item: '3 Meats + 3 Sides', price: '$30 per person' },
      { item: '4 Meats + 4 Sides', price: '$35 per person' },
    ] as PriceRow[],
    note: 'Smoked Beef Brisket — +$5 per person',
  },
  largeGroup: {
    title: 'Catering for 25+ Guests',
    subtitle: 'Volume pricing for groups of 25 or more.',
    rows: [
      { item: '1 Meat + 1 Side', price: '$18 per person' },
      { item: '2 Meats + 2 Sides', price: '$23 per person' },
      { item: '3 Meats + 3 Sides', price: '$28 per person' },
      { item: '4 Meats + 4 Sides', price: '$33 per person' },
    ] as PriceRow[],
    note: 'Smoked Beef Brisket — +$5 per person',
  },
  meats: {
    title: 'Meat Selections',
    list: 'Leg Quarters • Pulled Pork • Beef Sausage • Spare Ribs',
    premium: 'Premium Selection: Smoked Beef Brisket',
  },
} as const;
