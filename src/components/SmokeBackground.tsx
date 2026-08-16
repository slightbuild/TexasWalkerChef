import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type Props = {
  intense?: boolean;
};

/** Full-bleed flame header with smooth black ↔ orange blends. */
export function LinearGradientish({ intense = false }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={require('../../assets/flame-section-bg.png')}
        style={styles.image}
        contentFit="cover"
      />

      {/* Soft top fade into black — no hard cut */}
      <LinearGradient
        colors={[
          'rgba(5,5,5,0.92)',
          'rgba(5,5,5,0.55)',
          'rgba(5,5,5,0.18)',
          'transparent',
        ]}
        locations={[0, 0.28, 0.55, 0.82]}
        style={styles.topFade}
      />

      {/* Mid haze so orange never pops as a hard band */}
      <LinearGradient
        colors={[
          'transparent',
          intense ? 'rgba(20,10,4,0.25)' : 'rgba(12,8,5,0.35)',
          'rgba(40,16,4,0.28)',
          'transparent',
        ]}
        locations={[0.15, 0.45, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Bottom ember glow — feathered into black */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255,92,0,0.04)',
          'rgba(255,92,0,0.16)',
          'rgba(212,72,0,0.28)',
          'rgba(5,5,5,0.55)',
        ]}
        locations={[0, 0.35, 0.55, 0.78, 1]}
        style={styles.bottomFade}
      />

      <LinearGradient
        colors={['transparent', colors.orange]}
        locations={[0.35, 1]}
        style={styles.heatLine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  topFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '70%',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  heatLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
    opacity: 0.55,
  },
});
