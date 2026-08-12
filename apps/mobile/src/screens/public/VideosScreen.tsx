import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';
import { apiGet } from '../../services/api';
import { ApiVideo } from '../../types/domain';

export function VideosScreen() {
  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet<{ videos: ApiVideo[] }>('/public/videos')
      .then((response) => setVideos(response.videos))
      .catch(() => setError('Não foi possível carregar os vídeos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Vídeos</Text>
      <Text style={styles.subtitle}>Mensagens, ações sociais e conteúdos da missão Fome de Amor.</Text>

      {loading ? <Text style={styles.stateText}>Carregando vídeos...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && videos.length === 0 ? <Text style={styles.stateText}>Nenhum vídeo publicado no momento.</Text> : null}

      {videos.map((video) => (
        <View key={video.id} style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="play-circle-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{video.title}</Text>
            {video.description ? <Text style={styles.cardText}>{video.description}</Text> : null}
            <Text style={styles.urlText}>{video.video_url}</Text>
          </View>
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
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  cardContent: { flex: 1 },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  cardText: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  urlText: { color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: spacing.sm },
  stateText: { color: colors.muted, fontSize: 15, lineHeight: 22, paddingVertical: spacing.md, textAlign: 'center' },
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
