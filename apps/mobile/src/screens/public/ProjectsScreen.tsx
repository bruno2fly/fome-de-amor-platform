import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';
import { apiGet } from '../../services/api';
import { ApiProject } from '../../types/domain';

export function ProjectsScreen() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  useEffect(() => {
    apiGet<{ projects: ApiProject[] }>('/public/projects')
      .then((response) => setProjects(response.projects))
      .catch(() => setError('Não foi possível carregar os projetos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Projetos Sociais</Text>
      <Text style={styles.subtitle}>
        Sete frentes de cuidado, ensino, acolhimento e transformação social em Guaramirim e nas bases do Fome de Amor.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{projects.length || 7}</Text>
          <Text style={styles.statLabel}>Projetos{'\n'}Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>200+</Text>
          <Text style={styles.statLabel}>Voluntários{'\n'}Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Estados{'\n'}Alcançados</Text>
        </View>
      </View>

      {loading ? <Text style={styles.stateText}>Carregando projetos...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && projects.length === 0 ? <Text style={styles.stateText}>Nenhum projeto publicado no momento.</Text> : null}

      {projects.map((project) => {
        const isOpen = expanded === project.id;
        return (
          <Pressable key={project.id} style={[styles.card, isOpen && styles.cardOpen]} onPress={() => toggle(project.id)}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name="heart-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.cardTitle}>{project.name}</Text>
                <Text style={styles.cardTagline}>{project.short_description}</Text>
              </View>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
            </View>

            <View style={styles.badgeRow}>
              {project.beneficiaries_count ? (
                <View style={styles.badge}>
                  <Ionicons name="people-outline" size={12} color={colors.primary} />
                  <Text style={styles.badgeText}>{project.beneficiaries_count} atendidos</Text>
                </View>
              ) : null}
              {project.photos?.length ? (
                <View style={styles.badge}>
                  <Ionicons name="images-outline" size={12} color={colors.primary} />
                  <Text style={styles.badgeText}>{project.photos.length} fotos</Text>
                </View>
              ) : null}
              {project.videos?.length ? (
                <View style={styles.badge}>
                  <Ionicons name="videocam-outline" size={12} color={colors.primary} />
                  <Text style={styles.badgeText}>{project.videos.length} vídeos</Text>
                </View>
              ) : null}
            </View>

            {isOpen ? (
              <View style={styles.expandedContent}>
                <Text style={styles.fullDescription}>{project.description}</Text>
                {project.photos?.length ? (
                  <View style={styles.teamSection}>
                    <Text style={styles.teamTitle}>Fotos</Text>
                    <View style={styles.teamList}>
                      {project.photos.map((photo) => (
                        <View key={photo.id} style={styles.teamChip}>
                          <Text style={styles.teamChipText}>{photo.caption || 'Foto do projeto'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
                {project.videos?.length ? (
                  <View style={styles.teamSection}>
                    <Text style={styles.teamTitle}>Vídeos</Text>
                    <View style={styles.teamList}>
                      {project.videos.map((video) => (
                        <View key={video.id} style={styles.teamChip}>
                          <Text style={styles.teamChipText}>{video.title || 'Vídeo do projeto'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            ) : (
              <Text style={styles.shortDesc} numberOfLines={2}>
                {project.description}
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
    marginTop: spacing.sm
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center'
  },
  statNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900'
  },
  statLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md
  },
  cardOpen: {
    borderColor: colors.primary,
    borderWidth: 1.5
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  iconWrap: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    padding: spacing.sm
  },
  cardMeta: { flex: 1 },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  cardTagline: { color: colors.muted, fontSize: 13, marginTop: 2 },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMuted,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700'
  },
  shortDesc: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  expandedContent: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md
  },
  fullDescription: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22
  },
  teamSection: {
    marginTop: spacing.md
  },
  teamTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: spacing.sm
  },
  teamList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  teamChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  teamChipText: {
    color: colors.muted,
    fontSize: 12
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
