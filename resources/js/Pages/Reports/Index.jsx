import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Index({ auth, reports, userRole }) {
    
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
        if (status === 'Pending_Manager') return 'Menunggu Manajer';
        if (status === 'Pending_Admin') return 'Menunggu Admin';
        if (status === 'Approved_Admin') return 'Disahkan';
        if (status === 'Approved_Manager') return 'Disetujui Manajer';
        if (status === 'Rejected_Manager') return 'Ditolak Manajer';
        if (status === 'Rejected_Admin') return 'Ditolak Admin';
        return status;
    };

    const submitAction = (id, type) => {
        const url = type === 'plan' ? "/Project/" + id + "/submit-plan" : "/Project/" + id + "/submit-report";
        const message = type === 'plan' ? 
            'Apakah Anda yakin mengajukan Rencana Kinerja ini ke Manajer? (Pastikan ini diajukan SEBELUM tanggal 20)' : 
            'Apakah Anda yakin mengajukan Laporan Capaian ini? (Pastikan ini diajukan SEBELUM tanggal 5)';
            
        if(confirm(message)) {
            router.post(url);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Projek & Kinerja</h2>}
        >
            <Head title="Manajemen Projek" />

            <div className="py-12 bg-gray-50 flex-1">
                <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8 space-y-6">

                    {/* HERO & ACTIONS SECTION */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-amber-400 pl-3">Daftar Dokumen Kinerja</h3>
                            <p className="mt-1 text-sm text-gray-500 pl-4">
                                Atur dokumen perencanaan dan pelaporan realisasi kegiatan Anda di sini.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-3">
                            {(userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (
                                <Link 
                                    href={route('reports.store')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:from-amber-500 hover:to-amber-600 focus:bg-amber-600 active:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md"
                                >
                                    <PlusIcon className="w-5 h-5 mr-1" />
                                    Buat Rencana Baru
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* TABLE SECTION */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Pemilik Laporan</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Gugus Mutu</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Periode</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Jmh Kegiatan</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {reports && reports.length > 0 ? (
                                        reports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50/50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                                            {report.user?.name ? report.user.name.charAt(0) : 'U'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">{report.user?.name || 'Anda'}</p>
                                                            <p className="text-xs text-gray-500">{report.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 shadow-sm">
                                                        {report.user?.gugus_mutu?.name || 'Umum'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900 border-b-2 border-amber-400 w-max pb-0.5">{report.period?.month_year || 'Tanpa Periode'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 font-medium">
                                                        {report.activities?.length || 0} Aktifitas
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={"px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm " + getStatusStyle(report.approval_status)}>
                                                        {getStatusText(report.approval_status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 flex justify-center items-center">
                                                    
                                                    {/* TOMBOL REVIEW/INPUT */}
                                                    <Link 
                                                        href={"/Project/" + report.id} 
                                                        className="inline-flex items-center px-3 py-1.5 border border-indigo-200 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors shadow-sm"
                                                    >
                                                        <EyeIcon className="w-4 h-4 mr-1.5" />
                                                        {(userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && report.approval_status === 'Draft' ? 'Input Capaian' : 'Lihat Detail'}
                                                    </Link>

                                                    {/* TOMBOL SUBMIT UNTUK STAF JIKA DRAFT/DITOLAK */}
                                                    {(userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')) && (
                                                        <div className="relative inline-block text-left group">
                                                            <button className="inline-flex items-center px-3 py-1.5 border border-green-200 rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors shadow-sm">
                                                                <ArrowPathIcon className="w-4 h-4 mr-1.5" /> Kirim
                                                            </button>
                                                            
                                                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                                <div className="py-1">
                                                                    <button 
                                                                        onClick={() => submitAction(report.id, 'plan')}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 border-b border-gray-100"
                                                                    >
                                                                        Ajukan Rencana (Seblm Tgl 20)
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => submitAction(report.id, 'report')}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900"
                                                                    >
                                                                        Ajukan Laporan Capaian (Tgl 5)
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="rounded-full bg-gray-100 p-4 mb-3">
                                                        <ArrowPathIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-sm font-medium text-gray-900">Belum ada data Projek/Laporan</h3>
                                                    <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat rencana kegiatan pertama Anda.</p>
                                                </div>
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



