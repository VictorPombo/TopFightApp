import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Dumbbell } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Erro no Login', error.message.includes('Invalid login') ? 'Email ou senha incorretos.' : 'Tente novamente mais tarde.');
    }
    
    // O redirecionamento é tratado pelo AuthProvider
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-slate-950 p-6">
      <View className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl items-center">
        
        <View className="w-20 h-20 bg-slate-800 rounded-full items-center justify-center border border-slate-700 mb-6">
          <Dumbbell size={40} color="#f97316" />
        </View>
        
        <Text className="text-3xl font-black text-white uppercase tracking-wider mb-2">
          Fight <Text className="text-orange-500">Hub</Text>
        </Text>
        <Text className="text-slate-400 text-sm mb-8 text-center">App exclusivo do Aluno</Text>

        <View className="w-full space-y-4 mb-6">
          <View>
            <Text className="text-slate-300 font-medium mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="aluno@email.com"
              placeholderTextColor="#475569"
              autoCapitalize="none"
              keyboardType="email-address"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 h-14 text-white font-medium"
            />
          </View>

          <View>
            <Text className="text-slate-300 font-medium mb-2 mt-4">Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 h-14 text-white font-medium"
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogin} 
          disabled={loading}
          className="w-full bg-orange-600 rounded-xl h-14 items-center justify-center flex-row shadow-lg mt-2"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Entrar no Tatame</Text>
          )}
        </TouchableOpacity>
        
      </View>
    </View>
  );
}
