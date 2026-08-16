import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type CTAButtonProps = {
  href?: string;
  label: string;
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle;
};

export function CTAButton({
  href,
  label,
  onPress,
  variant = 'primary',
  style,
}: CTAButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const labelStyle = StyleSheet.flatten([
    styles.label,
    variant === 'primary' ? styles.labelOnOrange : styles.labelLight,
  ]);

  const face = (
    <Animated.View
      style={[
        StyleSheet.flatten([styles.base, styles[variant], style]),
        animatedStyle,
      ]}
    >
      <Text style={labelStyle}>{label}</Text>
    </Animated.View>
  );

  const pressHandlers = {
    onPress,
    onPressIn: () => {
      scale.value = withSpring(0.97, { damping: 14 });
    },
    onPressOut: () => {
      scale.value = withSpring(1, { damping: 14 });
    },
  };

  if (href) {
    return (
      <Link href={href as any} asChild>
        <Pressable {...pressHandlers} accessibilityRole="button">
          {face}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable {...pressHandlers} accessibilityRole="button">
      {face}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  primary: {
    backgroundColor: colors.orange,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.orange,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  labelOnOrange: {
    color: colors.black,
  },
  labelLight: {
    color: colors.cream,
  },
});
