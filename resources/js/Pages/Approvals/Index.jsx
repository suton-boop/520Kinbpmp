import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, pending_approvals, userRole }) {
    
    const handleApprove = (id) => {
        if(confirm('Apakah Anda yakin ingin menyetujui pengajuan ini?')) {
            const endpoint = (userRole === 'admin' || userRole === 'super-admin') ? `/approvals/${id}/approve-admin` : `/approvals/${id}/approve-manager`;
            router.post(endpoint);
        }
    };

    const handleReject = (id) => {
        const reason = prompt('Masukkan alasan penolakan untuk dikembalikan ke staf:');
        if (reason) {
            router.post(`/approvals/${id}/reject`, { reason });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Menunggu Persetujuan ({(userRole === 'admin' || userRole === 'super-admin') ? 'Admin Pusat' : 'Manajer Gugus'})</h2>}
        >
            <Head title="Approval" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Daftar Laporan yang Butuh Validasi Anda</h3>
                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Staf</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gugus Mutu</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembacaan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pending_approvals?.length > 0 ? (
                                        pending_approvals.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.user?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.user?.gugus_mutu?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700">{item.period?.month_year}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        {item.approval_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {(item.approval_status === 'Pending_Manager' && userRole === 'manager') || 
                                                     (item.approval_status === 'Pending_Admin' && (userRole === 'admin' || userRole === 'super-admin')) ? (
                                                        <>
                                                            <button onClick={() => handleApprove(item.id)} className="px-3 py-1 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors">Teruskan (Setuju)</button>
                                                            <button onClick={() => handleReject(item.id)} className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-colors">Tolak (Kembalikan)</button>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Sudah direview</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                Tidak ada pengajuan yang menunggu persetujuan Anda saat ini.
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
