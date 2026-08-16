import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradientish } from './SmokeBackground';
import { colors, layout, spacing } from '../theme/colors';
import { fonts, typography } from '../theme';
import { Logo } from './Logo';
import { CTAButton } from './CTAButton';
import { FadeIn } from './FadeIn';
import { contact } from '../data/contact';

/** Viewport-scaled gap between nav and page titles. */
function useNavContentGap(kind: 'hero' | 'page') {
  const { height, width } = useWindowDimensions();
  const min = kind === 'hero' ? 96 : 72;
  const ratio = kind === 'hero' ? 0.14 : 0.1;
  return Math.max(min, Math.round(height * ratio), Math.round(width * 0.04));
}

type PageHeaderProps = {
  title: string;
  lead?: string;
  support?: string;
  showLogo?: boolean;
};

export function PageHeader({ title, lead, support, showLogo = false }: PageHeaderProps) {
  const { width } = useWindowDimensions();
  const logoSize = width < 700 ? 110 : 150;
  const topGap = useNavContentGap('page');

  return (
    <View style={styles.wrap} testID="page-header">
      <LinearGradientish />
      {/* Explicit spacer — guarantees separation from the nav slot above */}
      <View style={{ height: topGap }} testID="page-header-gap" />
      <View style={styles.inner}>
        {showLogo ? (
          <FadeIn>
            <Logo size={logoSize} style={styles.logo} />
          </FadeIn>
        ) : null}
        <FadeIn delay={80}>
          <Text style={[typography.h1, width < 700 && styles.h1Mobile]}>{title}</Text>
        </FadeIn>
        {lead ? (
          <FadeIn delay={140}>
            <Text style={[typography.bodyLarge, styles.lead]}>{lead}</Text>
          </FadeIn>
        ) : null}
        {support ? (
          <FadeIn delay={200}>
            <Text style={[typography.eyebrow, styles.support]}>{support}</Text>
          </FadeIn>
        ) : null}
        <View style={styles.rule} />
      </View>
    </View>
  );
}

type HomeHeroProps = {
  support: string;
  sentence: string;
};

export function HomeHero({ support, sentence }: HomeHeroProps) {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 800;
  const logoSize = isMobile
    ? Math.min(width * 0.58, 240)
    : Math.min(width * 0.26, 340);
  const topGap = useNavContentGap('hero');
  const bottomGap = Math.max(48, Math.round(height * 0.06));

  return (
    <View
      style={[
        styles.hero,
        {
          minHeight: Math.max(height - layout.navHeight, 640),
          paddingBottom: bottomGap,
        },
      ]}
      testID="home-hero"
    >
      <LinearGradientish intense />
      {/* Explicit spacer — cannot be collapsed by centering */}
      <View style={{ height: topGap }} testID="home-hero-gap" />
      <View style={[styles.heroInner, isMobile && styles.heroInnerMobile]}>
        <FadeIn>
          <Logo size={logoSize} style={styles.heroLogo} />
        </FadeIn>
        <FadeIn delay={100}>
          <Text style={[styles.heroName, isMobile && styles.heroNameMobile]}>
            {contact.brand}
          </Text>
        </FadeIn>
        <FadeIn delay={160}>
          <Text style={[typography.eyebrow, styles.heroSupport]}>{support}</Text>
        </FadeIn>
        <FadeIn delay={220}>
          <Text style={[styles.heroSentence, isMobile && styles.heroSentenceMobile]}>
            {sentence}
          </Text>
        </FadeIn>
        <FadeIn delay={320} style={styles.ctaRow}>
          <CTAButton href="/catering" label="View Catering" />
          <CTAButton href="/quote" label="Request a Quote" variant="secondary" />
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingBottom: spacing.xl,
    paddingHorizontal: layout.contentPadding,
    backgroundColor: colors.black,
    overflow: 'hidden',
    minHeight: 320,
    justifyContent: 'flex-start',
  },
  inner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    marginBottom: spacing.lg,
  },
  h1Mobile: {
    fontSize: 40,
    lineHeight: 48,
  },
  lead: {
    marginTop: spacing.md,
    maxWidth: 760,
    color: colors.cream,
  },
  support: {
    marginTop: spacing.md,
  },
  rule: {
    marginTop: spacing.xl,
    height: 4,
    width: 120,
    backgroundColor: colors.orange,
  },
  hero: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: layout.contentPadding,
    backgroundColor: colors.black,
    overflow: 'hidden',
  },
  heroInner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  heroInnerMobile: {
    alignItems: 'center',
  },
  heroLogo: {
    marginBottom: spacing.lg,
  },
  heroName: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 68,
    letterSpacing: 4,
    color: colors.cream,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroNameMobile: {
    fontSize: 38,
    letterSpacing: 2,
  },
  heroSupport: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  heroSentence: {
    fontFamily: fonts.body,
    fontSize: 24,
    lineHeight: 38,
    maxWidth: 720,
    marginBottom: spacing.xl,
    color: colors.cream,
    textAlign: 'center',
  },
  heroSentenceMobile: {
    fontSize: 18,
    lineHeight: 30,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
});
