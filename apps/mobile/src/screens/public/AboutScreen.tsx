import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

const bases = ['Guaramirim, SC', 'Base 2', 'Base 3', 'Base 4', 'Base 5', 'Base 6', 'Base 7'];
const groups = ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4', 'Grupo 5', 'Grupo 6'];

export function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sobre a missão</Text>
      <Text style={styles.text}>
        A Fome de Amor é uma missão social cristã baseada em Guaramirim, SC, dedicada a alimentar, acolher e cuidar de pessoas.
      </Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>7 bases pelo Brasil</Text>
        {bases.map((base) => (
          <Text key={base} style={styles.item}>{base}</Text>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>De Casa em Casa</Text>
        {groups.map((group) => (
          <Text key={group} style={styles.item}>{group} - líder e WhatsApp a cadastrar</Text>
        ))}
      </View>
      <Text style={styles.contact}>WhatsApp: (47) 99995-5258{'\n'}Site: fomedeamor.com{'\n'}Instagram: @fomedeamor</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: spacing.sm },
  item: { color: colors.muted, fontSize: 14, paddingVertical: spacing.xs },
  contact: { color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 24, marginTop: spacing.lg }
});
