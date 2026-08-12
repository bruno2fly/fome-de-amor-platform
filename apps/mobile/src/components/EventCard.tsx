import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../constants/theme';
import { AppEvent } from '../types/domain';

type Props = {
  event: AppEvent;
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});

const dateOnlyFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short'
});

function formatEventDate(event: AppEvent): string {
  const start = new Date(event.startsAt);
  const hour = start.getHours();
  const minute = start.getMinutes();
  const hasTime = hour !== 0 || minute !== 0;

  if (event.endsAt) {
    const end = new Date(event.endsAt);
    return `${dateOnlyFormatter.format(start)} – ${dateOnlyFormatter.format(end)}`;
  }
  return hasTime ? dateFormatter.format(start) : dateOnlyFormatter.format(start);
}

function openWhatsApp(phone: string, message: string) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
}

export function EventCard({ event }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>{formatEventDate(event)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={16} color={colors.muted} />
          <Text style={styles.meta}>{event.location}</Text>
        </View>

        {event.price ? (
          <View style={styles.metaRow}>
            <Ionicons name="pricetag-outline" size={16} color={colors.muted} />
            <Text style={styles.meta}>{event.price}</Text>
          </View>
        ) : null}

        {event.contactPhone && !event.registrationWhatsApp ? (
          <View style={styles.metaRow}>
            <Ionicons name="call-outline" size={16} color={colors.muted} />
            <Text style={styles.meta}>{event.contactPhone}</Text>
          </View>
        ) : null}

        {event.registrationEnabled && event.registrationWhatsApp ? (
          <Pressable
            style={styles.whatsappButton}
            onPress={() => openWhatsApp(
              event.registrationWhatsApp!,
              event.registrationWhatsAppMessage ?? `Olá! Gostaria de me inscrever no evento: ${event.title}`
            )}
          >
            <Ionicons name="logo-whatsapp" size={16} color={colors.white} />
            <Text style={styles.whatsappButtonText}>Garantir minha vaga</Text>
          </Pressable>
        ) : event.registrationEnabled ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>Inscrições em breve</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md
  },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 64,
    width: 76
  },
  dateText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 4
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    flex: 1
  },
  whatsappButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#25D366',
    borderRadius: radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10
  },
  whatsappButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  tagText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  }
});
