import { StyleSheet, View } from 'react-native';
import { SiteShell } from '../src/components/SiteShell';
import { PageHeader } from '../src/components/PageHeader';
import { Section } from '../src/components/Section';
import { Logo } from '../src/components/Logo';
import { CTAButton } from '../src/components/CTAButton';
import { RichText } from '../src/components/RichText';
import { aboutContent } from '../src/data/service';
import { colors, spacing } from '../src/theme/colors';
import { fonts } from '../src/theme';

export default function AboutScreen() {
  return (
    <SiteShell>
      <PageHeader
        title={aboutContent.pageTitle}
        lead={aboutContent.pageLead}
        support="Southern Flavor • Texas Smoke"
        showLogo
      />
      {aboutContent.sections.map((section, index) => (
        <View
          key={section.title}
          style={index % 2 === 1 ? styles.alt : undefined}
        >
          <Section title={section.title} delay={index * 60}>
            <RichText
              style={{
                fontFamily: fonts.body,
                fontSize: 22,
                lineHeight: 36,
                color: '#FFF6EC',
                maxWidth: 860,
              }}
            >
              {section.body}
            </RichText>
          </Section>
        </View>
      ))}
      <Section>
        <View style={styles.close}>
          <Logo size={140} />
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
  close: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
});
