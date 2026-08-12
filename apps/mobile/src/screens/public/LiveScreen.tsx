import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';
import { apiGet } from '../../services/api';
import { ApiLiveService } from '../../types/domain';

export function LiveScreen() {
  const [live, setLive] = useState<ApiLiveService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet<{ live: ApiLiveService | null }>('/public/live')
      .then((response) => setLive(response.live))
      .catch(() => setError('Não foi possível carregar o culto.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.liveBanner}>
        <Ionicons name="radio-outline" size={24} color={colors.white} />
        <Text style={styles.liveText}>{live?.is_live ? 'AO VIVO AGORA' : 'Culto ao vivo aos domingos, 19h, horário de Brasília.'}</Text>
      </View>
      <View style={styles.player}>
        <Ionicons name="logo-youtube" size={48} color={colors.primary} />
        <Text style={styles.title}>{live?.title ?? 'Transmissão pelo YouTube'}</Text>
        {loading ? <Text style={styles.subtitle}>Carregando transmissão...</Text> : null}
        {error ? <Text style={styles.subtitle}>{error}</Text> : null}
        {!loading && !error && live ? (
          <>
            <Text style={styles.subtitle}>{live.youtube_url}</Text>
            {live.starts_at ? <Text style={styles.subtitle}>{new Date(live.starts_at).toLocaleString('pt-BR')}</Text> : null}
          </>
        ) : null}
        {!loading && !error && !live ? <Text style={styles.subtitle}>Nenhuma transmissão cadastrada no momento.</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  liveBanner: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md
  },
  liveText: { color: colors.white, flex: 1, fontSize: 15, fontWeight: '800', lineHeight: 21 },
  player: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginTop: spacing.lg,
    padding: spacing.xl
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: spacing.md, textAlign: 'center' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: spacing.sm, textAlign: 'center' }
});
