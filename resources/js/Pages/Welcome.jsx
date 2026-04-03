import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
    ChartBarIcon, 
    ArrowRightIcon, 
    BanknotesIcon, 
    CheckBadgeIcon, 
    ClockIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Welcome({ metrics, monthlyStats, budgetStats, activities, auth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('performance');

    const brandColor = '#FBBF24';
    const chartBlue = '#3B82F6';
    const chartRed = '#EF4444';

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
            <Head title="Public Dashboard" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                                <ChartBarIcon className="w-6 h-6 text-slate-900" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 uppercase italic">
                                Dashboardkin <span className="text-amber-500">520</span>
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#stats" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Statistik</a>
                            <a href="#charts" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Grafik</a>
                            {auth.user ? (
                                <Link 
                                    href={route('dashboard')}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                                >
                                    Masuk Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href={route('login')} className="text-sm font-bold text-slate-900 uppercase tracking-widest">Login</Link>
                                    <Link 
                                        href={route('register')}
                                        className="px-6 py-3 bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-300 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        Daftar Sekarang <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                        <Link href={route('login')} className="block text-lg font-black text-slate-900 uppercase tracking-widest">Login</Link>
                        <Link href={route('register')} className="block text-lg font-black text-amber-500 uppercase tracking-widest">Register</Link>
                    </div>
                )}
            </nav>

            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
                {/* Hero Section */}
                <section className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-xs font-black uppercase tracking-[0.2em] mb-4 border border-amber-200/50">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Akses Publik Terbuka
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase italic underline decoration-amber-400 decoration-8 underline-offset-8">
                        Transparansi Kinerja <br />
                        <span className="text-amber-500 underline decoration-slate-900">Program 520</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-500 text-lg font-medium leading-relaxed">
                        Pantau realisasi anggaran dan capaian target kinerja secara real-time. Kami berkomitmen pada akuntabilitas dan efektivitas setiap program transformasi.
                    </p>
                    {!auth.user && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href={route('login')} className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[24px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all hover:scale-105">
                                Mulai Sekarang
                            </Link>
                            <Link href={route('register')} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-[24px] text-sm font-black uppercase tracking-[0.2em] hover:border-amber-400 transition-all hover:bg-amber-50">
                                Buat Akun Baru
                            </Link>
                        </div>
                    )}
                </section>

                {/* Stats Cards */}
                <section id="stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Disetujui', value: metrics.total_disetujui, icon: CheckBadgeIcon, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
                        { label: 'Menunggu Review', value: metrics.total_terkirim, icon: ClockIcon, color: 'bg- amber-50 text-amber-600', border: 'border-amber-100' },
                        { label: 'Total Alokasi', value: `Rp ${(metrics.anggaran.total_alokasi / 1000000).toFixed(1)}M`, icon: BanknotesIcon, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                        { label: 'Realisasi Anggara', value: `${metrics.anggaran.persentase}%`, icon: ChartBarIcon, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
                    ].map((stat, i) => (
                        <div key={i} className={`p-8 rounded-[36px] bg-white border ${stat.border} shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group`}>
                            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tight italic">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Charts Section */}
                <section id="charts" className="bg-white rounded-[48px] p-8 lg:p-16 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Performa & Serapan Global</h2>
                            <p className="text-slate-500 font-bold uppercase text-xs mt-2 tracking-widest opacity-60">Visualisasi data tahun berjalan {new Date().getFullYear()}</p>
                        </div>
                        <div className="flex bg-slate-50 p-2 rounded-full border border-slate-200 shadow-inner">
                            <button 
                                onClick={() => setActiveTab('performance')} 
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                Kinerja
                            </button>
                            <button 
                                onClick={() => setActiveTab('budget')} 
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'budget' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                Anggaran
                            </button>
                        </div>
                    </div>

                    <div className="h-[400px] lg:h-[500px]">
                        {activeTab === 'performance' ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyStats} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748B' }} />
                                    <YAxis hide domain={[0, 110]} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', background: '#0F172A', color: '#FFF', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', padding: '16px' }}
                                        itemStyle={{ color: '#FBBF24', fontSize: '14px', fontWeight: '900' }}
                                    />
                                    <Line type="monotone" dataKey="target" name="Target" stroke={brandColor} strokeWidth={6} dot={{ r: 8, fill: brandColor, stroke: '#FFF', strokeWidth: 3 }} animationDuration={1500} />
                                    <Line type="monotone" dataKey="realisasi" name="Realisasi" stroke="#94A3B8" strokeWidth={6} strokeDasharray="12 12" dot={{ r: 8, fill: '#94A3B8', stroke: '#FFF', strokeWidth: 3 }} animationDuration={1500} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={budgetStats} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartBlue} stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor={chartBlue} stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartRed} stopOpacity={0.5}/>
                                            <stop offset="95%" stopColor={chartRed} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748B' }} />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', background: '#0F172A', color: '#FFF', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', padding: '16px' }}
                                    />
                                    <Area type="monotone" dataKey="target" name="Alokasi Rp" stroke={chartBlue} strokeWidth={4} fillOpacity={1} fill="url(#colorBudget)" />
                                    <Area type="monotone" dataKey="realisasi" name="Serapan Rp" stroke={chartRed} strokeWidth={5} fillOpacity={1} fill="url(#colorReal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-slate-100">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Tahunan</p>
                            <p className="text-2xl font-black text-slate-900 italic">100%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capaian Saat Ini</p>
                            <p className="text-2xl font-black text-emerald-500 italic">82.4%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sisa Anggaran</p>
                            <p className="text-2xl font-black text-slate-900 italic">Rp {( (metrics.anggaran.total_alokasi - metrics.anggaran.total_realisasi) / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kualitas Data</p>
                            <p className="text-2xl font-black text-blue-500 italic">OPTIMAL</p>
                        </div>
                    </div>
                </section>

                {/* Footer and CTA */}
                <footer className="text-center py-20 border-t border-slate-200">
                    <div className="flex justify-center gap-8 mb-8">
                        <ChartBarIcon className="w-8 h-8 text-slate-300" />
                        <CheckBadgeIcon className="w-8 h-8 text-slate-300" />
                        <BanknotesIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] italic">
                        © {new Date().getFullYear()} Dashboardkin 520 - Kementerian Pendidikan & Kebudayaan
                    </p>
                </footer>
            </main>
        </div>
    );
}
