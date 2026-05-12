import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  session: Session | null;
  userRole: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  userRole: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (!error && data) {
      setUserRole(data.role);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to the login page.
      router.replace('/(auth)/login');
    } else if (session && userRole) {
      if (userRole === 'admin' || userRole === 'professor') {
        // Bloqueio Inverso para Admins no Mobile
        Alert.alert('Acesso Restrito', 'Este app é exclusivo para a jornada do aluno. Acesse o painel Web para gestão.');
        supabase.auth.signOut();
      } else if (inAuthGroup) {
        // Redirect to the tabs if logged in as aluno.
        router.replace('/(tabs)');
      }
    }
  }, [session, loading, segments, userRole]);

  return (
    <AuthContext.Provider value={{ session, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
