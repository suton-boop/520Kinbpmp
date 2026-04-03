import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon, UserGroupIcon, DocumentArrowUpIcon, CloudArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';

export default function Index({ auth, users, gugusMutus = [] }) {
    const { delete: destroy } = useForm();
    const { data: importData, setData: setImportData, post: postImport, processing, reset: resetImport, errors: importErrors } = useForm({
        file: null,
        gugus_mutu_id: '',
    });

    const deleteUser = (e, id) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            destroy(route('users.destroy', id));
        }
    };

    const handleImport = (e) => {
        e.preventDefault();
        postImport(route('import.program'), {
            onSuccess: () => resetImport(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen User - Dashboardkin 520" />

            <div className="py-12 bg-gray-50 flex-1 min-h-screen">
                <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="bg-white p-8 shadow-sm sm:rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="bg-blue-900 p-4 rounded-2xl shadow-xl">
                                <UserGroupIcon className="h-8 w-8 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter text-blue-900 uppercase italic">Administrasi Akun & Akses</h3>
                                <p className="mt-1 text-xs text-gray-400 font-bold uppercase tracking-widest italic pt-1">
                                    Kelola daftar pengguna, peran, dan grup gugus mutu di sini.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0">
                            <Link
                                href={route('users.create')}
                                className="inline-flex items-center px-8 py-4 bg-blue-900 border border-transparent rounded-[20px] font-black text-xs text-white uppercase tracking-widest hover:bg-blue-950 transition shadow-2xl"
                            >
                                <PlusIcon className="w-5 h-5 mr-3 text-amber-400" /> Tambah User Baru
                            </Link>
                        </div>
                    </div>

                    {/* Excel Import Section per GM */}
                    <div className="bg-white p-8 shadow-sm sm:rounded-3xl border border-gray-100 bg-gradient-to-r from-blue-50/30 to-white">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center space-x-6">
                                <div className="bg-amber-400 p-4 rounded-2xl shadow-lg border-2 border-white">
                                    <CloudArrowUpIcon className="h-8 w-8 text-blue-900" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-xl font-black tracking-tighter text-blue-900 uppercase italic">Import Program Per GM</h4>
                                        <a 
                                            href="/templates/template_import.xlsx"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download="template_import_kin520.xlsx"
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 hover:bg-white transition-all shadow-sm group"
                                        >
                                            <DocumentArrowDownIcon className="w-4 h-4 group-hover:scale-110" /> Unduh Template (.xlsx)
                                        </a>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic pt-1">
                                        Pilih Kelompok Kerja dan unggah format Excel yang sesuai untuk import massal.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleImport} className="flex flex-col sm:flex-row items-end gap-4 bg-white p-6 rounded-[28px] border border-blue-50 shadow-sm flex-1 max-w-4xl">
                                <div className="w-full sm:w-1/3 space-y-2">
                                    <label className="text-[10px] font-black text-blue-900/60 uppercase ml-2 tracking-widest italic">Pilih Kelompok Kerja</label>
                                    <select 
                                        className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl text-[11px] font-bold text-gray-700 focus:ring-amber-400 focus:border-amber-400 transition-all uppercase italic shadow-inner"
                                        value={importData.gugus_mutu_id}
                                        onChange={e => setImportData('gugus_mutu_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- DINAS / GM --</option>
                                        {gugusMutus.map(gm => (
                                            <option key={gm.id} value={gm.id}>{gm.name}</option>
                                        ))}
                                    </select>
                                    {importErrors.gugus_mutu_id && <div className="text-red-500 text-[10px] uppercase font-black italic mt-1 ml-2">{importErrors.gugus_mutu_id}</div>}
                                </div>

                                <div className="w-full sm:w-1/3 space-y-2">
                                    <label className="text-[10px] font-black text-blue-900/60 uppercase ml-2 tracking-widest italic">File Excel / CSV</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setImportData('file', e.target.files[0])}
                                        className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl text-[11px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-900 file:text-white hover:file:bg-blue-800 transition-all p-2 pr-4 shadow-inner"
                                        required
                                    />
                                    {importErrors.file && <div className="text-red-500 text-[10px] uppercase font-black italic mt-1 ml-2">{importErrors.file}</div>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="h-14 px-8 bg-amber-400 text-blue-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-300 transition-all shadow-xl shadow-amber-100 hover:scale-105 flex items-center gap-3 disabled:opacity-50"
                                >
                                    <DocumentArrowUpIcon className="w-5 h-5" /> 
                                    {processing ? 'MEMPROSES...' : 'IMPORT DATA'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-blue-900 text-white font-black uppercase text-[10px] tracking-widest italic border-b border-blue-950">
                                    <tr>
                                        <th className="px-8 py-6 border-r border-blue-950/30">NAMA & EMAIL</th>
                                        <th className="px-8 py-6 border-r border-blue-950/30">PERAN / ROLE</th>
                                        <th className="px-8 py-6 border-r border-blue-950/30">GUGUS MUTU</th>
                                        <th className="px-8 py-6 text-center">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {users.data && users.data.length > 0 ? users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/20 transition-all group">
                                            <td className="px-8 py-6 whitespace-nowrap border-r border-gray-50">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-blue-900 font-black text-xs group-hover:bg-blue-900 group-hover:text-white transition-all shadow-inner">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="font-black text-gray-900 text-[13px] uppercase tracking-tighter italic">{user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap border-r border-gray-50">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles && user.roles.length > 0 ? user.roles.map(r => (
                                                        <span key={r.id} className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                            {r.name}
                                                        </span>
                                                    )) : <span className="text-gray-300 font-bold text-[9px] uppercase tracking-widest italic">Belum Ada Role</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap border-r border-gray-50">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-widest italic">
                                                    {user.gugus_mutu ? user.gugus_mutu.name : 'UMUM / PUSAT'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center space-x-4">
                                                <Link
                                                    href={route('users.edit', user.id)}
                                                    className="inline-flex items-center p-3 bg-blue-50 text-blue-900 rounded-2xl hover:bg-blue-900 hover:text-white transition-all shadow-sm group/edit"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>
                                                {user.id !== auth.user.id && (
                                                    <button
                                                        onClick={(e) => deleteUser(e, user.id)}
                                                        className="inline-flex items-center p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-24 text-center">
                                                <p className="text-gray-300 font-black uppercase tracking-[0.6em] italic animate-pulse">NIHIL USER TERKAIT</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">MENAMPILKAN {users.data.length} PETUGAS AKSI</div>
                             <div className="flex space-x-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all shadow-inner ${link.active ? 'bg-blue-900 text-white shadow-2xl scale-110' : 'bg-white text-gray-400 hover:text-blue-900 hover:bg-white'} ${!link.url ? 'opacity-30 cursor-not-allowed border-none' : 'border border-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
