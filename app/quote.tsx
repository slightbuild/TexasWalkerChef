import { StyleSheet, Text } from 'react-native';
import { SiteShell } from '../src/components/SiteShell';
import { PageHeader } from '../src/components/PageHeader';
import { Section } from '../src/components/Section';
import { QuoteForm } from '../src/components/QuoteForm';
import { typography } from '../src/theme';
import { spacing } from '../src/theme/colors';

export default function QuoteScreen() {
  return (
    <SiteShell>
      <PageHeader
        title="Request a Quote"
        lead="You bring the people. We’ll bring the flavor."
        support="Southern Flavor • Texas Smoke"
      />
      <Section>
        <Text style={[typography.bodyLarge, styles.intro]}>
          Tell us about your event, pick menu items, and we’ll help build a
          catering option that fits — from small gatherings to full-service
          celebrations.
        </Text>
        <QuoteForm />
      </Section>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  intro: {
    maxWidth: 640,
    marginBottom: spacing.xl,
  },
});
