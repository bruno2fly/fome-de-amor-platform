import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { LogoBadge } from '../components/LogoBadge';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import { AboutScreen } from '../screens/public/AboutScreen';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { DonationScreen } from '../screens/public/DonationScreen';
import { EventsScreen } from '../screens/public/EventsScreen';
import { HomeScreen } from '../screens/public/HomeScreen';
import { LeadershipHomeScreen } from '../screens/leadership/LeadershipHomeScreen';
import { LiveScreen } from '../screens/public/LiveScreen';
import { ProjectsScreen } from '../screens/public/ProjectsScreen';
import { VideosScreen } from '../screens/public/VideosScreen';
import { PublicTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<PublicTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function PublicTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: () => <LogoBadge size="sm" />,
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: '#0A0A0A' },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof PublicTabParamList, keyof typeof Ionicons.glyphMap> = {
            Inicio: 'home-outline',
            Eventos: 'calendar-outline',
            Projetos: 'heart-outline',
            Doacao: 'gift-outline',
            AoVivo: 'play-circle-outline',
            Videos: 'videocam-outline'
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Eventos" component={EventsScreen} />
      <Tab.Screen name="Projetos" component={ProjectsScreen} />
      <Tab.Screen name="Doacao" component={DonationScreen} options={{ title: 'Doação' }} />
      <Tab.Screen name="AoVivo" component={LiveScreen} options={{ title: 'Ao Vivo' }} />
      <Tab.Screen name="Videos" component={VideosScreen} options={{ title: 'Vídeos' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '800' }
        }}
      >
        <Stack.Screen name="PublicTabs" component={PublicTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Sobre" component={AboutScreen} />
        <Stack.Screen name="Lideranca" component={LeadershipHomeScreen} options={{ title: 'Liderança' }} />
        <Stack.Screen name="Admin" component={AdminHomeScreen} options={{ title: 'Admin' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
