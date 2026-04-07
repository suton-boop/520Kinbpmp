import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
  PlusIcon,
  EyeIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/solid";

export default function Index({ auth, reports, userRole, allowImport }) {
  const {
    data: importData,
    setData: setImportData,
    post: postImport,
    processing,
    reset: resetImport,
    errors: importErrors,
  } = useForm({
    file: null,
  });

  const getStatusStyle = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    if (status.includes("Draft"))
      return "bg-gray-100 text-gray-800 border-gray-200";
    if (status.includes("Pending"))
      return "bg-amber-100 text-amber-800 border-amber-200";
    if (status.includes("Approved"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (status.includes("Rejected"))
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    if (!status) return "Draft";
    if (status === "Pending_Manager") return "Menunggu Manajer";
    if (status === "Pending_Admin") return "Menunggu Admin";
    if (status === "Approved_Admin") return "Disahkan";
    if (status === "Approved_Manager") return "Disetujui Manajer";
    if (status === "Rejected_Manager") return "Ditolak Manajer";
    if (status === "Rejected_Admin") return "Ditolak Admin";
    return status;
  };

  const submitAction = (id, type) => {
    const url =
      type === "plan"
        ? "/Project/" + id + "/submit-plan"
        : "/Project/" + id + "/submit-report";
    const message =
      type === "plan"
        ? "Apakah Anda yakin mengajukan Rencana Kinerja ini ke Manajer? (Pastikan ini diajukan SEBELUM tanggal 20)"
        : "Apakah Anda yakin mengajukan Laporan Capaian ini? (Pastikan ini diajukan SEBELUM tanggal 5)";

    if (confirm(message)) {
      router.post(url);
    }
  };

  const handleImport = (e) => {
    e.preventDefault();
    postImport(route("import.program"), {
      onSuccess: () => resetImport(),
    });
  };

  // Roles that are allowed to perform actions
  const canPerformActions = ["staff", "manager", "admin", "super-admin", "superadmin"].includes(userRole);

  return (
    <AuthenticatedLayout>
      <Head title="Manajemen Projek - Dashboardkin 520" />

      <div className="py-12 bg-gray-50 flex-1 min-h-screen">
        <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8 space-y-6">
          {/* HERO & ACTIONS SECTION */}
          <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-amber-400 pl-3 uppercase italic">
                Daftar Dokumen Kinerja
              </h3>
              <p className="mt-1 text-sm text-gray-400 font-bold uppercase tracking-widest pl-4">
                Atur dokumen perencanaan dan pelaporan realisasi kegiatan Anda
                di sini.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              {canPerformActions && (
                <Link
                  href={route("reports.store")}
                  method="post"
                  as="button"
                  className="inline-flex items-center px-6 py-3 bg-blue-900 border border-transparent rounded-xl font-black text-xs text-white uppercase tracking-widest hover:bg-blue-950 focus:outline-none transition ease-in-out duration-150 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5 mr-1 text-amber-400" />
                  Buat Rencana Baru
                </Link>
              )}
            </div>
          </div>

          {/* Import Section (Conditional) */}
          {allowImport && (
            <div className="bg-amber-400/5 p-8 shadow-sm sm:rounded-3xl border-2 border-dashed border-amber-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-blue-900 p-4 rounded-2xl shadow-xl">
                    <CloudArrowUpIcon className="h-8 w-8 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tighter text-blue-900 uppercase italic">
                      Import Program Excel
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic mt-1 leading-relaxed">
                      Lakukan import massal data program dari file Excel (.xlsx) untuk mempercepat pengisian rencana.
                    </p>
                    <a
                      href="/users/export-template"
                      target="_blank"
                      className="inline-flex items-center mt-3 text-[10px] font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all uppercase tracking-widest italic"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" /> Unduh
                      Template
                    </a>
                  </div>
                </div>

                <form
                  onSubmit={handleImport}
                  className="flex flex-col sm:flex-row items-end gap-3 flex-1 max-w-2xl bg-white p-6 rounded-2xl shadow-inner border border-amber-100"
                >
                  <div className="w-full space-y-1">
                    <label className="text-[9px] font-black text-blue-900/60 uppercase ml-2 tracking-widest italic">
                      Pilih File Excel / CSV
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setImportData("file", e.target.files[0])}
                      className="w-full h-12 bg-gray-50 border-gray-100 rounded-xl text-[10px] p-2 pr-4 shadow-sm"
                      required
                    />
                    {importErrors.file && (
                      <div className="text-red-500 text-[10px] uppercase font-black italic mt-1 ml-2">
                        {importErrors.file}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="h-12 px-8 bg-blue-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-950 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
                  >
                    <DocumentArrowUpIcon className="w-4 h-4" />
                    {processing ? "PROSES..." : "IMPORT"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TABLE SECTION */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest italic border-r border-blue-950/30"
                    >
                      Pemilik Laporan
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest italic border-r border-blue-950/30"
                    >
                      Gugus Mutu
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest italic border-r border-blue-950/30"
                    >
                      Periode
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest italic border-r border-blue-950/30"
                    >
                      Jmh Kegiatan
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest italic border-r border-blue-950/30"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest italic"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {reports && reports.length > 0 ? (
                    reports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-blue-50/20 transition duration-150 group"
                      >
                        <td className="px-6 py-6 whitespace-nowrap border-r border-gray-50">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 font-black text-xs shadow-md">
                              {report.user?.name
                                ? report.user.name.charAt(0)
                                : "U"}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                                {report.user?.name || "Anda"}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">
                                {report.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap border-r border-gray-50">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-gray-50 text-blue-900 border border-gray-200 uppercase tracking-widest">
                            {report.user?.gugus_mutu?.name || "Umum"}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap border-r border-gray-50">
                          <div className="text-sm font-black text-blue-900 uppercase italic tracking-tighter underline decoration-amber-400 decoration-4 underline-offset-4">
                            {report.period?.month_year || "Tanpa Periode"}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap border-r border-gray-50">
                          <div className="text-[11px] text-gray-500 font-black uppercase tracking-widest">
                            {report.activities?.length || 0} Aktifitas
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap border-r border-gray-50">
                          <span
                            className={
                              "px-3 py-1.5 inline-flex text-[10px] font-black rounded-lg border shadow-sm uppercase tracking-widest " +
                              getStatusStyle(report.approval_status)
                            }
                          >
                            {getStatusText(report.approval_status)}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-center text-sm font-medium space-x-2 flex justify-center items-center">
                          <Link
                            href={"/Project/" + report.id}
                            className="inline-flex items-center px-4 py-2 border border-blue-900 rounded-xl text-blue-900 font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all shadow-sm"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            {canPerformActions &&
                            report.approval_status === "Draft"
                              ? "Input Capaian"
                              : "Lihat Detail"}
                          </Link>

                          {canPerformActions &&
                            (report.approval_status === "Draft" ||
                              report.approval_status.includes("Rejected")) && (
                              <div className="relative inline-block text-left group/btn">
                                <button className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-xl font-black text-[10px] text-white uppercase tracking-widest hover:bg-green-700 transition-all shadow-md">
                                  <ArrowPathIcon className="w-4 h-4 mr-2" />{" "}
                                  Kirim
                                </button>

                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-50 opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all duration-200 border border-gray-100">
                                  <div className="py-2">
                                    <button
                                      onClick={() => submitAction(report.id, "plan")}
                                      className="block w-full text-left px-5 py-3 text-[11px] font-black text-gray-700 hover:bg-green-50 hover:text-green-900 border-b border-gray-50 uppercase tracking-widest italic"
                                    >
                                      Ajukan Rencana
                                    </button>
                                    <button
                                      onClick={() => submitAction(report.id, "report")}
                                      className="block w-full text-left px-5 py-3 text-[11px] font-black text-gray-700 hover:bg-green-50 hover:text-green-900 uppercase tracking-widest italic"
                                    >
                                      Ajukan Laporan
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
                      <td colSpan="6" className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="rounded-full bg-gray-50 p-6 mb-4 border border-gray-100 shadow-inner">
                            <ArrowPathIcon className="h-10 w-10 text-gray-300" />
                          </div>
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] italic mb-2">
                            Belum ada data Projek/Laporan
                          </h3>
                          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                            Mulai dengan membuat rencana kegiatan pertama Anda.
                          </p>
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
