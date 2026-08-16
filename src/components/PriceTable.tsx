import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { PanPriceRow, PriceRow, SliderRow } from '../data/catering';
import { colors, radii, spacing } from '../theme/colors';
import { fonts, typography } from '../theme';

type PriceTableProps = {
  rows: PriceRow[];
  note?: string;
};

export function PriceTable({ rows, note }: PriceTableProps) {
  const { width } = useWindowDimensions();
  const compact = width < 700;

  return (
    <View style={styles.table}>
      <View style={[styles.headerRow, compact && styles.headerCompact]}>
        <Text style={[styles.headerCell, styles.flexGrow]}>Item</Text>
        <Text style={[styles.headerCell, styles.priceCol]}>Price</Text>
      </View>
      {rows.map((row) => (
        <View key={row.item} style={[styles.row, compact && styles.rowCompact]}>
          <Text style={[styles.item, styles.flexGrow]}>{row.item}</Text>
          <Text style={[typography.price, styles.priceCol]}>{row.price}</Text>
        </View>
      ))}
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

type PanTableProps = {
  rows: PanPriceRow[];
};

export function PanPriceTable({ rows }: PanTableProps) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.flexGrow]}>Item</Text>
        <Text style={[styles.headerCell, styles.panCol]}>Half Pan</Text>
        <Text style={[styles.headerCell, styles.panCol]}>Full Pan</Text>
      </View>
      {rows.map((row) => (
        <View key={row.item} style={styles.row}>
          <Text style={[styles.item, styles.flexGrow]}>{row.item}</Text>
          <Text style={[typography.price, styles.panCol]}>{row.half}</Text>
          <Text style={[typography.price, styles.panCol]}>{row.full}</Text>
        </View>
      ))}
    </View>
  );
}

type SliderTableProps = {
  rows: SliderRow[];
};

export function SliderPriceTable({ rows }: SliderTableProps) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.flexGrow]}>Flavor</Text>
        <Text style={[styles.headerCell, styles.panCol]}>12 Count</Text>
        <Text style={[styles.headerCell, styles.panCol]}>25 Count</Text>
      </View>
      {rows.map((row) => (
        <View key={row.flavor} style={styles.row}>
          <Text style={[styles.item, styles.flexGrow]}>{row.flavor}</Text>
          <Text style={[typography.price, styles.panCol]}>{row.count12}</Text>
          <Text style={[typography.price, styles.panCol]}>{row.count25}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderTopWidth: 2,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderColor: colors.orange,
    gap: spacing.md,
  },
  headerCompact: {
    paddingBottom: spacing.md,
  },
  headerCell: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.orange,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  rowCompact: {
    alignItems: 'flex-start',
  },
  item: {
    fontFamily: fonts.bodyMedium,
    fontSize: 20,
    color: colors.text,
    lineHeight: 30,
  },
  flexGrow: {
    flex: 1,
  },
  priceCol: {
    minWidth: 150,
    textAlign: 'right',
  },
  panCol: {
    minWidth: 110,
    textAlign: 'right',
  },
  note: {
    marginTop: spacing.lg,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.cream,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
    lineHeight: 26,
  },
});
