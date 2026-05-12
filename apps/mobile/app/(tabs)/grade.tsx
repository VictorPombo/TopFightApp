import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

export default function GradeScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    
    // Busca as sessões dos próximos dias
    const { data, error } = await supabase
      .from('class_sessions')
      .select(`
        id,
        start_time,
        end_time,
        capacity,
        classes:class_id (name, modality),
        class_checkins (id, user_id)
      `)
      .order('start_time', { ascending: true })
      .limit(10);

    if (error) {
      console.error(error);
    } else {
      setSessions(data || []);
    }
    setLoading(false);
  };

  const handleCheckin = async (sessionId: string, isCheckedIn: boolean) => {
    if (!session?.user) return;

    if (isCheckedIn) {
      // Cancela Check-in
      const { error } = await supabase
        .from('class_checkins')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', session.user.id);
        
      if (error) Alert.alert("Erro", "Não foi possível cancelar.");
    } else {
      // Faz Check-in
      const { error } = await supabase
        .from('class_checkins')
        .insert({
          session_id: sessionId,
          user_id: session.user.id
        });
        
      if (error) {
        if (error.code === '23505') {
          Alert.alert("Aviso", "Você já confirmou presença nesta aula.");
        } else {
          Alert.alert("Erro", "Não foi possível confirmar presença.");
        }
      } else {
        Alert.alert("Sucesso!", "Sua vaga está garantida! Oss!");
      }
    }
    
    loadSessions(); // Atualiza a contagem
  };

  if (loading) {
    return (
      <View className="flex-1 bg-zinc-950 justify-center items-center">
        <ActivityIndicator size="large" color="#EAB308" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-950 p-6 pt-16">
      <View className="mb-8">
        <Text className="text-3xl font-black text-white uppercase tracking-widest">
          Grade de <Text className="text-yellow-500">Aulas</Text>
        </Text>
        <Text className="text-zinc-400 mt-2 font-medium">Reserve sua vaga no tatame.</Text>
      </View>

      {sessions.length === 0 ? (
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 items-center">
          <Text className="text-zinc-500 text-center font-bold">Nenhuma aula programada.</Text>
        </View>
      ) : (
        <View className="space-y-4 pb-20">
          {sessions.map((sess) => {
            const date = new Date(sess.start_time);
            const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase();
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            const checkins = sess.class_checkins || [];
            const isCheckedIn = checkins.some((c: any) => c.user_id === session?.user?.id);
            const availableSpots = sess.capacity - checkins.length;
            const isFull = availableSpots <= 0;

            return (
              <View key={sess.id} className={`bg-zinc-900 border rounded-3xl p-5 shadow-lg ${isCheckedIn ? 'border-yellow-500' : 'border-zinc-800'}`}>
                
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-xl font-bold text-white">{sess.classes?.name}</Text>
                    <Text className="text-zinc-400 font-bold uppercase text-xs mt-1">{sess.classes?.modality}</Text>
                  </View>
                  <View className="bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                    <Text className="text-yellow-500 font-black text-sm">{time}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mt-2 border-t border-zinc-800 pt-4">
                  <View>
                    <Text className="text-zinc-300 font-bold">{formattedDate}</Text>
                    <Text className={`font-bold mt-1 ${isFull && !isCheckedIn ? 'text-red-500' : 'text-zinc-500'}`}>
                      {availableSpots} VAGAS
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCheckin(sess.id, isCheckedIn)}
                    disabled={isFull && !isCheckedIn}
                    className={`px-6 py-3 rounded-xl flex-row items-center justify-center ${
                      isCheckedIn 
                        ? 'bg-zinc-800 border border-yellow-500' 
                        : isFull 
                          ? 'bg-zinc-800 opacity-50' 
                          : 'bg-yellow-500'
                    }`}
                  >
                    <Text className={`font-black uppercase tracking-wider ${
                      isCheckedIn ? 'text-yellow-500' : isFull ? 'text-zinc-500' : 'text-black'
                    }`}>
                      {isCheckedIn ? 'Cancelar' : isFull ? 'Lotado' : 'Check-in'}
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
