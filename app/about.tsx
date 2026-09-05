import { StyleSheet, Text, View } from 'react-native';
import { SiteShell } from '../src/components/SiteShell';
import { PageHeader } from '../src/components/PageHeader';
import { Section } from '../src/components/Section';
import { Logo } from '../src/components/Logo';
import { CTAButton } from '../src/components/CTAButton';
import { RichText } from '../src/components/RichText';
import { aboutContent } from '../src/data/service';
import { contact } from '../src/data/contact';
import { colors, spacing } from '../src/theme/colors';
import { fonts, typography } from '../src/theme';

export default function AboutScreen() {
  return (
    <SiteShell>
      <PageHeader
        title={aboutContent.pageTitle}
        lead={aboutContent.pageLead}
        support={aboutContent.pageSupport}
        showLogo
      />
      {aboutContent.sections.map((section, index) => (
        <View
          key={section.title}
          style={index % 2 === 1 ? styles.alt : undefined}
        >
          <Section title={section.title} delay={index * 60}>
            <RichText style={[typography.bodyLarge, styles.body]}>
              {section.body}
            </RichText>
          </Section>
        </View>
      ))}
      <View style={styles.strip}>
        <Text style={styles.stripText}>Southern Flavor</Text>
        <Text style={styles.stripDot}>•</Text>
        <Text style={styles.stripText}>Texas Smoke</Text>
        <Text style={styles.stripDot}>•</Text>
        <Text style={styles.stripText}>Made for Gathering</Text>
      </View>
      <Section>
        <View style={styles.close}>
          <Logo size={140} />
          <Text style={[typography.bodyLarge, styles.closeLine]}>
            {contact.tagline}
          </Text>
          <CTAButton
            href="/quote"
            label="Request a Quote"
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </Section>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  alt: {
    backgroundColor: colors.charcoal,
  },
  body: {
    color: colors.cream,
    maxWidth: 860,
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
  close: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  closeLine: {
    color: colors.cream,
    maxWidth: 640,
  },
});
