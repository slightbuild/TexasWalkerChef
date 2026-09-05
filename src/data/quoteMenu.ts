import { smokedMeatsContent } from './smokedMeats';
import { slidersWingsContent } from './slidersWings';
import { pastasSidesContent } from './pastasSides';
import { cateringContent } from './catering';

export type MenuUnit = 'each' | 'lb' | 'slab' | 'person';

export type QuoteMenuItem = {
  id: string;
  category: string;
  name: string;
  priceLabel: string;
  unit: MenuUnit;
  unitPrice?: number;
  personPriceSmall?: number;
  personPriceLarge?: number;
  packageCounts?: {
    meats: number;
    sides: number;
  };
};

export type QuoteMenuGroup = {
  category: string;
  items: QuoteMenuItem[];
};

function parseDollarAmount(price: string): number {
  const match = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function unitFromPrice(price: string): MenuUnit {
  if (price.includes('/lb')) return 'lb';
  if (price.includes('/slab')) return 'slab';
  if (price.toLowerCase().includes('per person')) return 'person';
  return 'each';
}

function fromPriceRow(
  category: string,
  id: string,
  name: string,
  price: string
): QuoteMenuItem {
  return {
    id,
    category,
    name,
    priceLabel: price,
    unit: unitFromPrice(price),
    unitPrice: parseDollarAmount(price),
  };
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function packageCountsFromName(name: string): { meats: number; sides: number } | undefined {
  const meats = name.match(/(\d+)\s+Meat/i);
  const sides = name.match(/(\d+)\s+Side/i);
  if (!meats || !sides) return undefined;
  return { meats: Number(meats[1]), sides: Number(sides[1]) };
}

export const BRISKET_OPTION = 'Smoked Beef Brisket';
export const BRISKET_UPGRADE = 5;

export const cateringMeatOptions = [
  ...cateringContent.meats.list.split('•').map((item) => item.trim()),
  BRISKET_OPTION,
];

export const cateringSideOptions = pastasSidesContent.sides.rows.map(
  (row) => row.item
);

function buildQuoteMenu(): QuoteMenuItem[] {
  const items: QuoteMenuItem[] = [];

  for (const row of smokedMeatsContent.meats.rows) {
    items.push(
      fromPriceRow('Smoked Meats', `meat:${slug(row.item)}`, row.item, row.price)
    );
  }

  for (const row of smokedMeatsContent.sandwiches.rows) {
    items.push(
      fromPriceRow(
        'Sandwiches',
        `sandwich:${slug(row.item)}`,
        row.item,
        row.price
      )
    );
  }

  for (const row of slidersWingsContent.sliders.rows) {
    items.push(
      fromPriceRow(
        'Mini Croissant Sliders',
        `slider:${slug(row.flavor)}:12`,
        `${row.flavor} — 12 sliders`,
        row.count12
      )
    );
    items.push(
      fromPriceRow(
        'Mini Croissant Sliders',
        `slider:${slug(row.flavor)}:25`,
        `${row.flavor} — 25 sliders`,
        row.count25
      )
    );
  }

  for (const row of slidersWingsContent.wings.rows) {
    items.push(
      fromPriceRow(
        'Smoked Party Wings',
        `wings:${slug(row.item)}`,
        row.item,
        row.price
      )
    );
  }
  items.push(
    fromPriceRow(
      'Smoked Party Wings',
      'wings:sauced-upgrade',
      'Sauced Wings Upgrade (per 25 wings)',
      '$5'
    )
  );

  for (const row of pastasSidesContent.pastas.rows) {
    items.push(
      fromPriceRow(
        'Pastas',
        `pasta:${slug(row.item)}:half`,
        `${row.item} — Half Pan`,
        row.half
      )
    );
    items.push(
      fromPriceRow(
        'Pastas',
        `pasta:${slug(row.item)}:full`,
        `${row.item} — Full Pan`,
        row.full
      )
    );
  }

  for (const row of pastasSidesContent.sides.rows) {
    items.push(
      fromPriceRow(
        'Southern Sides',
        `side:${slug(row.item)}:half`,
        `${row.item} — Half Pan`,
        row.half
      )
    );
    items.push(
      fromPriceRow(
        'Southern Sides',
        `side:${slug(row.item)}:full`,
        `${row.item} — Full Pan`,
        row.full
      )
    );
  }

  for (const row of cateringContent.smallGroup.rows) {
    const large = cateringContent.largeGroup.rows.find(
      (entry) => entry.item === row.item
    );
    items.push({
      id: `catering:${slug(row.item)}`,
      category: 'Catering Packages',
      name: row.item,
      priceLabel: large
        ? `${row.price} (10–24 guests) · ${large.price} (25+ guests)`
        : row.price,
      unit: 'person',
      personPriceSmall: parseDollarAmount(row.price),
      personPriceLarge: parseDollarAmount(large?.price ?? row.price),
      packageCounts: packageCountsFromName(row.item),
    });
  }

  return items;
}

export const quoteMenuItems = buildQuoteMenu();

export const quoteMenuGroups: QuoteMenuGroup[] = quoteMenuItems.reduce<
  QuoteMenuGroup[]
>((groups, item) => {
  const existing = groups.find((group) => group.category === item.category);
  if (existing) {
    existing.items.push(item);
    return groups;
  }
  groups.push({ category: item.category, items: [item] });
  return groups;
}, []);

export const PACKAGE_SMALL_MIN = 10;
export const PACKAGE_LARGE_MIN = 25;

export function getPackageTier(
  guestCount: number
): 'small' | 'large' | null {
  if (guestCount >= PACKAGE_LARGE_MIN) return 'large';
  if (guestCount >= PACKAGE_SMALL_MIN) return 'small';
  return null;
}

export function getUnitPrice(
  item: QuoteMenuItem,
  guestCount: number,
  meats: string[] = []
): number {
  let price = item.unitPrice ?? 0;
  if (item.personPriceSmall != null && item.personPriceLarge != null) {
    const tier = getPackageTier(guestCount);
    if (tier === 'large') price = item.personPriceLarge;
    else if (tier === 'small') price = item.personPriceSmall;
    else price = 0;
  }
  if (item.packageCounts && meats.includes(BRISKET_OPTION) && price > 0) {
    price += BRISKET_UPGRADE;
  }
  return price;
}

export function packageRateLabel(
  item: QuoteMenuItem,
  guestCount: number
): string {
  if (item.personPriceSmall == null || item.personPriceLarge == null) {
    return item.priceLabel;
  }
  const tier = getPackageTier(guestCount);
  if (tier === 'large') {
    return `${formatUSD(item.personPriceLarge)} per person (25+ guests)`;
  }
  if (tier === 'small') {
    return `${formatUSD(item.personPriceSmall)} per person (10–24 guests)`;
  }
  return item.priceLabel;
}

export function packageChoicesComplete(
  item: QuoteMenuItem,
  meats: string[] = [],
  sides: string[] = []
): boolean {
  if (!item.packageCounts) return true;
  const meatFilled = meats.filter(Boolean).length >= item.packageCounts.meats;
  const sideFilled = sides.filter(Boolean).length >= item.packageCounts.sides;
  return meatFilled && sideFilled;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function unitLabel(unit: MenuUnit, quantity = 1): string {
  if (unit === 'lb') return quantity === 1 ? 'lb' : 'lbs';
  if (unit === 'slab') return quantity === 1 ? 'slab' : 'slabs';
  if (unit === 'person') return quantity === 1 ? 'guest' : 'guests';
  return '';
}
