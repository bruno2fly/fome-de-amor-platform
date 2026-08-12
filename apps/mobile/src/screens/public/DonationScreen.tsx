import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

const pixKey = '22064266000130';

export function DonationScreen() {
  async function copyPix() {
    await Clipboard.setStringAsync(pixKey);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Doe para a Fome de Amor</Text>
        <Text style={styles.text}>Sua contribuição sustenta alimentação, acolhimento, projetos com crianças e ações sociais.</Text>
        <View style={styles.pixBox}>
          <Text style={styles.label}>Chave PIX CNPJ</Text>
          <Text style={styles.pix}>{pixKey}</Text>
        </View>
        <Pressable style={styles.button} onPress={copyPix}>
          <Ionicons name="copy-outline" size={18} color={colors.white} />
          <Text style={styles.buttonText}>Copiar chave PIX</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
  pixBox: { backgroundColor: '#FFF0EF', borderRadius: radii.md, marginTop: spacing.lg, padding: spacing.md },
  label: { color: colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  pix: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: spacing.xs },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    padding: spacing.md
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '900' }
});
