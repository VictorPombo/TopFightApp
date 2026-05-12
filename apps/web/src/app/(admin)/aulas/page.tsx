"use client";

import { useEffect, useState } from "react";
import { getClassesAction, createClassAction } from "@/actions/aulas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Calendar, Clock, Users, Dumbbell } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AulasPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const result = await getClassesAction();
    if (result.success) {
      setClasses(result.data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createClassAction(formData);

    if (!result.success) {
      setError(result.error || "Erro ao criar aula.");
      setSubmitting(false);
      return;
    }

    setShowForm(false);
    setSubmitting(false);
    loadClasses(); // Recarrega a lista
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Grade de Aulas</h1>
          <p className="text-zinc-500 font-medium mt-1">Gerencie as modalidades e a agenda semanal.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-zinc-900/20"
        >
          {showForm ? "Cancelar" : <><Plus className="mr-2 h-5 w-5" /> Nova Aula</>}
        </Button>
      </header>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xl shadow-zinc-200/50 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center">
            <span className="bg-yellow-500 text-black w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="h-4 w-4" />
            </span>
            Cadastrar Nova Modalidade
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-600">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-700 font-bold">Nome da Aula (Ex: Muay Thai 19h)</Label>
              <Input id="name" name="name" required className="h-12 bg-zinc-50 rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modality" className="text-zinc-700 font-bold">Modalidade (Ex: Muay Thai)</Label>
              <Input id="modality" name="modality" required className="h-12 bg-zinc-50 rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-zinc-700 font-bold">Capacidade Máxima (Vagas)</Label>
              <Input id="capacity" name="capacity" type="number" defaultValue="20" required className="h-12 bg-zinc-50 rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-zinc-700 font-bold">Duração (Minutos)</Label>
              <Input id="duration" name="duration" type="number" defaultValue="60" required className="h-12 bg-zinc-50 rounded-xl" />
            </div>

            <div className="md:col-span-2 pt-4">
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest h-14 rounded-xl shadow-lg shadow-yellow-500/20"
              >
                {submitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Gerar Aulas e Sessões"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
            <div className="col-span-full bg-white border border-zinc-200 border-dashed rounded-2xl p-12 text-center text-zinc-500">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              Nenhuma aula cadastrada ainda.
            </div>
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500"></div>
                <h3 className="text-xl font-bold text-zinc-900 mb-1">{cls.name}</h3>
                <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase rounded-full mb-4">
                  {cls.modality}
                </span>
                
                <div className="space-y-2 text-sm text-zinc-500 font-medium">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-zinc-400" />
                    {cls.capacity} Vagas por Sessão
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-zinc-400" />
                    {cls.duration_minutes} Minutos
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
