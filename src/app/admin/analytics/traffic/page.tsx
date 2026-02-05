
"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  BarChart3, 
  History,
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useRouter } from 'next/navigation';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TrafficHistory() {
  const firestore = useFirestore();
  const router = useRouter();
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [isChangingPeriod, setIsChangingPeriod] = useState(false);
  const [isBacking, setIsBacking] = useState(false);
  
  const visitsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'tourVisits');
  }, [firestore]);
  
  const { data: visits, isLoading } = useCollection(visitsRef);

  const handlePeriodChange = (days: number) => {
    setIsChangingPeriod(true);
    setDaysFilter(days);
    // Simular un pequeño retraso para feedback visual si los datos cargan muy rápido
    setTimeout(() => setIsChangingPeriod(false), 400);
  };

  const trafficData = useMemo(() => {
    if (!visits) return [];

    const now = new Date();
    const startDate = startOfDay(subDays(now, daysFilter - 1));
    const endDate = endOfDay(now);

    const filteredVisits = visits.filter(v => {
      const vDate = new Date(v.timestamp);
      return isWithinInterval(vDate, { start: startDate, end: endDate });
    });

    const daysMap: Record<string, { date: Date, count: number, label: string }> = {};
    
    for (let i = 0; i < daysFilter; i++) {
      const d = subDays(now, i);
      const key = format(d, 'yyyy-MM-dd');
      daysMap[key] = {
        date: d,
        count: 0,
        label: format(d, 'd MMM', { locale: es })
      };
    }

    filteredVisits.forEach(v => {
      const key = format(new Date(v.timestamp), 'yyyy-MM-dd');
      if (daysMap[key]) {
        daysMap[key].count++;
      }
    });

    return Object.values(daysMap).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [visits, daysFilter]);

  const stats = useMemo(() => {
    if (!visits) return { total: 0, average: 0, topDay: 'N/A', growth: 0 };

    const now = new Date();
    const currentStart = startOfDay(subDays(now, daysFilter - 1));
    const previousStart = startOfDay(subDays(now, (daysFilter * 2) - 1));
    const previousEnd = endOfDay(subDays(now, daysFilter));

    const currentVisits = visits.filter(v => 
      isWithinInterval(new Date(v.timestamp), { start: currentStart, end: endOfDay(now) })
    );
    const previousVisits = visits.filter(v => 
      isWithinInterval(new Date(v.timestamp), { start: previousStart, end: previousEnd })
    );

    const currentTotal = currentVisits.length;
    const previousTotal = previousVisits.length;

    const average = Math.round((currentTotal / daysFilter) * 10) / 10;

    // Calcular el día más activo basado en los datos del gráfico actual
    const topDayEntry = [...trafficData].sort((a, b) => b.count - a.count)[0];
    const topDayLabel = topDayEntry && topDayEntry.count > 0 ? topDayEntry.label : 'N/A';

    let growth = 0;
    if (previousTotal > 0) {
      growth = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
    } else if (currentTotal > 0) {
      growth = 100;
    }

    return { total: currentTotal, average, topDay: topDayLabel, growth };
  }, [visits, daysFilter, trafficData]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[500px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => { setIsBacking(true); router.push('/admin/analytics'); }}
            disabled={isBacking}
          >
            {isBacking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeft className="w-5 h-5" />}
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
              <History className="text-primary w-8 h-8" /> Historial de Tráfico
            </h1>
            <p className="text-muted-foreground">Análisis detallado de visitas por periodos de tiempo.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border shadow-sm">
          {[7, 30, 90].map((d) => (
            <Button 
              key={d}
              variant={daysFilter === d ? "default" : "ghost"}
              size="sm"
              className="rounded-xl px-4 min-w-[80px]"
              onClick={() => handlePeriodChange(d)}
              disabled={isChangingPeriod}
            >
              {isChangingPeriod && daysFilter === d ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                d === 7 ? 'Semana' : d === 30 ? 'Mes' : 'Trimestre'
              )}
            </Button>
          ))}
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Visualización de Periodo ({daysFilter} días)
          </CardTitle>
          <CardDescription>
            Mostrando datos desde el {format(subDays(new Date(), daysFilter - 1), "d 'de' MMMM", { locale: es })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-10">
          <div className="h-[400px] w-full relative">
            {isChangingPeriod && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#888'}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? "#29ABE2" : "#e2e8f0"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-3xl border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Total del Periodo</p>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Aperturas en los últimos {daysFilter} días</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Promedio Diario</p>
            <p className="text-3xl font-bold">
              {stats.average}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Visitas por día aproximadamente</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Día más activo</p>
            <p className="text-2xl font-bold">
              {stats.topDay}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Pico máximo de tráfico</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-md bg-white">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Crecimiento</p>
            <div className="flex items-center gap-2">
              <p className={`text-3xl font-bold ${stats.growth > 0 ? 'text-green-500' : stats.growth < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {stats.growth > 0 ? `+${stats.growth}%` : `${stats.growth}%`}
              </p>
              {stats.growth > 0 ? <TrendingUp className="text-green-500 w-5 h-5" /> : stats.growth < 0 ? <TrendingDown className="text-red-500 w-5 h-5" /> : <Minus className="text-gray-500 w-5 h-5" />}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Comparado con periodo anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
