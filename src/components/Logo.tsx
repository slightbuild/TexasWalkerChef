import { Image } from 'expo-image';
import { StyleSheet, View, ViewStyle } from 'react-native';

type LogoProps = {
  size?: number;
  /** 0–1. Lower values blend into dark backgrounds. */
  opacity?: number;
  style?: ViewStyle;
};

export function Logo({ size = 64, opacity = 1, style }: LogoProps) {
  return (
    <View
      style={StyleSheet.flatten([
        styles.wrap,
        { width: size, height: size, opacity },
        style,
      ])}
    >
      <Image
        source={require('../../assets/logo-brand.jpg')}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        cachePolicy="none"
        accessibilityLabel="Walker Texas Chef logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderRadius: 999,
  },
});
