import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

const sections = ['Calendário da liderança', 'Avisos internos', 'Documentos'];

export function LeadershipHomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Área da liderança</Text>
      <Text style={styles.subtitle}>Acesso restrito para líderes cadastrados pelo admin.</Text>
      {sections.map((section) => (
        <View key={section} style={styles.card}>
          <Text style={styles.cardTitle}>{section}</Text>
          <Text style={styles.cardText}>Integração com API e autenticação JWT preparada na estrutura do backend.</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: spacing.lg, marginTop: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, marginBottom: spacing.md, padding: spacing.md },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  cardText: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: spacing.xs }
});
