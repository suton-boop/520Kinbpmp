import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { CheckCircleIcon, MinusCircleIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

const formatRp = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
};

export default function Index({ auth, anggaranData }) {
    const [expandedRows, setExpandedRows] = useState({ 1: true });
    
    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
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
        { name: 'Realisasi', value: totalRealisasi, color: '#3b82f6' },
        { name: 'Sisa Anggaran', value: sisaAnggaran > 0 ? sisaAnggaran : 0, color: '#e5e7eb' },
    ];
    
    const chartFormatter = (value) => 'Rp ' + formatRp(value);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800 tracking-tight">Modul Anggaran</h2>}>
            <Head title="Anggaran" />

            <div className="py-8 bg-gray-50 flex-1 h-full min-h-screen">
                <div className="max-w-[1600px] mx-auto sm:px-4 lg:px-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Ringkasan & Data Anggaran</h3>
                        <PrimaryButton onClick={() => openAddModal()} className="bg-blue-600 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5 mr-1" /> Tambah RO Utama
                        </PrimaryButton>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col justify-center">
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Alokasi (Rp)</div>
                            <div className="text-3xl font-bold text-gray-800">{formatRp(totalAlokasi)}</div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col justify-center">
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Realisasi (Rp)</div>
                            <div className="text-3xl font-bold text-blue-600">{formatRp(totalRealisasi)}</div>
                            <div className="text-xs text-green-600 font-medium mt-2">
                                {totalAlokasi > 0 ? ((totalRealisasi / totalAlokasi) * 100).toFixed(1) : 0}% Terserap
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center h-48">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Grafik Serapan</h4>
                            <div className="w-full h-full min-h-[120px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={chartFormatter} />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr>
                                        <th rowSpan="2" className="px-6 py-4 border-b border-r bg-gray-50 font-bold text-gray-800 min-w-[300px]">Kode & Nomenklatur</th>
                                        <th rowSpan="2" className="px-4 py-4 border-b border-r bg-gray-50 font-bold text-gray-800 text-center uppercase text-xs w-32 tracking-wider">Volume</th>
                                        <th rowSpan="2" className="px-4 py-4 border-b border-r bg-gray-50 text-center w-36">
                                            <div className="font-bold text-gray-800 text-xs uppercase tracking-wider">Pelaksanaan</div>
                                            <div className="text-[10px] text-gray-500 font-normal italic">(% Kumulatif)</div>
                                        </th>
                                        <th colSpan="3" className="px-4 py-2 border-b border-r bg-gray-50 font-bold text-gray-800 text-center text-xs uppercase tracking-wider">Anggaran</th>
                                        <th colSpan="12" className="px-2 py-2 border-b border-r bg-gray-50 font-bold text-gray-800 text-center text-xs uppercase tracking-wider">Kelengkapan</th>
                                        <th rowSpan="2" className="px-4 py-4 border-b bg-gray-50 font-bold text-gray-800 text-center text-xs uppercase tracking-wider">Aksi</th>
                                    </tr>
                                    <tr>
                                        <th className="px-4 py-2 border-b border-r bg-white font-medium text-gray-500 text-[11px] text-right uppercase w-32">Alokasi</th>
                                        <th className="px-4 py-2 border-b border-r bg-white font-medium text-gray-500 text-[11px] text-right uppercase w-32">Realisasi</th>
                                        <th className="px-2 py-2 border-b border-r bg-white font-medium text-gray-500 text-[11px] text-center w-12">%</th>
                                        {months.map(m => (
                                            <th key={m} className="px-1 py-2 border-b border-l bg-white font-medium text-gray-500 text-[10px] text-center w-8">{m}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {anggaranData && anggaranData.map(parent => (
                                        <React.Fragment key={parent.id}>
                                            <tr className="bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors">
                                                <td className="px-4 py-3 border-r relative align-top">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                                                    <div className="flex items-start">
                                                        <button 
                                                            onClick={() => toggleRow(parent.id)}
                                                            className="mt-0.5 mr-2 text-amber-500 hover:text-amber-600 focus:outline-none"
                                                        >
                                                            {expandedRows[parent.id] ? (
                                                                <MinusCircleIcon className="w-5 h-5 flex-shrink-0" />
                                                            ) : (
                                                                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                                                            )}
                                                        </button>
                                                        <div>
                                                            <div className="font-bold text-blue-800 tracking-tight flex items-center mb-1">
                                                                {parent.kode}
                                                                <span className="ml-1 text-[10px] text-white bg-blue-500 rounded-full w-4 h-4 inline-flex items-center justify-center">i</span>
                                                            </div>
                                                            <div className="text-gray-700 text-xs">{parent.nomenklatur}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 border-r text-right font-medium text-gray-700 text-xs whitespace-nowrap align-middle">
                                                    {parent.volume}
                                                </td>
                                                <td className="px-4 py-3 border-r text-center align-middle">
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-16 bg-cyan-400 text-white text-[10px] font-bold py-1 px-1 rounded-sm text-center tracking-wider">
                                                            {Number(parent.pelaksanaan).toFixed(1)}%
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 border-r text-right font-mono text-gray-700 text-xs align-middle">
                                                    {formatRp(parent.anggaran_alokasi)}
                                                </td>
                                                <td className="px-4 py-3 border-r text-right font-mono text-gray-700 text-xs align-middle">
                                                    {formatRp(parent.anggaran_realisasi)}
                                                </td>
                                                <td className="px-2 py-3 border-r text-center font-medium text-gray-700 text-xs align-middle">
                                                    {Number(parent.anggaran_persen).toFixed(1)}
                                                </td>
                                                {parent.kelengkapan && parent.kelengkapan.map((status, i) => (
                                                    <td key={i} className="px-1 py-3 border-l text-center align-middle">
                                                        {status && <CheckCircleIcon className="w-4 h-4 text-green-500 mx-auto" />}
                                                    </td>
                                                ))}
                                                <td className="px-2 py-3 text-center align-middle whitespace-nowrap">
                                                    <button onClick={() => openAddModal(parent.id)} className="text-blue-500 hover:text-blue-700 mx-1" title="Tambah Komponen (Child)">
                                                        <PlusIcon className="w-4 h-4 inline" />
                                                    </button>
                                                    <button onClick={() => openEditModal(parent)} className="text-amber-500 hover:text-amber-700 mx-1" title="Edit">
                                                        <PencilSquareIcon className="w-4 h-4 inline" />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(parent.id)} className="text-red-500 hover:text-red-700 mx-1" title="Hapus">
                                                        <TrashIcon className="w-4 h-4 inline" />
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedRows[parent.id] && parent.children && parent.children.map((child, index) => (
                                                <tr key={child.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 border-r pl-8 align-top relative">
                                                        <div className="flex items-start">
                                                            <div className="text-gray-400 text-xs w-6 mt-1 flex-shrink-0 text-center font-mono">
                                                                {child.urut}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-blue-800 text-xs mb-1 tracking-tight">{child.kode}</div>
                                                                {child.tipe && (
                                                                    <span className="bg-cyan-600 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                                                                        {child.tipe}
                                                                    </span>
                                                                )}
                                                                <div className="text-gray-600 text-[11px] leading-tight mt-1">{child.nomenklatur}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r text-right font-medium text-gray-600 text-xs whitespace-nowrap align-middle">
                                                        {child.volume}
                                                    </td>
                                                    <td className="px-4 py-3 border-r text-center align-middle">
                                                        <div className="flex items-center justify-center">
                                                            <div className="w-16 bg-cyan-400 text-white text-[10px] font-bold py-1 px-1 rounded-sm text-center tracking-wider">
                                                                {Number(child.pelaksanaan).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r text-right font-mono text-gray-600 text-xs align-middle">
                                                        {formatRp(child.anggaran_alokasi)}
                                                    </td>
                                                    <td className="px-4 py-3 border-r text-right font-mono text-gray-600 text-xs align-middle">
                                                        {child.anggaran_realisasi > 0 ? formatRp(child.anggaran_realisasi) : '0'}
                                                    </td>
                                                    <td className="px-2 py-3 border-r text-center font-medium text-gray-600 text-xs align-middle">
                                                        {Number(child.anggaran_persen).toFixed(1)}
                                                    </td>
                                                    {child.kelengkapan && child.kelengkapan.map((status, i) => (
                                                        <td key={i} className="px-1 py-3 border-l text-center align-middle">
                                                            {status && <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 mx-auto" />}
                                                        </td>
                                                    ))}
                                                    <td className="px-2 py-3 text-center align-middle whitespace-nowrap">
                                                        <button onClick={() => openEditModal(child)} className="text-amber-500 hover:text-amber-700 mx-1" title="Edit">
                                                            <PencilSquareIcon className="w-4 h-4 inline" />
                                                        </button>
                                                        <button onClick={() => openDeleteModal(child.id)} className="text-red-500 hover:text-red-700 mx-1" title="Hapus">
                                                            <TrashIcon className="w-4 h-4 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50 border-t border-gray-200 p-4 text-xs text-center text-gray-500 font-medium">
                            Menampilkan realisasi serapan anggaran secara kumulatif
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal CRUD */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {modalMode === 'add' ? 'Tambah Data Anggaran' : 'Edit Data Anggaran'}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="kode" value="Kode (Contoh: RO 7605 / KOMP 091)" />
                            <TextInput
                                id="kode"
                                className="mt-1 block w-full"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                required
                            />
                        </div>
                        
                        {data.parent_id !== '' && (
                            <div>
                                <InputLabel htmlFor="urut" value="Urutan" />
                                <TextInput
                                    id="urut"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.urut}
                                    onChange={(e) => setData('urut', e.target.value)}
                                />
                            </div>
                        )}

                        <div className="col-span-2">
                            <InputLabel htmlFor="nomenklatur" value="Nomenklatur" />
                            <TextInput
                                id="nomenklatur"
                                className="mt-1 block w-full"
                                value={data.nomenklatur}
                                onChange={(e) => setData('nomenklatur', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="volume" value="Volume" />
                            <TextInput
                                id="volume"
                                className="mt-1 block w-full"
                                value={data.volume}
                                onChange={(e) => setData('volume', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="pelaksanaan" value="Pelaksanaan (%)" />
                            <TextInput
                                id="pelaksanaan"
                                type="number"
                                step="0.1"
                                className="mt-1 block w-full"
                                value={data.pelaksanaan}
                                onChange={(e) => setData('pelaksanaan', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="anggaran_alokasi" value="Alokasi Anggaran (Rp)" />
                            <TextInput
                                id="anggaran_alokasi"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.anggaran_alokasi}
                                onChange={(e) => setData('anggaran_alokasi', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="anggaran_realisasi" value="Realisasi Anggaran (Rp)" />
                            <TextInput
                                id="anggaran_realisasi"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.anggaran_realisasi}
                                onChange={(e) => setData('anggaran_realisasi', e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="col-span-2 mt-4 border-t border-gray-200 pt-4">
                            <InputLabel value="Kelengkapan Berkas (Per Bulan)" />
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-2 bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                                {months.map((m, index) => (
                                    <label key={index} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                                        <input 
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            checked={data.kelengkapan ? data.kelengkapan[index] : false}
                                            onChange={(e) => {
                                                const newKelengkapan = data.kelengkapan ? [...data.kelengkapan] : Array(12).fill(false);
                                                newKelengkapan[index] = e.target.checked;
                                                setData('kelengkapan', newKelengkapan);
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete */}
            <Modal show={isDeleteModalOpen} onClose={closeModal}>
                <form onSubmit={handleDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Hapus</h2>
                    <p className="text-sm text-gray-600">Apakah Anda yakin ingin menghapus data ini? Semua data terkait (termasuk komponen/children) akan ikut terhapus.</p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>Hapus</DangerButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
