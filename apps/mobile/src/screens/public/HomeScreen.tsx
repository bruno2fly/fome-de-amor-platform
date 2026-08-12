import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../../components/EventCard';
import { LogoBadge } from '../../components/LogoBadge';
import { SectionHeader } from '../../components/SectionHeader';
import { colors, radii, spacing } from '../../constants/theme';
import { publicEvents } from '../../data/seed';
import { PublicTabParamList } from '../../navigation/types';

type Navigation = BottomTabNavigationProp<PublicTabParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const nextEvents = publicEvents.slice(0, 3);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <LogoBadge size="lg" />
        </View>
        <View style={styles.locationBadge}>
          <Ionicons name="business" size={16} color={colors.white} />
          <Text style={styles.locationText}>GUARAMIRIM · SC · BRASIL</Text>
        </View>
        <Text style={styles.heroTitle}>SERVINDO EM AMOR</Text>
      </View>

      {/* SEÇÃO 1 — AGENDA DE EVENTOS */}
      <SectionHeader title="Agenda de Eventos" action="Ver todos" onAction={() => navigation.navigate('Eventos')} />
      {nextEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {/* SEÇÃO 2 — PROJETOS SOCIAIS */}
      <Pressable style={styles.projectsButton} onPress={() => navigation.navigate('Projetos')}>
        <Ionicons name="heart" size={20} color={colors.white} />
        <Text style={styles.projectsButtonText}>Conheça nossos projetos sociais</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.white} />
      </Pressable>

      {/* SEÇÃO 3 — CULTO AO VIVO */}
      <SectionHeader title="Culto ao Vivo" />
      <Pressable style={styles.liveCard} onPress={() => navigation.navigate('AoVivo')}>
        <View style={styles.liveLeft}>
          <View style={styles.liveBadge}>
            <Ionicons name="play-circle" size={28} color={colors.primary} />
          </View>
        </View>
        <View style={styles.liveContent}>
          <Text style={styles.liveTitle}>Assista o Culto ao Vivo</Text>
          <Text style={styles.liveText}>Todo domingo às 19h — transmissão pelo YouTube</Text>
          <View style={styles.liveAction}>
            <Text style={styles.liveActionText}>Assistir agora</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </View>
      </Pressable>

      {/* PARTE DE BAIXO — DOAÇÃO PIX */}
      <View style={styles.donationCard}>
        <Ionicons name="gift-outline" size={24} color={colors.white} />
        <Text style={styles.donationTitle}>Faça uma Doação</Text>
        <Text style={styles.donationText}>
          Sua contribuição transforma vidas em Guaramirim e nas bases do Fome de Amor.
        </Text>
        <Pressable style={styles.pixButton} onPress={() => navigation.navigate('Doacao')}>
          <Text style={styles.pixButtonText}>Doar via PIX</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  logoContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: radii.sm,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.md
  },
  locationText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2
  },
  heroTitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginTop: spacing.xs
  },
  projectsButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: 16,
    paddingHorizontal: spacing.md
  },
  projectsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center'
  },
  liveCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md
  },
  liveLeft: {
    justifyContent: 'center'
  },
  liveBadge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    padding: spacing.sm
  },
  liveContent: {
    flex: 1
  },
  liveTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  liveText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  liveAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm
  },
  liveActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700'
  },
  donationCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm
  },
  donationTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900'
  },
  donationText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9
  },
  pixButton: {
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12
  },
  pixButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15
  }
});
