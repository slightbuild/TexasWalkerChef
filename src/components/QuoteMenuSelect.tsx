import { createElement, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, spacing } from '../theme/colors';
import { fonts, typography } from '../theme';
import {
  BRISKET_OPTION,
  BRISKET_UPGRADE,
  PACKAGE_SMALL_MIN,
  cateringMeatOptions,
  cateringSideOptions,
  formatUSD,
  getPackageTier,
  getUnitPrice,
  packageRateLabel,
  quoteMenuGroups,
  quoteMenuItems,
  unitLabel,
  type QuoteMenuItem,
} from '../data/quoteMenu';

export type QuoteSelection = {
  id: string;
  quantity: number;
  meats?: string[];
  sides?: string[];
};

export type QuoteLine = {
  id: string;
  name: string;
  quantity: number;
  unit: QuoteMenuItem['unit'];
  unitPrice: number;
  lineTotal: number;
  priceLabel: string;
  meats: string[];
  sides: string[];
  includesBrisket: boolean;
  packageCounts?: QuoteMenuItem['packageCounts'];
  packageTier: 'small' | 'large' | null;
};

type QuoteMenuSelectProps = {
  selections: QuoteSelection[];
  guestCount: string;
  onChange: (selections: QuoteSelection[]) => void;
};

function parseGuestCount(value: string): number {
  const count = Number.parseInt(value.replace(/\D/g, ''), 10);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

type PackageSlotSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function PackageSlotSelect({
  label,
  value,
  options,
  onChange,
}: PackageSlotSelectProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.slot}>
        <Text style={styles.slotLabel}>{label}</Text>
        {createElement(
          'select',
          {
            value,
            onChange: (event: { target: { value: string } }) =>
              onChange(event.target.value),
            style: webSelectStyle,
            'aria-label': label,
          },
          createElement('option', { value: '' }, `Choose ${label.toLowerCase()}…`),
          ...options.map((option) =>
            createElement(
              'option',
              { value: option, key: option },
              option === BRISKET_OPTION
                ? `${option} (+$${BRISKET_UPGRADE}/person)`
                : option
            )
          )
        )}
      </View>
    );
  }

  return (
    <View style={styles.slot}>
      <Text style={styles.slotLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => {
          const active = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.choiceChip, active && styles.choiceChipActive]}
            >
              <Text
                style={[styles.choiceChipText, active && styles.choiceChipTextActive]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const webSelectStyle = {
  width: '100%',
  backgroundColor: colors.surfaceElevated,
  color: colors.cream,
  border: `2px solid ${colors.border}`,
  borderRadius: 2,
  padding: '12px 14px',
  fontSize: 16,
  fontFamily: fonts.body,
};

export function selectionsToLines(
  selections: QuoteSelection[],
  guestCount: string
): QuoteLine[] {
  const guests = parseGuestCount(guestCount);
  return selections.flatMap((selection) => {
    const item = quoteMenuItems.find((entry) => entry.id === selection.id);
    if (!item) return [];
    const meats = selection.meats ?? [];
    const sides = selection.sides ?? [];
    const quantity = item.unit === 'person' ? guests : selection.quantity;
    const unitPrice = getUnitPrice(item, guests, meats);
    const packageTier = item.packageCounts ? getPackageTier(guests) : null;
    return [
      {
        id: item.id,
        name: item.name,
        quantity,
        unit: item.unit,
        unitPrice,
        lineTotal: unitPrice * quantity,
        priceLabel: item.priceLabel,
        meats,
        sides,
        includesBrisket: meats.includes(BRISKET_OPTION),
        packageCounts: item.packageCounts,
        packageTier,
      },
    ];
  });
}

export function QuoteMenuSelect({
  selections,
  guestCount,
  onChange,
}: QuoteMenuSelectProps) {
  const [open, setOpen] = useState(false);
  const [packageNotice, setPackageNotice] = useState('');
  const guests = parseGuestCount(guestCount);
  const canAddPackage = guests >= PACKAGE_SMALL_MIN;
  const lines = useMemo(
    () => selectionsToLines(selections, guestCount),
    [selections, guestCount]
  );
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const needsGuestCount = lines.some(
    (line) => line.packageCounts && guests < PACKAGE_SMALL_MIN
  );

  const addItem = (id: string) => {
    const item = quoteMenuItems.find((entry) => entry.id === id);
    if (item?.packageCounts && !canAddPackage) {
      setPackageNotice(
        `Enter a guest count of at least ${PACKAGE_SMALL_MIN} before adding a catering package.`
      );
      setOpen(false);
      return;
    }
    setPackageNotice('');
    setOpen(false);
    const existing = selections.find((selection) => selection.id === id);
    if (existing) {
      if (item?.packageCounts) return;
      onChange(
        selections.map((selection) =>
          selection.id === id
            ? { ...selection, quantity: selection.quantity + 1 }
            : selection
        )
      );
      return;
    }
    onChange([
      ...selections,
      {
        id,
        quantity: 1,
        meats: item?.packageCounts
          ? Array.from({ length: item.packageCounts.meats }, () => '')
          : undefined,
        sides: item?.packageCounts
          ? Array.from({ length: item.packageCounts.sides }, () => '')
          : undefined,
      },
    ]);
  };

  const setQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      onChange(selections.filter((selection) => selection.id !== id));
      return;
    }
    onChange(
      selections.map((selection) =>
        selection.id === id ? { ...selection, quantity } : selection
      )
    );
  };

  const setPackageChoice = (
    id: string,
    field: 'meats' | 'sides',
    index: number,
    value: string
  ) => {
    onChange(
      selections.map((selection) => {
        if (selection.id !== id) return selection;
        const next = [...(selection[field] ?? [])];
        next[index] = value;
        return { ...selection, [field]: next };
      })
    );
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Menu Items *</Text>
      <View style={styles.dropdownWrap}>
        <Pressable
          onPress={() => setOpen((value) => !value)}
          style={styles.trigger}
          accessibilityRole="button"
          accessibilityLabel="Add a menu item"
        >
          <Text style={styles.triggerText}>Add a menu item…</Text>
          <Text style={styles.chevron}>{open ? '▴' : '▾'}</Text>
        </Pressable>
        {open ? (
          <View style={styles.panel}>
            <ScrollView
              style={styles.panelScroll}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {quoteMenuGroups.map((group) => (
                <View key={group.category}>
                  <Text style={styles.groupLabel}>{group.category}</Text>
                  {group.category === 'Catering Packages' && !canAddPackage ? (
                    <Text style={styles.packageLock}>
                      Guest count required — enter at least {PACKAGE_SMALL_MIN}{' '}
                      guests to add a package.
                    </Text>
                  ) : null}
                  {group.items.map((item) => {
                    const lockedPackage = Boolean(item.packageCounts) && !canAddPackage;
                    return (
                    <Pressable
                      key={item.id}
                      onPress={() => addItem(item.id)}
                      disabled={lockedPackage}
                      style={[styles.option, lockedPackage && styles.optionDisabled]}
                    >
                      <Text
                        style={[
                          styles.optionName,
                          lockedPackage && styles.optionNameDisabled,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.optionPrice,
                          lockedPackage && styles.optionNameDisabled,
                        ]}
                      >
                        {packageRateLabel(item, guests)}
                      </Text>
                    </Pressable>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
      <Text style={styles.hint}>
        Choose everything you want for the event. Quantities can be adjusted
        after you add an item. Catering packages require a guest count of at
        least {PACKAGE_SMALL_MIN}.
      </Text>
      {packageNotice ? <Text style={styles.errorNotice}>{packageNotice}</Text> : null}

      {lines.length > 0 ? (
        <View style={styles.list}>
          {lines.map((line) => {
            const lockedToGuests = line.unit === 'person';
            return (
              <View key={line.id} style={styles.line}>
                <View style={styles.lineCopy}>
                  <Text style={styles.lineName}>{line.name}</Text>
                  <Text style={styles.lineMeta}>
                    {lockedToGuests
                      ? line.packageTier === 'large'
                        ? `${formatUSD(line.unitPrice)} per person × ${line.quantity} guests (25+ guest rate)`
                        : line.packageTier === 'small'
                          ? `${formatUSD(line.unitPrice)} per person × ${line.quantity} guests (10–24 guest rate)`
                          : `Enter at least ${PACKAGE_SMALL_MIN} guests to price this package`
                      : `${line.priceLabel}${line.unit !== 'each' ? ` × ${line.quantity} ${unitLabel(line.unit, line.quantity)}` : line.quantity > 1 ? ` × ${line.quantity}` : ''}`}
                  </Text>
                </View>
                <View style={styles.lineActions}>
                  {lockedToGuests ? null : (
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => setQuantity(line.id, line.quantity - 1)}
                        style={styles.stepBtn}
                        accessibilityLabel={`Decrease ${line.name}`}
                      >
                        <Text style={styles.stepText}>−</Text>
                      </Pressable>
                      <Text style={styles.qty}>{line.quantity}</Text>
                      <Pressable
                        onPress={() => setQuantity(line.id, line.quantity + 1)}
                        style={styles.stepBtn}
                        accessibilityLabel={`Increase ${line.name}`}
                      >
                        <Text style={styles.stepText}>+</Text>
                      </Pressable>
                    </View>
                  )}
                  <Text style={styles.lineTotal}>
                    {lockedToGuests && !line.packageTier
                      ? '—'
                      : formatUSD(line.lineTotal)}
                  </Text>
                  <Pressable
                    onPress={() => setQuantity(line.id, 0)}
                    accessibilityLabel={`Remove ${line.name}`}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
                {line.packageCounts ? (
                  <View style={styles.packageChoices}>
                    <Text style={styles.packageHeading}>
                      Choose {line.packageCounts.meats} meat
                      {line.packageCounts.meats === 1 ? '' : 's'}
                    </Text>
                    <View style={styles.slotGrid}>
                      {Array.from({ length: line.packageCounts.meats }, (_, index) => (
                        <PackageSlotSelect
                          key={`${line.id}-meat-${index}`}
                          label={`Meat ${index + 1}`}
                          value={line.meats[index] ?? ''}
                          options={cateringMeatOptions}
                          onChange={(value) =>
                            setPackageChoice(line.id, 'meats', index, value)
                          }
                        />
                      ))}
                    </View>
                    <Text style={styles.packageHeading}>
                      Choose {line.packageCounts.sides} side
                      {line.packageCounts.sides === 1 ? '' : 's'}
                    </Text>
                    <View style={styles.slotGrid}>
                      {Array.from({ length: line.packageCounts.sides }, (_, index) => (
                        <PackageSlotSelect
                          key={`${line.id}-side-${index}`}
                          label={`Side ${index + 1}`}
                          value={line.sides[index] ?? ''}
                          options={cateringSideOptions}
                          onChange={(value) =>
                            setPackageChoice(line.id, 'sides', index, value)
                          }
                        />
                      ))}
                    </View>
                    {line.includesBrisket ? (
                      <Text style={styles.upgradeNote}>
                        Smoked Beef Brisket upgrade included — +$
                        {BRISKET_UPGRADE} per person
                      </Text>
                    ) : (
                      <Text style={styles.hint}>
                        Smoked Beef Brisket is a premium meat (+${BRISKET_UPGRADE} per
                        person).
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>
            );
          })}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalValue}>
              {needsGuestCount ? '—' : formatUSD(total)}
            </Text>
          </View>
          {needsGuestCount ? (
            <Text style={styles.hint}>
              Catering packages use the 10–24 guest rate or the 25+ guest rate.
              Enter at least {PACKAGE_SMALL_MIN} guests to see the total.
            </Text>
          ) : (
            <Text style={styles.hint}>
              Estimate based on listed menu prices. Delivery and full-service
              fees are quoted separately.
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: colors.orange,
    textTransform: 'uppercase',
  },
  dropdownWrap: {
    position: 'relative',
    zIndex: 8,
  },
  trigger: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  triggerText: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.textDim,
  },
  chevron: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.orange,
  },
  panel: {
    marginTop: 4,
    borderWidth: 2,
    borderColor: colors.orange,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
    maxHeight: 340,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? ({ boxShadow: '0 16px 32px rgba(0,0,0,0.45)' } as object) : null),
  },
  panelScroll: {
    maxHeight: 336,
  },
  groupLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.orange,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  optionName: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.cream,
    flex: 1,
  },
  optionPrice: {
    fontFamily: fonts.condensedMedium,
    fontSize: 16,
    color: colors.orange,
  },
  optionDisabled: {
    opacity: 0.45,
  },
  optionNameDisabled: {
    color: colors.textDim,
  },
  packageLock: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.cream,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    lineHeight: 20,
  },
  errorNotice: {
    fontFamily: fonts.bodyMedium,
    color: '#FF6B6B',
    fontSize: 16,
  },
  hint: {
    ...typography.caption,
  },
  list: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  line: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
    padding: spacing.md,
    gap: spacing.sm,
  },
  lineCopy: {
    gap: 4,
  },
  lineName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.cream,
  },
  lineMeta: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  lineActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: colors.cream,
    fontSize: 18,
    lineHeight: 20,
  },
  qty: {
    fontFamily: fonts.bodyMedium,
    color: colors.cream,
    minWidth: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  lineTotal: {
    fontFamily: fonts.condensedMedium,
    fontSize: 20,
    color: colors.orange,
    marginLeft: 'auto',
  },
  remove: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 22,
    letterSpacing: 1.5,
    color: colors.cream,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontFamily: fonts.condensedMedium,
    fontSize: 32,
    color: colors.orange,
  },
  packageChoices: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  packageHeading: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.orange,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    flex: 1,
    minWidth: 180,
    gap: 6,
  },
  slotLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
  },
  upgradeNote: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.orange,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choiceChip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  choiceChipActive: {
    borderColor: colors.orange,
    backgroundColor: 'rgba(255,92,0,0.14)',
  },
  choiceChipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  choiceChipTextActive: {
    color: colors.orange,
  },
});
