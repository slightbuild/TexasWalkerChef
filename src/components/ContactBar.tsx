import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { fonts, typography } from '../theme';
import { contact } from '../data/contact';
import { CTAButton } from './CTAButton';

export function ContactBar() {
  return (
    <View style={styles.wrap}>
      <View style={styles.rows}>
        <Pressable onPress={() => Linking.openURL(contact.phoneTel)}>
          <Text style={styles.line}>
            Phone: <Text style={styles.value}>{contact.phone}</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(contact.emailMailto)}>
          <Text style={styles.line}>
            Email: <Text style={styles.value}>{contact.email}</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(contact.facebook.url)}>
          <Text style={styles.line}>
            Facebook: <Text style={styles.value}>{contact.facebook.label}</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(contact.instagram.url)}>
          <Text style={styles.line}>
            Instagram: <Text style={styles.value}>{contact.instagram.label}</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(contact.tiktok.url)}>
          <Text style={styles.line}>
            TikTok: <Text style={styles.value}>{contact.tiktok.label}</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ReviewCTA() {
  const hasUrl = Boolean(contact.reviewUrl);
  return (
    <View style={styles.review}>
      <CTAButton
        label="Leave a Review"
        variant="secondary"
        onPress={() =>
          Linking.openURL(hasUrl ? contact.reviewUrl : contact.facebook.url)
        }
      />
      {!hasUrl ? (
        <Text style={styles.hint}>
          Review link placeholder — currently opens Facebook until a preferred
          review page is set.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  rows: {
    gap: spacing.sm,
  },
  line: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 26,
  },
  value: {
    color: colors.cream,
    fontFamily: fonts.bodyMedium,
  },
  review: {
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  hint: {
    ...typography.caption,
    maxWidth: 420,
  },
});
