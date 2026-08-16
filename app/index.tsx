import { StyleSheet, Text, View } from 'react-native';
import { SiteShell } from '../src/components/SiteShell';
import { HomeHero } from '../src/components/PageHeader';
import { Section } from '../src/components/Section';
import { CTAButton } from '../src/components/CTAButton';
import { homeContent } from '../src/data/home';
import { colors, spacing } from '../src/theme/colors';
import { fonts, typography } from '../src/theme';

export default function HomeScreen() {
  return (
    <SiteShell>
      <HomeHero
        support={homeContent.heroSupport}
        sentence={homeContent.heroSentence}
      />
      <View style={styles.band}>
        <Section
          eyebrow="Catering"
          title={homeContent.cateringTitle}
          subtitle={homeContent.cateringLead}
          delay={100}
        >
          <Text style={[typography.bodyLarge, styles.body]}>
            {homeContent.cateringBody}
          </Text>
          <View style={styles.ctas}>
            <CTAButton href="/catering" label="View Catering" />
            <CTAButton href="/quote" label="Request a Quote" variant="secondary" />
          </View>
        </Section>
      </View>
      <View style={styles.strip}>
        <Text style={styles.stripText}>Southern Flavor</Text>
        <Text style={styles.stripDot}>•</Text>
        <Text style={styles.stripText}>Texas Smoke</Text>
        <Text style={styles.stripDot}>•</Text>
        <Text style={styles.stripText}>Made for Gathering</Text>
      </View>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: colors.charcoal,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  body: {
    maxWidth: 820,
    marginBottom: spacing.xl,
    color: colors.cream,
  },
  ctas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  strip: {
    backgroundColor: colors.orange,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  stripText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 26,
    letterSpacing: 3,
    color: colors.black,
    textTransform: 'uppercase',
  },
  stripDot: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 26,
    color: colors.black,
  },
});
