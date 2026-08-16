import { StyleSheet, Text } from 'react-native';
import { SiteShell } from '../../src/components/SiteShell';
import { PageHeader } from '../../src/components/PageHeader';
import { Section } from '../../src/components/Section';
import { PriceTable } from '../../src/components/PriceTable';
import { smokedMeatsContent } from '../../src/data/smokedMeats';
import { colors, spacing } from '../../src/theme/colors';
import { typography } from '../../src/theme';

export default function SmokedMeatsScreen() {
  const { meats, sandwiches } = smokedMeatsContent;

  return (
    <SiteShell>
      <PageHeader
        title={smokedMeatsContent.pageTitle}
        lead={smokedMeatsContent.pageLead}
        support={smokedMeatsContent.pageSupport}
      />
      <Section title={meats.title}>
        <PriceTable rows={[...meats.rows]} />
      </Section>
      <Section
        title={sandwiches.title}
        style={{ backgroundColor: colors.charcoal }}
        delay={80}
      >
        <Text style={[typography.body, styles.desc]}>{sandwiches.description}</Text>
        <PriceTable rows={[...sandwiches.rows]} />
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
