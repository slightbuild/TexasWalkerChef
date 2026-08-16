import type { PriceRow, SliderRow } from './catering';

export const slidersWingsContent = {
  pageTitle: 'Sliders & Wings',
  pageLead: 'Bringing Families Together One Plate at a Time.',
  pageSupport: 'Southern Flavor • Texas Smoke',
  sliders: {
    title: 'Mini Buttery Croissant Sliders',
    description:
      'Meaty portions of smoked meats served on buttery mini croissants with Walker Sauce, pickles and onions.',
    rows: [
      { flavor: 'Smoked Chicken', count12: '$60', count25: '$115' },
      { flavor: 'Smoked Pulled Pork', count12: '$65', count25: '$125' },
      { flavor: 'Beef Sausage', count12: '$60', count25: '$115' },
      { flavor: 'Smoked Beef Brisket', count12: '$80', count25: '$155' },
    ] as SliderRow[],
  },
  wings: {
    title: 'Smoked Party Wings',
    description:
      'Party wings seasoned with the Walker Texas Chef signature blend and smoked over red oak and pecan.',
    rows: [
      { item: '25 Wings', price: '$45' },
      { item: '50 Wings', price: '$85' },
      { item: '75 Wings', price: '$125' },
      { item: '100 Wings', price: '$160' },
    ] as PriceRow[],
    note: 'Sauced Wings: Add $5 for every 25 wings.',
  },
} as const;
