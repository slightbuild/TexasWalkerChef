import { StyleSheet, Text } from 'react-native';
import { SiteShell } from '../../src/components/SiteShell';
import { PageHeader } from '../../src/components/PageHeader';
import { Section } from '../../src/components/Section';
import { PriceTable, SliderPriceTable } from '../../src/components/PriceTable';
import { slidersWingsContent } from '../../src/data/slidersWings';
import { colors, spacing } from '../../src/theme/colors';
import { typography } from '../../src/theme';

export default function SlidersWingsScreen() {
  const { sliders, wings } = slidersWingsContent;

  return (
    <SiteShell>
      <PageHeader
        title={slidersWingsContent.pageTitle}
        lead={slidersWingsContent.pageLead}
        support={slidersWingsContent.pageSupport}
      />
      <Section title={sliders.title}>
        <Text style={[typography.body, styles.desc]}>{sliders.description}</Text>
        <SliderPriceTable rows={[...sliders.rows]} />
      </Section>
      <Section
        title={wings.title}
        style={{ backgroundColor: colors.charcoal }}
        delay={80}
      >
        <Text style={[typography.body, styles.desc]}>{wings.description}</Text>
        <PriceTable rows={[...wings.rows]} note={wings.note} />
      </Section>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  desc: {
    marginBottom: spacing.sm,
    maxWidth: 720,
  },
});
