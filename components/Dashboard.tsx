import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { TrendingUp, Clock, Award, AlertCircle, BookOpen, ArrowUpRight } from 'lucide-react';
import { Student } from '../types';

interface DashboardProps {
  user: Student;
  onChangeView: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onChangeView }) => {
  
  // Mock Data for Charts
  const progressData = [
    { month: 'Sep', math: 45, phys: 40, fr: 50 },
    { month: 'Oct', math: 52, phys: 48, fr: 55 },
    { month: 'Nov', math: 58, phys: 55, fr: 58 },
    { month: 'Dec', math: 65, phys: 62, fr: 60 },
    { month: 'Jan', math: 72, phys: 68, fr: 65 },
  ];

  const competencyData = [
    { subject: 'Algèbre', A: 85, fullMark: 100 },
    { subject: 'Géométrie', A: 65, fullMark: 100 },
    { subject: 'Mécanique', A: 70, fullMark: 100 },
    { subject: 'Électricité', A: 45, fullMark: 100 },
    { subject: 'Chimie Org.', A: 80, fullMark: 100 },
    { subject: 'Probabilités', A: 55, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Bonjour, {user.name} 👋</h1>
          <p className="opacity-90 max-w-xl">
            Tu as progressé de <span className="font-bold text-yellow-300">+12%</span> cette semaine. 
            Ton évaluation en Physique (Électricité) est recommandée aujourd'hui.
          </p>
          <button 
            onClick={() => onChangeView('assessment')}
            className="mt-4 px-5 py-2 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-green-50 transition-colors inline-flex items-center gap-2"
          >
            Lancer une évaluation <ArrowUpRight size={18} />
          </button>
        </div>
        {/* Background Decor */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Score Global', value: '14.5/20', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Exercices', value: '124', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Temps d\'étude', value: '18h 30m', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Points Faibles', value: '2', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-600" />
              Évolution des Notes
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-md px-2 py-1 outline-none">
              <option>Ce Semestre</option>
              <option>Cette Année</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPhys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="math" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorMath)" name="Maths" />
                <Area type="monotone" dataKey="phys" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPhys)" name="Physique" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Compétences</h3>
          <p className="text-sm text-slate-500 mb-4">Analyse de tes points forts et faibles</p>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Niveau" dataKey="A" stroke="#E8112D" strokeWidth={2} fill="#E8112D" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recommended Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">À revoir (Urgent)</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-rose-50 border border-rose-100">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-rose-600 font-bold border border-rose-100">45%</div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Lois de Kirchhoff (Électricité)</h4>
                        <p className="text-xs text-rose-600">Difficulté détectée hier</p>
                    </div>
                    <button className="ml-auto px-3 py-1 text-xs font-semibold bg-white text-slate-700 rounded border border-slate-200 shadow-sm hover:bg-slate-50">Réviser</button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-orange-600 font-bold border border-orange-100">55%</div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Probabilités Conditionnelles</h4>
                        <p className="text-xs text-orange-600">Amélioration nécessaire</p>
                    </div>
                    <button className="ml-auto px-3 py-1 text-xs font-semibold bg-white text-slate-700 rounded border border-slate-200 shadow-sm hover:bg-slate-50">Réviser</button>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-sm text-white flex flex-col justify-between">
             <div>
                 <div className="flex items-center gap-2 mb-2">
                     <div className="px-2 py-0.5 bg-yellow-400 text-slate-900 text-xs font-bold rounded">PREMIUM</div>
                     <span className="text-slate-300 text-sm">Mode Expert</span>
                 </div>
                 <h3 className="text-xl font-bold mb-2">Débloque l'Analyse Prédictive</h3>
                 <p className="text-slate-300 text-sm mb-6">
                     Notre IA prédit ta note au BAC avec 85% de précision et génère un plan d'action personnalisé sur 30 jours.
                 </p>
             </div>
             <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                 Voir les offres (Dès 5000 FCFA/mois)
             </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;