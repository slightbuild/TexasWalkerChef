import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { layout, spacing } from '../theme/colors';
import { typography } from '../theme';
import { FadeIn } from './FadeIn';

type SectionProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  style?: ViewStyle;
  delay?: number;
};

export function Section({
  title,
  subtitle,
  eyebrow,
  children,
  style,
  delay = 0,
}: SectionProps) {
  return (
    <FadeIn delay={delay} style={[styles.section, style]}>
      <View style={styles.inner}>
        {eyebrow ? <Text style={typography.eyebrow}>{eyebrow}</Text> : null}
        {title ? <Text style={[typography.h2, styles.title]}>{title}</Text> : null}
        {subtitle ? (
          <Text style={[typography.bodyLarge, styles.subtitle]}>{subtitle}</Text>
        ) : null}
        {children}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingVertical: spacing.section,
    paddingHorizontal: layout.contentPadding,
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
  },
  title: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    maxWidth: 900,
  },
  subtitle: {
    marginBottom: spacing.xl,
    maxWidth: 820,
  },
});
