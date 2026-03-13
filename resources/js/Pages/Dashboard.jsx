import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HomeIcon, BriefcaseIcon, FolderOpenIcon, CurrencyDollarIcon, UserGroupIcon, DocumentTextIcon, ChartBarIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon, ListBulletIcon } from '@heroicons/react/24/solid';

export default function Dashboard({ auth, activities = [], monthlyStats = [], selectedYear = new Date().getFullYear() }) {
    
    const [activeMainTab, setActiveMainTab] = useState('Kinerja');
    const [activeSubTab, setActiveSubTab] = useState('Milestone');

    const brandColor = '#FBBF24';
    const realisasiColor = '#9CA3AF';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Dashboard Transformasi Organisasi" />

            <header className="bg-amber-400 text-gray-800 shadow-sm sticky top-0 z-50">
                <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="text-xl font-bold tracking-tight">Transformasi Organisasi</div>
                        <nav className="flex items-center space-x-1 text-sm font-medium">
                            <Link href={route('dashboard')} className="flex items-center space-x-1 px-3 py-2 rounded-md transition-colors bg-amber-500 font-bold hover:bg-amber-600">
                                <HomeIcon className="h-4 w-4" /> <span>Home</span>
                            </Link>
                            <Link href={route('reports.index')} className="flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-amber-500">
                                <BriefcaseIcon className="h-4 w-4" /> <span>Project</span>
                            </Link>
                            <Link href={route('anggaran')} className="flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-amber-500">
                                <CurrencyDollarIcon className="h-4 w-4" /> <span>Anggaran</span>
                            </Link>
                            {auth.user && auth.user.roles && auth.user.roles.includes('superadmin') && (
                                <Link href={route('users.index')} className="flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-amber-500">
                                    <UserGroupIcon className="h-4 w-4" /> <span>Users</span>
                                </Link>
                            )}
                        </nav>
                    </div>
                    <div className="text-sm font-medium flex items-center space-x-4">
                        <span>{auth.user.email}</span>
                        <Link href={route('logout')} method="post" as="button" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md shadow-sm transition-colors text-xs font-bold uppercase tracking-wider">
                            Logout
                        </Link>
                        <div className="flex items-center space-x-2 bg-amber-500 px-3 py-1 rounded">
                            <label htmlFor="yearFilter" className="text-white font-medium">Tahun:</label>
                            <select 
                                id="yearFilter" 
                                value={selectedYear}
                                onChange={(e) => {
                                    window.history.replaceState(null, '', '?year=' + e.target.value);
                                    window.location.reload(); 
                                }}
                                className="bg-transparent text-white border-none font-bold focus:ring-0 cursor-pointer outline-none"
                            >
                                <option className="text-gray-800" value="2024">2024</option>
                                <option className="text-gray-800" value="2025">2025</option>
                                <option className="text-gray-800" value="2026">2026</option>
                                <option className="text-gray-800" value="2027">2027</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col items-center">
                        <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-full w-max">
                            <button 
                                onClick={() => setActiveMainTab('Kinerja')}
                                className={"px-6 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-colors " + (activeMainTab === 'Kinerja' ? 'bg-amber-400 text-gray-900' : 'text-gray-600 hover:bg-gray-200')}
                            >
                                Kinerja
                            </button>
                            <button 
                                onClick={() => setActiveMainTab('Anggaran')}
                                className={"px-6 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-colors " + (activeMainTab === 'Anggaran' ? 'bg-amber-400 text-gray-900' : 'text-gray-600 hover:bg-gray-200')}
                            >
                                Anggaran
                            </button>
                        </div>

                        {activeMainTab === 'Kinerja' ? (
                            <>
                                <h3 className="text-xl font-bold text-blue-800 mb-2">Target dan Capaian Kinerja</h3>
                                <div className="w-full h-80 mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                            <YAxis hide domain={[0, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Legend verticalAlign="top" height={36} iconType="circle" formatter={(value) => <span className="text-gray-600 text-sm font-medium mr-4">{value}</span>} />
                                            <Line type="monotone" dataKey="target" name="Target" stroke={brandColor} strokeWidth={2} dot={{ r: 4, fill: brandColor, strokeWidth: 0 }} activeDot={{ r: 6 }} label={{ position: 'top', fill: brandColor, fontSize: 11, formatter: (val) => val > 0 ? val + '%' : '' }} />
                                            <Line type="monotone" dataKey="realisasi" name="Realisasi" stroke={realisasiColor} strokeWidth={2} dot={{ r: 4, fill: realisasiColor, strokeWidth: 0 }} label={{ position: 'bottom', fill: realisasiColor, fontSize: 11, formatter: (val) => val > 0 ? val + '%' : '' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-80 text-gray-400 w-full animate-pulse">
                                <CurrencyDollarIcon className="h-16 w-16 mb-4 opacity-50 text-amber-500" />
                                <h3 className="text-lg font-bold text-gray-600 mb-2">Modul Anggaran</h3>
                                <p className="text-sm">Fitur visualisasi serapan anggaran sedang dalam tahap pengembangan.</p>
                            </div>
                        )}
                    </div>

                    <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex flex-col h-96">
                        <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex text-sm font-semibold text-gray-700">
                            <div className="w-24">KodeTP</div>
                            <div className="flex-1">Objektif</div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {activities?.length > 0 ? activities.map(act => (
                                <div key={act.id} className="bg-white border text-xs p-2 rounded shadow-sm flex items-start">
                                    <div className="w-20 font-mono text-gray-500 mt-1 px-1">[- {act.kode_pmo}]</div>
                                    <div className="flex-1 text-gray-700 space-y-1">
                                        <p className="font-semibold">{act.nama_kegiatan_turunan}</p>
                                        {act.detail_aktivitas && <p className="text-gray-500">{act.detail_aktivitas}</p>}
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-gray-400 text-sm">Belum ada data kegiatan untuk tahun ini.</div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col mt-6 h-96">
                    <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-full w-max mx-auto">
                        <button onClick={() => setActiveSubTab('Rincian Task')} className={"px-4 py-1.5 rounded-full text-sm font-medium transition-colors " + (activeSubTab === 'Rincian Task' ? 'bg-amber-400 text-gray-900 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200')}>Rincian Task</button>
                        <button onClick={() => setActiveSubTab('Milestone')} className={"px-6 py-1.5 rounded-full text-sm font-medium transition-colors " + (activeSubTab === 'Milestone' ? 'bg-amber-400 text-gray-900 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200')}>Milestone</button>
                        <button onClick={() => setActiveSubTab('Task Terlambat')} className={"px-4 py-1.5 rounded-full text-sm font-medium transition-colors " + (activeSubTab === 'Task Terlambat' ? 'bg-amber-400 text-gray-900 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200')}>Task Terlambat</button>
                        <button onClick={() => setActiveSubTab('Risiko & Isu')} className={"px-4 py-1.5 rounded-full text-sm font-medium transition-colors " + (activeSubTab === 'Risiko & Isu' ? 'bg-amber-400 text-gray-900 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200')}>Risiko & Isu</button>
                        <button onClick={() => setActiveSubTab('Ang Invalid')} className={"px-4 py-1.5 rounded-full text-sm font-medium transition-colors " + (activeSubTab === 'Ang Invalid' ? 'bg-amber-400 text-gray-900 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200')}>Ang Invalid</button>
                    </div>

                    {activeSubTab === 'Milestone' && (
                        <>
                            <div className="w-full flex justify-center mb-6 space-x-6 text-sm">
                                <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-2"></div> Milestones</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2 transform rotate-45"></div> Selesai</div>
                            </div>

                            <div className="overflow-x-auto border-t border-l border-b border-gray-200 relative pb-10" style={{ minWidth: '800px' }}>
                                
                                <div className="flex w-full min-w-max border-b border-gray-200 bg-gray-50 text-xs text-gray-500 font-semibold sticky top-0">
                                    <div className="w-32 flex-shrink-0 p-2 border-r bg-gray-50"></div>
                                    {['Jan ' + selectedYear, 'Feb ' + selectedYear, 'Mar ' + selectedYear, 'Apr ' + selectedYear, 'May ' + selectedYear, 'Jun ' + selectedYear, 'Jul ' + selectedYear, 'Aug ' + selectedYear, 'Sep ' + selectedYear, 'Oct ' + selectedYear, 'Nov ' + selectedYear, 'Dec ' + selectedYear].map(m => (
                                        <div key={m} className="p-2 w-24 border-r text-center flex-shrink-0">{m}</div>
                                    ))}
                                </div>

                                <div className="space-y-1 py-1 px-1">
                                    {activities?.map((act) => {
                                        let startMonth = 1; let endMonth = 12; let realEndMonth = null;
                                        if (act.rencana_start_date) startMonth = new Date(act.rencana_start_date).getMonth() + 1;
                                        if (act.rencana_end_date) endMonth = new Date(act.rencana_end_date).getMonth() + 1;
                                        if (act.realisasi_end_date) realEndMonth = new Date(act.realisasi_end_date).getMonth() + 1;
                                        
                                        const cellWidth = 96; const marginLeft = (startMonth - 1) * cellWidth; const width = ((endMonth - startMonth) + 1) * cellWidth;
                                        const isFinished = act.is_target_finished ? true : false;
                                        const bgClass = isFinished ? "bg-blue-400 opacity-80" : "bg-blue-500";
                                        const combinedClass = "absolute h-5 rounded-full flex items-center px-2 group cursor-pointer transition-all " + bgClass;

                                        return (
                                            <div key={act.id} className="flex w-full min-w-max items-center h-8">
                                                <div className="w-32 flex-shrink-0 text-xs font-semibold px-2 truncate" title={act.kode_pmo}>{act.kode_pmo}</div>
                                                <div className="flex-1 relative">
                                                    <div className={combinedClass} style={{ left: marginLeft + 'px', width: width + 'px' }}>
                                                        <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 -translate-x-1/2 z-10 w-max max-w-xs text-center shadow-lg pointer-events-none">
                                                            Pekerjaan: {act.nama_kegiatan_turunan} <br/>Rencana: B{startMonth} - B{endMonth}
                                                        </div>
                                                        <span className="text-white text-xs font-bold leading-none truncate w-full pl-2">{act.kode_pmo}</span>
                                                        {isFinished && <div className="absolute right-2 w-3 h-3 bg-green-500 transform rotate-45" title={"Selesai Bulan " + (realEndMonth || endMonth)}></div>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!activities || activities.length === 0) && (
                                        <div className="text-center text-xs text-gray-400 p-4">Tidak ada Milestone di tahun ini</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeSubTab === 'Rincian Task' && (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                            <ListBulletIcon className="h-16 w-16 mb-4 opacity-50 text-blue-400" />
                            <h3 className="text-lg font-bold text-gray-600 mb-2">Rincian Task</h3>
                            <p className="text-sm">Modul dekomposisi hierarki rincian aktivitas sedang dalam rekayasa sistem.</p>
                        </div>
                    )}
                    
                    {activeSubTab === 'Task Terlambat' && (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                            <ClockIcon className="h-16 w-16 mb-4 opacity-50 text-red-400" />
                            <h3 className="text-lg font-bold text-gray-600 mb-2">Task Terlambat</h3>
                            <p className="text-sm">Pendeteksian aktivitas melewati tenggat waktu akan tersedia segera.</p>
                        </div>
                    )}

                    {activeSubTab === 'Risiko & Isu' && (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                            <ExclamationTriangleIcon className="h-16 w-16 mb-4 opacity-50 text-amber-500" />
                            <h3 className="text-lg font-bold text-gray-600 mb-2">Manajemen Risiko & Isu</h3>
                            <p className="text-sm">Buku catatan mitigasi kendala dan isu proyek belum divalidasi ketersediaan datanya.</p>
                        </div>
                    )}

                    {activeSubTab === 'Ang Invalid' && (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                            <XCircleIcon className="h-16 w-16 mb-4 opacity-50 text-orange-500" />
                            <h3 className="text-lg font-bold text-gray-600 mb-2">Anggaran Invalid</h3>
                            <p className="text-sm">Filter pelacakan ketidaksesuaian serapan anggaran (Gap analysis) tahap inkubasi.</p>
                        </div>
                    )}

                </div>

            </main>
        </div>
    );
}
