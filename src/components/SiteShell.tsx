import { ReactNode, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Footer, Nav } from './Nav';

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  // Prevent the browser page from scrolling under the nav (common RN-web overlap).
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevHeight = body.style.height;
    html.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.height = prevHeight;
    };
  }, []);

  return (
    <View style={styles.root} testID="site-shell">
      <View style={styles.navSlot} testID="nav-slot">
        <Nav />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="site-scroll"
      >
        {children}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
    ...(Platform.OS === 'web'
      ? ({
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        } as object)
      : null),
  },
  navSlot: {
    width: '100%',
    flexShrink: 0,
    zIndex: 20,
    backgroundColor: colors.black,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
