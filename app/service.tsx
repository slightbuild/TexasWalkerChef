import { StyleSheet, Text, View } from 'react-native';
import { SiteShell } from '../src/components/SiteShell';
import { PageHeader } from '../src/components/PageHeader';
import { Section } from '../src/components/Section';
import { ContactBar, ReviewCTA } from '../src/components/ContactBar';
import { CTAButton } from '../src/components/CTAButton';
import { RichText } from '../src/components/RichText';
import { serviceContent } from '../src/data/service';
import { colors, radii, spacing } from '../src/theme/colors';
import { fonts } from '../src/theme';

export default function ServiceScreen() {
  const { moreThanBbq, cateringYourWay, share } = serviceContent;

  return (
    <SiteShell>
      <PageHeader
        title={serviceContent.pageTitle}
        lead={serviceContent.pageLead}
        support={serviceContent.pageSupport}
      />
      <Section title={moreThanBbq.title}>
            <RichText
              style={{
                fontFamily: fonts.body,
                fontSize: 22,
                lineHeight: 36,
                color: '#FFF6EC',
                maxWidth: 860,
              }}
            >
              {moreThanBbq.body}
            </RichText>
      </Section>
      <View style={styles.alt}>
        <Section title={cateringYourWay.title} delay={80}>
          <View style={styles.options}>
            {cateringYourWay.options.map((option) => (
              <View key={option.title} style={styles.option}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <RichText
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 18,
                    lineHeight: 30,
                    color: '#B5B5B5',
                  }}
                >
                  {option.body}
                </RichText>
              </View>
            ))}
          </View>
        </Section>
      </View>
      <Section title="Contact Walker Texas Chef" delay={100}>
        <ContactBar />
      </Section>
      <Section
        title={share.title}
        subtitle={share.body.replace(/\n/g, ' ')}
        delay={120}
      >
        <ReviewCTA />
        <CTAButton
          href="/quote"
          label="Request a Quote"
          style={{ marginTop: spacing.lg, alignSelf: 'flex-start' }}
        />
      </Section>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  alt: {
    backgroundColor: colors.charcoal,
  },
  options: {
    gap: spacing.xl,
  },
  option: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderLeftWidth: 5,
    borderLeftColor: colors.orange,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    gap: spacing.md,
  },
  optionTitle: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 32,
    letterSpacing: 2,
    color: colors.cream,
    textTransform: 'uppercase',
  },
});
