import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HomeIcon, BriefcaseIcon, CurrencyDollarIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon, ListBulletIcon, CheckCircleIcon, InformationCircleIcon, ChatBubbleBottomCenterTextIcon, LightBulbIcon, BanknotesIcon, ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/solid';

export default function Dashboard({ auth, activities = [], lateTasks = [], invalidBudgets = [], monthlyStats = [], budgetStats = [], selectedYear = 2026, metrics = { total_terkirim: 0, total_disetujui: 0, total_ditolak: 0, anggaran: { total_alokasi: 0, total_realisasi: 0, persentase: 0 } } }) {
    
    const [activeMainTab, setActiveMainTab] = useState('Kinerja');
    const [activeSubTab, setActiveSubTab] = useState('Rincian Task');

    const brandColor = '#FBBF24';
    const realisasiColor = '#9CA3AF';
    const budgetColor = '#3B82F6';

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Head title="Dashboard Transformasi Organisasi" />

            <header className="bg-amber-400 h-16 sticky top-0 z-50 shadow-md border-b border-amber-500">
                <div className="max-w-screen-2xl mx-auto px-8 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <div className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Transformasi Organisasi</div>
                        <nav className="flex items-center space-x-3">
                             {[
                                { name: 'Home', href: route('dashboard'), icon: HomeIcon, active: true },
                                { name: 'Project', href: route('reports.index'), icon: BriefcaseIcon },
                                { name: 'Anggaran', href: route('anggaran'), icon: CurrencyDollarIcon },
                                { name: 'Users', href: route('users.index'), icon: UserGroupIcon }
                             ].map(m => (
                                <Link key={m.name} href={m.href} className={"flex items-center space-x-2 px-6 py-2.5 rounded-2xl transition-all " + (m.active ? 'bg-blue-900 text-white shadow-lg border border-blue-950' : 'hover:bg-amber-500 hover:font-bold text-blue-900')}>
                                    <m.icon className={"h-5 w-5 " + (m.active ? 'text-amber-400' : 'text-blue-900')} /> 
                                    <span className="uppercase text-[11px] font-black tracking-widest">{m.name}</span>
                                </Link>
                             ))}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-screen-2xl mx-auto p-10 space-y-12">

                {/* Performance & Budget Chart Toggle Section */}
                <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
                    <div className="flex space-x-6 mb-16 bg-gray-100 p-2.5 rounded-full shadow-inner border border-gray-200 z-10">
                        <button onClick={() => setActiveMainTab('Kinerja')} className={"px-20 py-5 rounded-full text-xs font-black transition-all " + (activeMainTab === 'Kinerja' ? 'bg-amber-400 text-gray-900 shadow-2xl' : 'text-gray-400 hover:text-gray-600')}>KINERJA</button>
                        <button onClick={() => setActiveMainTab('Anggaran')} className={"px-20 py-5 rounded-full text-xs font-black transition-all " + (activeMainTab === 'Anggaran' ? 'bg-blue-900 text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-gray-600')}>ANGGARAN</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 w-full px-6">
                        <div className="lg:col-span-3">
                             <h3 className="text-4xl font-black text-blue-900 mb-14 text-center uppercase tracking-widest italic decoration-amber-400 decoration-8 underline-offset-[16px] underline">
                                 {activeMainTab === 'Kinerja' ? 'Target dan Capaian Kinerja' : 'Analisis Alokasi vs Penyerapan Anggaran'}
                             </h3>

                             <div className="flex justify-center space-x-20 text-[12px] mb-12 font-black text-gray-400 italic bg-white py-4 rounded-full w-max mx-auto px-12 shadow-sm border border-gray-100 uppercase tracking-[0.2em]">
                                 <div className="flex items-center">
                                     <div className={"w-6 h-6 rounded-full mr-5 shadow-inner border-2 border-white " + (activeMainTab === 'Kinerja' ? 'bg-gray-300' : 'bg-blue-300')}></div> 
                                     {activeMainTab === 'Kinerja' ? 'Realisasi (%)' : 'Realisasi (Rp)'}
                                 </div>
                                 <div className="flex items-center">
                                     <div className={"w-6 h-6 rounded-full mr-5 shadow-inner border-2 border-white " + (activeMainTab === 'Kinerja' ? 'bg-amber-400' : 'bg-blue-900')}></div> 
                                     {activeMainTab === 'Kinerja' ? 'Target (%)' : 'Alokasi (Rp)'}
                                 </div>
                             </div>

                             <div className="h-[500px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {activeMainTab === 'Kinerja' ? (
                                        <LineChart data={monthlyStats} margin={{ top: 20, right: 40, left: 10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: '#6B7280' }} />
                                            <YAxis hide domain={[0, 110]} />
                                            <Tooltip cursor={{ stroke: brandColor, strokeWidth: 4 }} contentStyle={{ borderRadius: '40px', border: 'none', background: '#FFF font-weight: bold', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)' }} />
                                            <Line type="stepAfter" dataKey="target" stroke={brandColor} strokeWidth={8} dot={{ r: 10, fill: brandColor, stroke: '#FFF', strokeWidth: 4 }} label={{ position: 'top', fontSize: 14, fill: brandColor, fontWeight: 900, formatter: (v) => v > 0 ? v + '%' : '' }} />
                                            <Line type="monotone" dataKey="realisasi" stroke={realisasiColor} strokeWidth={8} dot={{ r: 10, fill: realisasiColor, stroke: '#FFF', strokeWidth: 4 }} label={{ position: 'bottom', fontSize: 14, fill: realisasiColor, fontWeight: 900, formatter: (v) => v > 0 ? v + '%' : '' }} />
                                        </LineChart>
                                    ) : (
                                        <AreaChart data={budgetStats} margin={{ top: 20, right: 40, left: 50, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: '#6B7280' }} />
                                            <YAxis tickFormatter={(v) => `Rp ${v/1000000}jt`} tick={{ fontSize: 10, fontWeight: 800, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '40px', border: 'none', background: '#FFF font-weight: bold', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)' }} />
                                            <Area type="monotone" dataKey="target" stroke="#1E3A8A" fillOpacity={1} fill="url(#colorTarget)" strokeWidth={4} />
                                            <Area type="monotone" dataKey="realisasi" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReal)" strokeWidth={4} />
                                            <defs>
                                                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                             </div>
                        </div>

                        <div className={"rounded-[50px] border border-gray-100 flex flex-col h-[600px] shadow-sm overflow-hidden border-t-[12px] " + (activeMainTab === 'Kinerja' ? 'bg-gray-50 border-t-amber-400' : 'bg-blue-50/20 border-t-blue-900')}>
                            <div className={"p-8 flex text-[11px] font-black uppercase italic border-b border-gray-200 tracking-[0.3em] " + (activeMainTab === 'Kinerja' ? 'bg-amber-100/40 text-blue-900/50' : 'bg-blue-900/10 text-blue-900')}>
                                <div className="w-24 px-2">{activeMainTab === 'Kinerja' ? 'KODETP' : 'RKKL ID'}</div>
                                <div className="flex-1 px-2 text-center uppercase tracking-tighter">{activeMainTab === 'Kinerja' ? 'OBJEKTIF PROGRAM' : 'NOMENKLATUR ANGGARAN'}</div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white">
                                {activeMainTab === 'Kinerja' ? (
                                    activities?.map(act => (
                                        <div key={act.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-start group hover:border-amber-400 hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2">
                                            <span className="w-16 flex-shrink-0 text-[12px] font-mono text-amber-500 pt-1 leading-none font-black italic">'{act.kode_pmo}</span>
                                            <p className="flex-1 text-[14px] font-black text-gray-800 leading-snug group-hover:text-blue-900 uppercase tracking-tighter">{act.nama_kegiatan_turunan}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="space-y-8">
                                        <div className="bg-blue-900 p-8 rounded-[40px] text-white shadow-[0_30px_60px_-15px_rgba(30,58,138,0.4)]">
                                            <p className="text-[10px] font-black tracking-widest uppercase opacity-60 mb-3">Total Anggaran Alokasi</p>
                                            <p className="text-3xl font-black italic">{formatCurrency(metrics.anggaran.total_alokasi)}</p>
                                            <div className="mt-8 flex items-end justify-between">
                                                <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-400" style={{ width: metrics.anggaran.persentase + '%' }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-amber-400">{metrics.anggaran.persentase}% Terserap</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center">
                                                <ArrowUpRightIcon className="h-6 w-6 text-green-500 mb-3" />
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selesai</p>
                                                <p className="text-lg font-black text-blue-900">{metrics.total_disetujui}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center">
                                                <ClockIcon className="h-6 w-6 text-amber-500 mb-3" />
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pending</p>
                                                <p className="text-lg font-black text-blue-900">{metrics.total_terkirim}</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-[0.4em] italic pt-4">Integritas Data Keuangan 2026</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-navigation Tabs */}
                <div className="bg-white p-14 rounded-[50px] shadow-sm border border-gray-100 flex flex-col mt-14 bg-gradient-to-b from-white to-gray-50/20">
                    <div className="flex space-x-6 mb-20 bg-gray-200/50 p-3 rounded-full w-max mx-auto shadow-inner border border-gray-100 overflow-x-auto max-w-full">
                        {['Rincian Task', 'Milestone', 'Task Terlambat', 'Risiko & Isu', 'Ang Invalid'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setActiveSubTab(t)} 
                                className={"px-14 py-6 rounded-full text-[13px] font-black transition-all transform tracking-[0.2em] " + (activeSubTab === t ? 'bg-blue-900 text-white shadow-[0_30px_60px_-10px_rgba(30,58,138,0.6)] scale-110 z-10' : 'text-gray-400 hover:text-gray-900 hover:bg-white/80')}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[700px]">
                        
                        {activeSubTab === 'Rincian Task' && (
                             <div className="overflow-x-auto rounded-[50px] border border-gray-100 shadow-2xl bg-white overflow-hidden">
                                 <table className="w-full text-left border-collapse">
                                     <thead>
                                         <tr className="bg-blue-900 text-white font-black uppercase text-[12px] border-b border-blue-950 tracking-[0.3em] italic">
                                             <th className="px-10 py-8 border-r border-blue-950/30">PKODETP</th>
                                             <th className="px-10 py-8 border-r border-blue-950/30">AKTIVITAS & INDIKATOR UTAMA</th>
                                             <th className="px-10 py-8 border-r border-blue-950/30 text-center">JADWAL RENCANA</th>
                                             <th className="px-10 py-8 border-r border-blue-950/30 text-center">JADWAL REALISA</th>
                                             <th className="px-10 py-8 text-center">CAPAIAN</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {activities?.map(act => (
                                             <tr key={act.id} className="border-b border-gray-50 hover:bg-amber-50/50 transition-all">
                                                 <td className="px-10 py-10 font-mono font-black text-blue-900 border-r border-gray-50 text-[12px] italic">'{act.kode_pmo}</td>
                                                 <td className="px-10 py-10 border-r border-gray-50">
                                                     <div className="space-y-3">
                                                         <p className="font-black text-gray-800 text-[16px] mb-2 uppercase leading-snug tracking-tighter italic">{act.nama_kegiatan_turunan}</p>
                                                         <div className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-amber-400 pl-4 bg-gray-50/50 py-2 rounded-r-xl">
                                                             HASIL: <span className="ml-2 text-blue-900">{act.hasil_kegiatan || 'DOKUMENTASI PROGRAM'}</span>
                                                         </div>
                                                     </div>
                                                 </td>
                                                 <td className="px-10 py-10 border-r border-gray-50 text-center">
                                                     <div className="inline-flex flex-col font-black text-[12px] text-gray-500 px-6 py-3 bg-gray-50 rounded-[24px] border border-gray-100 shadow-sm">
                                                         <span>{act.rencana_start_date}</span>
                                                         <span className="text-[10px] text-gray-300 font-black my-1 border-y border-gray-100 py-1">SD</span>
                                                         <span>{act.rencana_end_date}</span>
                                                     </div>
                                                 </td>
                                                 <td className="px-10 py-10 border-r border-gray-50 text-center">
                                                     <div className="inline-flex flex-col font-black text-[12px] text-blue-900 px-6 py-3 bg-blue-50/40 rounded-[24px] border border-blue-100/50 shadow-sm">
                                                         <span>{act.realisasi_start_date || '-'}</span>
                                                         <span className="text-[10px] text-blue-300 font-black my-1 border-y border-blue-100/20 py-1">SD</span>
                                                         <span>{act.realisasi_end_date || '-'}</span>
                                                     </div>
                                                 </td>
                                                 <td className="px-10 py-10 text-center align-middle">
                                                      <span className={"inline-block px-8 py-3.5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl border-2 border-white transform hover:scale-110 transition-transform " + (act.status_akhir === 'Selesai' || act.status_akhir === 'Sudah' ? 'bg-green-600 text-white' : 'bg-amber-400 text-gray-900')}>
                                                         {act.status_akhir || 'DALAM PROSES'}
                                                      </span>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                        )}

                        {activeSubTab === 'Milestone' && (
                             <div className="overflow-x-auto rounded-[50px] border border-gray-100 shadow-2xl bg-white overflow-hidden">
                                 <div className="flex min-w-max bg-blue-900 uppercase text-[11px] font-black text-white/50 tracking-[0.3em] italic border-b border-blue-950">
                                     <div className="w-64 flex-shrink-0 p-8 border-r border-blue-950/40 text-white">PKODETP MGMT</div>
                                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                         <div key={m} className="w-32 border-r border-blue-950/20 text-center p-8 text-white">{m.toUpperCase()} 2026</div>
                                     ))}
                                 </div>
                                 <div className="space-y-4 p-8 min-w-max bg-gray-50/20">
                                     {activities?.map((act) => {
                                         let startMonth = 1; let endMonth = 12;
                                         if (act.rencana_start_date) startMonth = new Date(act.rencana_start_date).getMonth() + 1;
                                         if (act.rencana_end_date) endMonth = new Date(act.rencana_end_date).getMonth() + 1;
                                         const cellWidth = 128; const marginLeft = (startMonth - 1) * cellWidth; const width = ((endMonth - startMonth) + 1) * cellWidth;
                                         
                                         return (
                                             <div key={act.id} className="flex h-16 items-center border-b border-gray-100 last:border-0 group hover:bg-white transition-all rounded-[32px] p-2 bg-white/50">
                                                 <div className="w-64 flex-shrink-0 text-[14px] font-black px-8 truncate text-blue-900 italic tracking-tighter">'{act.kode_pmo}</div>
                                                 <div className="flex-1 relative h-10 px-4">
                                                     <div 
                                                        className="absolute h-8 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl top-1 border-4 border-white transform hover:scale-y-125 transition-all cursor-pointer group-hover:from-blue-800 group-hover:to-blue-600" 
                                                        style={{ left: marginLeft + 'px', width: width + 'px' }}
                                                     >
                                                        <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                                                     </div>
                                                 </div>
                                             </div>
                                         );
                                     })}
                                 </div>
                             </div>
                        )}

                        {activeSubTab === 'Task Terlambat' && (
                             <div className="rounded-[50px] border border-red-100 bg-white overflow-hidden shadow-2xl border-t-[12px] border-t-red-600">
                                 <table className="w-full text-left border-collapse">
                                     <thead>
                                         <tr className="bg-red-600 text-white uppercase font-black text-[13px] border-b border-red-700 tracking-[0.3em] italic">
                                             <th className="px-12 py-10">PKODETP</th>
                                             <th className="px-12 py-10">ANALISA KETERLAMBATAN KRITIS</th>
                                             <th className="px-12 py-10 text-center">DEADLINE SISTEM</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {lateTasks?.length > 0 ? lateTasks.map(task => (
                                             <tr key={task.id} className="border-b border-red-50 hover:bg-red-50/50 transition-all">
                                                 <td className="px-12 py-12 font-mono font-black text-red-600 text-[16px] italic">'{task.kode_pmo}</td>
                                                 <td className="px-12 py-12">
                                                     <p className="font-black text-gray-900 text-[20px] mb-4 uppercase tracking-tighter leading-tight italic">{task.nama_kegiatan_turunan}</p>
                                                     <div className="flex items-center">
                                                         <span className="text-[11px] text-white bg-red-600 px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">Status: OVERDUE</span>
                                                         <span className="ml-6 text-[10px] text-gray-400 font-bold uppercase italic tracking-widest border-l-2 border-red-200 pl-4">Audit diperlukan segera</span>
                                                     </div>
                                                 </td>
                                                 <td className="px-12 py-12 text-center align-middle">
                                                     <div className="inline-block bg-white text-red-600 border-4 border-red-600 px-8 py-4 rounded-[32px] text-[14px] font-black shadow-2xl uppercase tracking-widest transform -rotate-2">
                                                         {task.rencana_end_date}
                                                     </div>
                                                 </td>
                                             </tr>
                                         )) : (
                                             <tr><td colSpan="3" className="text-center py-52 text-gray-300 font-black uppercase tracking-[0.8em] italic opacity-30 animate-pulse">Zero Delay: Seluruh Unit Beroperasi Optimal</td></tr>
                                         )}
                                     </tbody>
                                 </table>
                             </div>
                        )}

                        {activeSubTab === 'Risiko & Isu' && (
                             <div className="rounded-[50px] border border-amber-100 bg-white overflow-hidden shadow-2xl border-t-[12px] border-t-amber-500">
                                  <table className="w-full text-left border-collapse">
                                      <thead>
                                          <tr className="bg-amber-400 text-gray-900 uppercase font-black text-[13px] border-b border-amber-500 tracking-[0.3em] italic">
                                              <th className="px-12 py-10 w-48 border-r border-amber-500/30">PKODETP</th>
                                              <th className="px-12 py-10 border-r border-amber-500/30">LOG RISIKO & ISU STRATEGIS</th>
                                              <th className="px-12 py-10">TINDAK LANJUT MITIGASI (SOP)</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {activities?.filter(a => a.resiko_isu).length > 0 ? activities.filter(a => a.resiko_isu).map(act => (
                                              <tr key={act.id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-all">
                                                  <td className="px-12 py-12 font-mono font-black text-amber-700 align-top text-base italic">'{act.kode_pmo}</td>
                                                  <td className="px-12 py-12 align-top border-r border-amber-50">
                                                      <div className="flex items-start">
                                                          <div className="bg-red-600 p-4 rounded-[24px] mr-8 mt-1 shadow-2xl border-4 border-white"><ExclamationTriangleIcon className="h-6 w-6 text-white" /></div>
                                                          <div>
                                                              <p className="font-black text-blue-950 text-[18px] mb-4 uppercase leading-none tracking-tighter italic drop-shadow-sm">{act.nama_kegiatan_turunan}</p>
                                                              <p className="text-gray-600 text-[14px] leading-relaxed font-bold italic border-l-8 border-red-600 pl-6 py-2 bg-red-50/30 rounded-r-2xl shadow-inner">{act.resiko_isu}</p>
                                                          </div>
                                                      </div>
                                                  </td>
                                                  <td className="px-12 py-12 align-top">
                                                       <div className="flex items-start">
                                                          <div className="bg-green-600 p-4 rounded-[24px] mr-8 mt-1 shadow-2xl border-4 border-white"><LightBulbIcon className="h-6 w-6 text-white" /></div>
                                                          <div>
                                                              <p className="text-gray-900 text-[16px] leading-relaxed font-black uppercase tracking-tight italic mb-4">{act.solusi}</p>
                                                              <div className="mt-8 flex items-center bg-green-50 p-4 rounded-full shadow-inner border border-green-100">
                                                                  <span className="text-[11px] text-white bg-green-600 px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-xl">EKSEKUSI MITIGASI</span>
                                                                  <div className="ml-8 h-2 flex-1 bg-white rounded-full overflow-hidden border border-green-200">
                                                                      <div className="w-[90%] h-full bg-green-500 animate-pulse"></div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </td>
                                              </tr>
                                          )) : (
                                              <tr><td colSpan="3" className="text-center py-52 text-gray-300 font-black uppercase tracking-[0.8em] italic opacity-30 animate-pulse">Analisis Sistem: Tidak Mendeteksi Risiko Kritis</td></tr>
                                          )}
                                      </tbody>
                                  </table>
                             </div>
                        )}

                        {activeSubTab === 'Ang Invalid' && (
                             <div className="rounded-[50px] border border-red-100 bg-white overflow-hidden shadow-2xl border-t-[12px] border-t-red-600">
                                  <table className="w-full text-left border-collapse">
                                      <thead>
                                          <tr className="bg-red-600 text-white uppercase font-black text-[13px] border-b border-red-700 tracking-[0.3em] italic">
                                              <th className="px-12 py-10 w-48">PKODETP</th>
                                              <th className="px-12 py-10">KOREKSI DATA ANGGARAN (FRAUD DETECTION)</th>
                                              <th className="px-12 py-10 text-center">PLAFON VS REALISASI</th>
                                              <th className="px-12 py-10 text-center">STATUS INTEGRITAS</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {invalidBudgets?.length > 0 ? invalidBudgets.map(act => {
                                              const alokasi = act.budget ? floatval(act.budget.anggaran_alokasi) : 0;
                                              const realisasi = act.budget ? floatval(act.budget.anggaran_realisasi) : 0;
                                              const isOver = realisasi > alokasi && alokasi > 0;
                                              const isMissing = alokasi <= 0;

                                              return (
                                                  <tr key={act.id} className="border-b border-red-50 hover:bg-red-50/50 transition-all">
                                                      <td className="px-12 py-12 font-mono font-black text-red-600 align-top text-base italic">'{act.kode_pmo}</td>
                                                      <td className="px-12 py-12 align-top">
                                                          <p className="font-black text-blue-950 text-[18px] mb-5 uppercase leading-none tracking-tighter italic drop-shadow-sm">{act.nama_kegiatan_turunan}</p>
                                                          <div className="flex items-center text-[11px] font-black text-red-400 uppercase tracking-[0.3em] mt-4 border-l-4 border-red-600 pl-6 bg-red-50/50 py-3 rounded-r-2xl">
                                                              <BanknotesIcon className="h-5 w-5 mr-4 text-red-600" /> KODE BUDGET: <span className="ml-3 text-red-700 font-black bg-white px-4 py-1 rounded-full shadow-sm">{act.kode_rrkl || 'EKSKLUSI'}</span>
                                                          </div>
                                                      </td>
                                                      <td className="px-12 py-12 align-top text-center">
                                                           <div className="inline-flex flex-col space-y-4">
                                                               <span className="text-[12px] font-black text-gray-400 bg-gray-50 px-6 py-2 rounded-full shadow-inner border border-gray-100 italic">PLAFON: Rp {new Intl.NumberFormat('id-ID').format(alokasi)}</span>
                                                               <span className="text-[14px] font-black text-white bg-red-600 px-8 py-4 rounded-[28px] shadow-[0_15px_35px_-10px_rgba(220,38,38,0.6)] border-4 border-white/30 transform hover:scale-110 transition-transform">REALISASI: Rp {new Intl.NumberFormat('id-ID').format(realisasi)}</span>
                                                           </div>
                                                      </td>
                                                      <td className="px-12 py-12 align-top text-center">
                                                           <div className="flex flex-col items-center space-y-5">
                                                               <div className="bg-white text-red-600 border-[6px] border-red-600 px-8 py-5 rounded-[40px] shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                                                    <span className="text-[13px] font-black uppercase tracking-[0.2em]">{isOver ? 'OVER BUDGET' : (isMissing ? 'ALOKASI NIL' : 'INVALID')}</span>
                                                               </div>
                                                               <p className="text-[11px] text-red-500 font-black uppercase italic mt-6 animate-bounce underline decoration-double underline-offset-8 decoration-red-600">Action Required: Revisi Anggaran!</p>
                                                           </div>
                                                      </td>
                                                  </tr>
                                              );
                                          }) : (
                                              <tr><td colSpan="4" className="text-center py-52 text-gray-300 font-black uppercase tracking-[0.8em] italic opacity-30 animate-pulse">Data Integritas Anggaran Terpantau Steril</td></tr>
                                          )}
                                      </tbody>
                                  </table>
                             </div>
                        )}

                    </div>
                </div>

            </main>
        </div>
    );
}

function floatval(val) {
    if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0;
    return parseFloat(val) || 0;
}
