import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, CalendarCheck, Ticket, UserCircle2 } from 'lucide-react-native';

export default function HomeAlunoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1 px-5 pt-4">
        
        {/* Header Saudação */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-slate-400 text-sm font-medium">Bom treino,</Text>
            <Text className="text-white text-2xl font-bold">Oss, Aluno!</Text>
          </View>
          <View className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center border-2 border-orange-600">
            <UserCircle2 color="#94a3b8" size={30} />
          </View>
        </View>

        {/* Card Gamificação (Black Card Style) */}
        <View className="w-full bg-slate-900 rounded-3xl p-6 border border-slate-800 mb-6 shadow-xl relative overflow-hidden">
          {/* Faixa decorativa lateral (simulando a ponta da faixa) */}
          <View className="absolute top-0 bottom-0 right-0 w-8 bg-white/10" />
          
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-300 font-semibold uppercase tracking-widest text-xs">Sua Graduação</Text>
            <Trophy color="#f97316" size={20} />
          </View>
          <Text className="text-white text-3xl font-black mb-1">Faixa Branca</Text>
          <Text className="text-orange-500 font-bold mb-6">Grau 1</Text>
          
          <View className="bg-slate-950/50 rounded-xl p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-slate-400 text-xs uppercase mb-1">Aulas Realizadas</Text>
              <Text className="text-white text-xl font-bold">12 / 30</Text>
            </View>
            <View className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
              <View className="w-2/5 h-full bg-orange-600 rounded-full" />
            </View>
          </View>
        </View>

        {/* Check-in Rápido */}
        <Text className="text-white font-bold text-lg mb-3">Próximo Treino</Text>
        <TouchableOpacity className="w-full bg-slate-800 rounded-2xl p-5 mb-6 flex-row items-center justify-between border border-slate-700 active:bg-slate-700">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-orange-600/20 rounded-full items-center justify-center mr-4">
              <CalendarCheck color="#ea580c" size={24} />
            </View>
            <View>
              <Text className="text-white font-bold text-lg">Jiu Jitsu - Iniciante</Text>
              <Text className="text-slate-400 text-sm mt-1">Hoje, 19:00 - Prof. Splinter</Text>
            </View>
          </View>
          <View className="bg-orange-600 px-3 py-1.5 rounded-lg">
            <Text className="text-white font-bold text-xs">Fazer Check-in</Text>
          </View>
        </TouchableOpacity>

        {/* Banner de Rifa */}
        <TouchableOpacity className="w-full bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 mb-8 items-center justify-between flex-row overflow-hidden relative">
          <View className="z-10 w-2/3">
            <View className="bg-white/20 self-start px-2 py-1 rounded-md mb-2">
              <Text className="text-white font-bold text-xs uppercase tracking-wider">Ação Ativa</Text>
            </View>
            <Text className="text-white font-black text-xl mb-1">Sorteio de Fim de Ano</Text>
            <Text className="text-white/80 text-sm mb-3">Concorra a um Kimono novo + 3 meses de mensalidade grátis!</Text>
            <Text className="text-white font-bold underline">Comprar Números</Text>
          </View>
          <View className="z-10 w-1/3 items-end opacity-90">
            <Ticket color="white" size={60} strokeWidth={1.5} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
