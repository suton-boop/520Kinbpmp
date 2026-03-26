import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/solid';

export default function Index({ auth, users }) {
    const { delete: destroy } = useForm();

    const deleteUser = (e, id) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            destroy(route('users.destroy', id));
        }
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

                        {/* Pagination Section matching Dashboard style */}
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
