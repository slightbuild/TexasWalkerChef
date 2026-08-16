import { StyleSheet, Text, View } from 'react-native';
import { SiteShell } from '../src/components/SiteShell';
import { PageHeader } from '../src/components/PageHeader';
import { Section } from '../src/components/Section';
import { PriceTable } from '../src/components/PriceTable';
import { CTAButton } from '../src/components/CTAButton';
import { cateringContent } from '../src/data/catering';
import { colors, spacing } from '../src/theme/colors';
import { fonts, typography } from '../src/theme';

export default function CateringScreen() {
  const { smallGroup, largeGroup, meats } = cateringContent;

  return (
    <SiteShell>
      <PageHeader
        title={cateringContent.pageTitle}
        lead={cateringContent.pageLead}
        support={cateringContent.pageSupport}
      />
      <Section title={smallGroup.title} subtitle={smallGroup.subtitle}>
        <Text style={[typography.body, styles.desc]}>{smallGroup.description}</Text>
        <PriceTable rows={[...smallGroup.rows]} note={smallGroup.note} />
      </Section>
      <View style={styles.alt}>
        <Section title={largeGroup.title} subtitle={largeGroup.subtitle} delay={80}>
          <PriceTable rows={[...largeGroup.rows]} note={largeGroup.note} />
        </Section>
      </View>
      <Section title={meats.title} delay={120}>
        <Text style={[typography.bodyLarge, styles.meats]}>{meats.list}</Text>
        <Text style={styles.premium}>{meats.premium}</Text>
        <CTAButton
          href="/quote"
          label="Request a Quote"
          style={{ marginTop: spacing.xl, alignSelf: 'flex-start' }}
        />
      </Section>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  desc: {
    marginBottom: spacing.sm,
    maxWidth: 640,
  },
  alt: {
    backgroundColor: colors.charcoal,
  },
  meats: {
    color: colors.cream,
    marginBottom: spacing.md,
  },
  premium: {
    fontFamily: fonts.bodyMedium,
    color: colors.orange,
    fontSize: 16,
  },
});
