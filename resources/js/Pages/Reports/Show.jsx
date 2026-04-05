import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeftIcon, DocumentCheckIcon, PencilSquareIcon, CheckCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function Show({ auth, report, userRole }) {
    
    // Status badges logic
    const getStatusStyle = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        if (status.includes('Draft')) return 'bg-gray-100 text-gray-800 border-gray-200';
        if (status.includes('Pending')) return 'bg-amber-100 text-amber-800 border-amber-200';
        if (status.includes('Approved')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (status.includes('Rejected')) return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        if (!status) return 'Draft';
        if (status === 'Pending_Manager') return 'Menunggu Tinjauan Manajer';
        if (status === 'Pending_Admin') return 'Menunggu Pengesahan Admin';
        if (status === 'Approved_Admin') return 'Laporan Final (Disahkan)';
        if (status === 'Approved_Manager') return 'Disetujui Manajer Lapangan';
        return status.replace('_', ' ');
    };

    const isEditable = (userRole === 'admin' || userRole === 'super-admin') || ((userRole === 'staff' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')));

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentActivityId, setCurrentActivityId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        kode_pmo: '',
        kode_rrkl: '',
        jumlah_target: '',
        jumlah_capaian: '',
        resiko_isu: '',
        solusi: '',
        nama_kegiatan_turunan: '',
        deskripsi_kegiatan: '',
        hasil_kegiatan: '',
        rencana_start_date: '',
        rencana_end_date: '',
        realisasi_start_date: '',
        realisasi_end_date: '',
        status_akhir: ''
    });

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentActivityId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (activity) => {
        setIsEditing(true);
        setCurrentActivityId(activity.id);
        setData({
            kode_pmo: activity.kode_pmo || '',
            kode_rrkl: activity.kode_rrkl || '',
            jumlah_target: activity.jumlah_target || '',
            jumlah_capaian: activity.jumlah_capaian || '',
            resiko_isu: activity.resiko_isu || '',
            solusi: activity.solusi || '',
            nama_kegiatan_turunan: activity.nama_kegiatan_turunan || '',
            deskripsi_kegiatan: activity.deskripsi_kegiatan || '',
            hasil_kegiatan: activity.hasil_kegiatan || '',
            rencana_start_date: activity.rencana_start_date || '',
            rencana_end_date: activity.rencana_end_date || '',
            realisasi_start_date: activity.realisasi_start_date || '',
            realisasi_end_date: activity.realisasi_end_date || '',
            status_akhir: activity.status_akhir || ''
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const deleteActivity = (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('activities.destroy', id), { preserveScroll: true });
        }
    };

    const handleApprove = (type) => {
        if (confirm('Yakin ingin menyetujui dokumen ini?')) {
            router.post('/approvals/' + report.id + '/approve-' + type, {}, { preserveScroll: true });
        }
    };

    const handleReject = () => {
        const reason = prompt('Masukkan alasan penolakan:');
        if (reason) {
            router.post('/approvals/' + report.id + '/reject', { reason }, { preserveScroll: true });
        }
    };

    const canSubmitPlan = (userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));
    
    const handleSubmitPlan = () => {
        if(confirm('Ajukan Dokumen Kinerja ini ke Manajer Lapangan? (Anda tidak bisa mengubah struktur data setelah disubmit)')) {
            router.post('/Project/' + report.id + '/submit-plan', {}, { preserveScroll: true });
        }
    };

    const canApproveManager = (userRole === 'manager' || userRole === 'admin' || userRole === 'super-admin') && report.approval_status === 'Pending_Manager';
    const canApproveAdmin = (userRole === 'admin' || userRole === 'super-admin') && report.approval_status === 'Pending_Admin';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put('/activities/' + currentActivityId, {
                onSuccess: () => { setIsModalOpen(false); reset(); },
                preserveScroll: true
            });
        } else {
            post('/Project/' + report.id + '/activities', {
                onSuccess: () => { setIsModalOpen(false); reset(); },
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('reports.index')} className="text-gray-500 hover:text-gray-700 transition">
                        <ArrowLeftIcon className="w-5 h-5 flex-shrink-0" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center">
                        Input & Detail Projek 
                        <span className={"ml-4 px-3 py-1 text-xs font-bold rounded-full border shadow-sm " + getStatusStyle(report.approval_status)}>
                            {getStatusText(report.approval_status)}
                        </span>
                    </h2>
                </div>
            }
        >
            <Head title="Detail Projek" />

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-5 border-b pb-3">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {isEditing ? 'Edit Data Projek' : 'Tambah Data Projek'}
                                        </h3>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Kode Output</label>
                                            <input type="text" value={data.kode_pmo} onChange={e => setData('kode_pmo', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Misal: 094.FD" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Kode RRKL</label>
                                            <input type="text" value={data.kode_rrkl} onChange={e => setData('kode_rrkl', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Misal: 01.AA.02" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Task Name (Nama Kegiatan)</label>
                                            <input type="text" value={data.nama_kegiatan_turunan} onChange={e => setData('nama_kegiatan_turunan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                                            {errors.nama_kegiatan_turunan && <span className="text-red-500 text-xs">{errors.nama_kegiatan_turunan}</span>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                            <textarea rows="2" value={data.deskripsi_kegiatan} onChange={e => setData('deskripsi_kegiatan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Hasil Kegiatan</label>
                                            <input type="text" value={data.hasil_kegiatan} onChange={e => setData('hasil_kegiatan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Jumlah Target</label>
                                            <input type="text" value={data.jumlah_target} onChange={e => setData('jumlah_target', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Jumlah Capaian</label>
                                            <input type="text" value={data.jumlah_capaian} onChange={e => setData('jumlah_capaian', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Resiko & Isu</label>
                                            <textarea rows="2" value={data.resiko_isu} onChange={e => setData('resiko_isu', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Solusi</label>
                                            <textarea rows="2" value={data.solusi} onChange={e => setData('solusi', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Start (Rencana)</label>
                                            <input type="date" value={data.rencana_start_date} onChange={e => setData('rencana_start_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Finish (Rencana)</label>
                                            <input type="date" value={data.rencana_end_date} onChange={e => setData('rencana_end_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Actual Start</label>
                                            <input type="date" value={data.realisasi_start_date} onChange={e => setData('realisasi_start_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Actual Finish</label>
                                            <input type="date" value={data.realisasi_end_date} onChange={e => setData('realisasi_end_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Status Capaian (% Complete)</label>
                                            <input type="text" value={data.status_akhir} onChange={e => setData('status_akhir', e.target.value)} placeholder="Contoh: 11% / Selesai / Belum" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Simpan
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-12 bg-gray-50 flex-1">
                <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">Informasi Pelapor</h3>
                            
                            <div className="flex space-x-2">
                                {canSubmitPlan && (
                                    <button onClick={handleSubmitPlan} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded shadow text-sm font-bold flex items-center">
                                        <DocumentCheckIcon className="w-4 h-4 mr-1"/> Ajukan Dokumen ke Manajer
                                    </button>
                                )}
                                {canApproveManager && (
                                    <>
                                        <button onClick={() => handleApprove('manager')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow text-sm font-bold flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/> Approve Tahap 1</button>
                                        <button onClick={handleReject} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded shadow text-sm font-bold flex items-center"><XMarkIcon className="w-4 h-4 mr-1"/> Tolak (Reject)</button>
                                    </>
                                )}
                                {canApproveAdmin && (
                                    <>
                                        <button onClick={() => handleApprove('admin')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded shadow text-sm font-bold flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/> Sahkan (Final Approve)</button>
                                        <button onClick={handleReject} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded shadow text-sm font-bold flex items-center"><XMarkIcon className="w-4 h-4 mr-1"/> Tolak (Reject)</button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Diisi Oleh</p>
                                <p className="mt-1 text-base font-medium text-gray-900">{report.user?.name || 'User'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Periode Target</p>
                                <p className="mt-1 text-base font-medium text-gray-900">{report.period?.month_year || 'Tanpa Periode'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <DocumentCheckIcon className="w-5 h-5 text-indigo-500 mr-2" />
                                Rincian Aktivitas / Milestone 
                            </h3>
                            {isEditable && (
                                <button onClick={openAddModal} className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors font-medium shadow-sm flex items-center">
                                    <PlusIcon className="w-4 h-4 mr-1"/> Tambah Baris
                                </button>
                            )}
                        </div>

                        <div className="overflow-x-auto p-0">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Kode Output</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Kode RRKL</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Task Name</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Deskripsi</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Hasil</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Jumlah Target</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Jumlah Capaian</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Resiko & Isu</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Solusi</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Jadwal Rencana</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Jadwal Realisasi</th>
                                        <th scope="col" className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Opsi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {report.activities && report.activities.length > 0 ? (
                                        report.activities.map((act) => (
                                            <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {act.kode_pmo || '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600 font-mono">
                                                    {act.kode_rrkl || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    <p className="font-semibold text-gray-900">{act.nama_kegiatan_turunan}</p>
                                                    {act.status_akhir && <p className="text-xs mt-1 text-green-600 font-bold bg-green-50 w-max px-2 py-0.5 rounded border border-green-200">Status Complete: {act.status_akhir}</p>}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 text-xs">
                                                    {act.deskripsi_kegiatan && <p className="truncate max-w-xs">{act.deskripsi_kegiatan}</p>}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 text-xs">
                                                    {act.hasil_kegiatan && <p className="truncate max-w-xs">{act.hasil_kegiatan}</p>}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                                    {act.jumlah_target || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-green-700">
                                                    {act.jumlah_capaian || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-red-600">
                                                    {act.resiko_isu && <p className="w-32 truncate" title={act.resiko_isu}>{act.resiko_isu}</p>}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-blue-600">
                                                    {act.solusi && <p className="w-32 truncate" title={act.solusi}>{act.solusi}</p>}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    <div>S: {act.rencana_start_date ? act.rencana_start_date.substring(0,10) : '-'}</div>
                                                    <div>F: {act.rencana_end_date ? act.rencana_end_date.substring(0,10) : '-'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-blue-600 font-medium">
                                                    <div>Act S: {act.realisasi_start_date ? act.realisasi_start_date.substring(0,10) : '-'}</div>
                                                    <div>Act F: {act.realisasi_end_date ? act.realisasi_end_date.substring(0,10) : '-'}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                    {isEditable ? (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button onClick={() => openEditModal(act)} className="text-amber-600 hover:text-amber-900 p-1.5 rounded-md hover:bg-amber-50" title="Edit">
                                                                <PencilSquareIcon className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => deleteActivity(act.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50" title="Hapus">
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">Read-only</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className="px-6 py-8 text-center text-sm text-gray-500">
                                                Belum ada rincian aktivitas yang diinputkan untuk proyek ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}





