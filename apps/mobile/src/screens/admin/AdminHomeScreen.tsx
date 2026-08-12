import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

const modules = ['Eventos', 'Líderes', 'Avisos', 'Documentos', 'Controle da live'];

export function AdminHomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Painel admin</Text>
      <Text style={styles.subtitle}>Gestão completa para Patrick administrar conteúdo, líderes e notificações.</Text>
      {modules.map((module) => (
        <View key={module} style={styles.card}>
          <Text style={styles.cardTitle}>{module}</Text>
          <Text style={styles.cardText}>Módulo pronto para conectar às rotas administrativas da API.</Text>
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
