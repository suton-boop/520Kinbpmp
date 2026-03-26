import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { CheckCircleIcon, MinusCircleIcon, PencilSquareIcon, TrashIcon, PlusIcon, HomeIcon, BriefcaseIcon, CurrencyDollarIcon, UserGroupIcon, BanknotesIcon, ArrowTrendingUpIcon, WalletIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

const formatRp = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

export default function Index({ auth, anggaranData }) {
    const [expandedRows, setExpandedRows] = useState({});
    
    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [selectedId, setSelectedId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        parent_id: '',
        urut: '',
        kode: '',
        tipe: '',
        nomenklatur: '',
        volume: '',
        pelaksanaan: '',
        anggaran_alokasi: '',
        anggaran_realisasi: '',
        kelengkapan: Array(12).fill(false),
    });

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const openAddModal = (parentId = null) => {
        reset();
        setModalMode('add');
        setData({
            parent_id: parentId || '',
            urut: '',
            kode: '',
            tipe: '',
            nomenklatur: '',
            volume: '',
            pelaksanaan: '',
            anggaran_alokasi: '',
            anggaran_realisasi: '',
            kelengkapan: Array(12).fill(false),
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        reset();
        setModalMode('edit');
        setSelectedId(item.id);
        setData({
            parent_id: item.parent_id || '',
            urut: item.urut || '',
            kode: item.kode || '',
            tipe: item.tipe || '',
            nomenklatur: item.nomenklatur || '',
            volume: item.volume || '',
            pelaksanaan: item.pelaksanaan || '',
            anggaran_alokasi: item.anggaran_alokasi || '',
            anggaran_realisasi: item.anggaran_realisasi || '',
            kelengkapan: item.kelengkapan || Array(12).fill(false),
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (id) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post(route('anggaran.store'), {
                onSuccess: () => closeModal(),
            });
        } else {
            put(route('anggaran.update', selectedId), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        destroy(route('anggaran.destroy', selectedId), {
            onSuccess: () => closeModal(),
        });
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const totalAlokasi = anggaranData ? anggaranData.reduce((acc, curr) => acc + Number(curr.anggaran_alokasi), 0) : 0;
    const totalRealisasi = anggaranData ? anggaranData.reduce((acc, curr) => acc + Number(curr.anggaran_realisasi), 0) : 0;
    const sisaAnggaran = totalAlokasi - totalRealisasi;
    
    const pieData = [
        { name: 'REALISASI', value: totalRealisasi, color: '#3B82F6' },
        { name: 'SISA ALOKASI', value: sisaAnggaran > 0 ? sisaAnggaran : 0, color: '#DBEAFE' },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Head title="Modul Anggaran - SIPEGA" />

            {/* Header matches Dashboard.jsx */}
            <header className="bg-amber-400 h-16 sticky top-0 z-50 shadow-md border-b border-amber-500">
                <div className="max-w-screen-2xl mx-auto px-8 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <div className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Transformasi Organisasi</div>
                        <nav className="flex items-center space-x-3">
                             {[
                                { name: 'Home', href: route('dashboard'), icon: HomeIcon },
                                { name: 'Project', href: route('reports.index'), icon: BriefcaseIcon },
                                { name: 'Anggaran', href: route('anggaran'), icon: CurrencyDollarIcon, active: true },
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

            <main className="flex-1 max-w-screen-2xl mx-auto p-10 space-y-12 w-full">
                
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-5xl font-black text-blue-900 uppercase tracking-tighter italic decoration-amber-400 decoration-8 underline-offset-8 underline">Manajemen Anggaran</h2>
                        <p className="mt-8 text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Integrasi RKKL 2026 & Bull; Monitoring Realitas Fisik dan Keuangan</p>
                    </div>
                    <button 
                        onClick={() => openAddModal()}
                        className="bg-blue-900 text-white px-10 py-5 rounded-[24px] font-black text-[12px] uppercase tracking-widest shadow-[0_20px_40px_-5px_rgba(30,58,138,0.4)] flex items-center hover:scale-105 transition-transform"
                    >
                        <PlusIcon className="w-5 h-5 mr-3 text-amber-400" /> Tambah RO Utama
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <div className="bg-blue-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <WalletIcon className="absolute -right-8 -bottom-8 h-40 w-40 text-white/5 transform -rotate-12" />
                            <p className="text-[11px] font-black tracking-widest uppercase opacity-60 mb-4">TOTAL ALOKASI RKKL</p>
                            <p className="text-3xl font-black italic mb-10 tracking-tighter">{formatRp(totalAlokasi)}</p>
                            
                            <div className="bg-white/10 p-6 rounded-[24px] backdrop-blur-md border border-white/10">
                                <p className="text-[10px] font-black tracking-widest uppercase opacity-60 mb-2">Penyerapan Aktif</p>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xl font-black">{formatRp(totalRealisasi)}</p>
                                    <span className="text-amber-400 font-black text-sm">{((totalRealisasi / totalAlokasi) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                     <div className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ width: ((totalRealisasi / totalAlokasi) * 100) + '%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center italic">Proporsi Dana Terserap</p>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => formatRp(v)} contentStyle={{ borderRadius: '24px', border: 'none', background: '#FFF font-weight: bold', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto mb-2 shadow-lg"></div>
                                    <p className="text-[9px] font-black text-gray-400">REALISASI</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-blue-100 rounded-full mx-auto mb-2 shadow-lg"></div>
                                    <p className="text-[9px] font-black text-gray-400">SISA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Table Area */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="bg-white rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-blue-900 text-white font-black uppercase text-[11px] border-b border-blue-950 tracking-[0.2em] italic">
                                            <th className="px-10 py-8 border-r border-blue-950/30">KODE & RKKLID</th>
                                            <th className="px-10 py-8 border-r border-blue-950/30">NOMENKLATUR & VOLUME</th>
                                            <th className="px-10 py-8 border-r border-blue-950/30 text-right">ALOKASI (Rp)</th>
                                            <th className="px-10 py-8 border-r border-blue-950/30 text-right">REALISASI (Rp)</th>
                                            <th className="px-10 py-8 text-center">%</th>
                                            <th className="px-10 py-8 text-center text-[10px]">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anggaranData?.map(parent => (
                                            <React.Fragment key={parent.id}>
                                                <tr className="bg-gray-50 border-b border-gray-100 group">
                                                    <td className="px-10 py-10 border-r border-gray-50 relative">
                                                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-400"></div>
                                                        <div className="flex items-center">
                                                            <button 
                                                                onClick={() => toggleRow(parent.id)}
                                                                className="mr-4 text-blue-900 hover:scale-125 transition-transform"
                                                            >
                                                                {expandedRows[parent.id] ? (
                                                                    <MinusCircleIcon className="w-8 h-8 flex-shrink-0" />
                                                                ) : (
                                                                    <PlusIcon className="w-8 h-8 flex-shrink-0 bg-white shadow-md rounded-full border border-gray-100 p-1.5" />
                                                                )}
                                                            </button>
                                                            <span className="font-mono font-black text-blue-900 text-base italic tracking-tighter">'{parent.kode}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-10 border-r border-gray-50">
                                                        <p className="font-black text-gray-800 text-base uppercase leading-snug tracking-tighter italic mb-2">{parent.nomenklatur}</p>
                                                        <div className="inline-flex items-center bg-white px-4 py-1.5 rounded-full border border-gray-200">
                                                            <DocumentTextIcon className="h-4 w-4 text-amber-500 mr-2" />
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{parent.volume || '1 PAKET'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-10 border-r border-gray-50 text-right font-black text-gray-500 text-sm">{formatRp(parent.anggaran_alokasi)}</td>
                                                    <td className="px-10 py-10 border-r border-gray-50 text-right font-black text-blue-900 text-sm tabular-nums underline decoration-amber-400 decoration-2 underline-offset-4">{formatRp(parent.anggaran_realisasi)}</td>
                                                    <td className="px-10 py-10 border-r border-gray-50 text-center">
                                                        <div className="bg-blue-900 text-amber-400 px-4 py-2 rounded-xl font-black text-xs shadow-lg">{Number(parent.anggaran_persen).toFixed(1)}%</div>
                                                    </td>
                                                    <td className="px-10 py-10 text-center">
                                                        <div className="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openEditModal(parent)} className="bg-amber-100 p-3 rounded-2xl text-amber-600 hover:bg-amber-200 transition-all"><PencilSquareIcon className="h-5 w-5" /></button>
                                                            <button onClick={() => openDeleteModal(parent.id)} className="bg-red-100 p-3 rounded-2xl text-red-600 hover:bg-red-200 transition-all"><TrashIcon className="h-5 w-5" /></button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {expandedRows[parent.id] && parent.children?.map(child => (
                                                    <tr key={child.id} className="bg-white border-b border-gray-50 hover:bg-blue-50/20 transition-all group/child">
                                                        <td className="px-10 py-8 border-r border-gray-50 pl-24 font-mono font-black text-gray-400 text-sm italic">'{child.kode}</td>
                                                        <td className="px-10 py-8 border-r border-gray-50">
                                                            <p className="font-black text-gray-600 text-sm uppercase tracking-tighter mb-1">{child.nomenklatur}</p>
                                                            <p className="text-[9px] text-gray-400 font-bold tracking-[0.3em]">{child.tipe || 'KOMPONEN TURUNAN'}</p>
                                                        </td>
                                                        <td className="px-10 py-8 border-r border-gray-50 text-right font-bold text-gray-400 text-[13px]">{formatRp(child.anggaran_alokasi)}</td>
                                                        <td className="px-10 py-8 border-r border-gray-50 text-right font-bold text-blue-800 text-[13px]">{formatRp(child.anggaran_realisasi)}</td>
                                                        <td className="px-10 py-8 border-r border-gray-50 text-center font-black text-blue-900/40 text-xs italic">{Number(child.anggaran_persen).toFixed(1)}%</td>
                                                        <td className="px-10 py-8 text-center">
                                                            <div className="flex items-center justify-center space-x-2 opacity-0 group-hover/child:opacity-100 transition-opacity">
                                                                <button onClick={() => openEditModal(child)} className="p-2 rounded-xl hover:text-amber-500"><PencilSquareIcon className="h-4 w-4" /></button>
                                                                <button onClick={() => openDeleteModal(child.id)} className="p-2 rounded-xl hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Modal system matches Dashboard premium style but with custom forms */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="3xl">
                <form onSubmit={handleSubmit} className="p-12 relative overflow-hidden bg-white rounded-[40px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter italic mb-10 border-l-8 border-amber-400 pl-8">
                        {modalMode === 'add' ? 'Registrasi Anggaran Baru' : 'Perbarui Data Anggaran'}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <InputLabel htmlFor="kode" className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-3" value="Kode RKKL (RO/KOMP)" />
                                <TextInput id="kode" className="w-full bg-gray-50 border-gray-200 rounded-2xl py-4" value={data.kode} onChange={(e) => setData('kode', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel htmlFor="nomenklatur" className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-3" value="Nomenklatur Program" />
                                <textarea id="nomenklatur" className="w-full bg-gray-50 border-gray-200 rounded-2xl py-4 h-32 italic font-bold text-blue-900 border" value={data.nomenklatur} onChange={(e) => setData('nomenklatur', e.target.value)} required />
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="volume" className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-3" value="Volume (PAKET/OR)" />
                                    <TextInput id="volume" className="w-full bg-gray-50 border-gray-200 rounded-2xl py-4" value={data.volume} onChange={(e) => setData('volume', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel htmlFor="pelaksanaan" className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-3" value="Fisik (%)" />
                                    <TextInput id="pelaksanaan" type="number" step="0.1" className="w-full bg-gray-50 border-gray-200 rounded-2xl py-4" value={data.pelaksanaan} onChange={(e) => setData('pelaksanaan', e.target.value)} required />
                                </div>
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="anggaran_alokasi" className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-3" value="Nominal Alokasi (Rp)" />
                                <TextInput id="anggaran_alokasi" type="number" className="w-full bg-amber-50 border-amber-200 rounded-2xl py-4 font-black" value={data.anggaran_alokasi} onChange={(e) => setData('anggaran_alokasi', e.target.value)} required />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="anggaran_realisasi" className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-3" value="Nominal Realisasi (Rp)" />
                                <TextInput id="anggaran_realisasi" type="number" className="w-full bg-blue-50 border-blue-200 rounded-2xl py-4 font-black text-blue-900" value={data.anggaran_realisasi} onChange={(e) => setData('anggaran_realisasi', e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end space-x-6">
                        <button type="button" onClick={closeModal} className="text-[12px] font-black uppercase text-gray-400 tracking-widest hover:text-gray-600 transition-colors">Batal</button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-blue-900 text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-800 disabled:opacity-50"
                        >
                            Konfirmasi Simpan
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={closeModal}>
                <div className="p-12 text-center bg-white rounded-[40px]">
                    <div className="bg-red-100 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <TrashIcon className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-black text-blue-900 uppercase italic mb-4">Eliminasi Data</h2>
                    <p className="text-gray-400 font-bold text-sm tracking-tight mb-10 leading-relaxed uppercase">
                        Anda akan menghapus data RKKL ini secara permanen dari sistem integrasi 2026. <br/> Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex items-center justify-center space-x-8">
                         <button onClick={closeModal} className="text-[12px] font-black uppercase text-gray-300 tracking-widest">Batalkan</button>
                         <button 
                            onClick={handleDelete}
                            disabled={processing}
                            className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-red-700 transition-all font-black italic"
                         >
                            Hapus Sekarang
                         </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
