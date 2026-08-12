import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../../components/EventCard';
import { colors, radii, spacing } from '../../constants/theme';
import { apiGet } from '../../services/api';
import { ApiEvent, AppEvent } from '../../types/domain';

type Filter = 'todos' | 'proximos' | 'inscricao';

export function EventsScreen() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [publicEvents, setPublicEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet<{ events: ApiEvent[] }>('/public/events')
      .then((response) => {
        setPublicEvents(
          response.events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            startsAt: event.starts_at,
            endsAt: event.ends_at ?? undefined,
            imageUrl: event.cover_image_url ?? undefined,
            visibility: 'public',
            registrationEnabled: event.registration_enabled,
            signupUrl: event.signup_url ?? undefined
          }))
        );
      })
      .catch(() => setError('Não foi possível carregar a agenda.'))
      .finally(() => setLoading(false));
  }, []);

  const events = useMemo(() => {
    if (filter === 'inscricao') {
      return publicEvents.filter((event) => event.registrationEnabled);
    }
    return publicEvents;
  }, [filter, publicEvents]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Agenda pública</Text>
        <Text style={styles.title}>Eventos da Fome de Amor</Text>
        <Text style={styles.subtitle}>Acompanhe cultos, ações sociais, encontros e mobilizações da missão.</Text>
      </View>

      <View style={styles.filters}>
        {(['todos', 'proximos', 'inscricao'] as Filter[]).map((item) => (
          <Pressable
            key={item}
            style={[styles.filterButton, filter === item && styles.filterButtonActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item === 'todos' ? 'Todos' : item === 'proximos' ? 'Próximos' : 'Com inscrição'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.notificationBox}>
        <Ionicons name="notifications-outline" size={20} color={colors.primary} />
        <Text style={styles.notificationText}>Toque no sino de um evento para receber lembrete quando a notificação estiver ativa.</Text>
      </View>

      {loading ? <Text style={styles.stateText}>Carregando eventos...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && events.length === 0 ? <Text style={styles.stateText}>Nenhum evento publicado no momento.</Text> : null}
      {events.map((event) => <EventCard key={event.id} event={event} />)}
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
  header: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.primary,
    borderBottomWidth: 4,
    borderRadius: radii.lg,
    padding: spacing.lg
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: spacing.sm
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.lg
  },
  filterButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800'
  },
  filterTextActive: {
    color: colors.white
  },
  notificationBox: {
    alignItems: 'flex-start',
    backgroundColor: '#FFF0EF',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md
  },
  notificationText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  stateText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    paddingVertical: spacing.md,
    textAlign: 'center'
  },
  errorText: {
    backgroundColor: '#FFF0EF',
    borderRadius: radii.md,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
    padding: spacing.md,
    textAlign: 'center'
  }
});
