import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentArrowUpIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";

export default function Show({ auth, report, userRole, allowImport }) {
  const {
    data,
    setData,
    post,
    put,
    delete: destroy,
    reset,
    errors,
    clearErrors,
  } = useForm({
    task_name: "",
    description: "",
    target_count: "",
    target_unit: "dokumen",
    start_date: "",
    end_date: "",
    rkkl_code: "",
    id: null, // For editing
  });

  const {
      data: importData,
      setData: setImportData,
      post: postImport,
      processing: importProcessing,
      reset: resetImport,
  } = useForm({
      file: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const isEditable =
    userRole === "admin" ||
    userRole === "super-admin" ||
    ((userRole === "staff" || userRole === "manager") &&
      (report.approval_status === "Draft" ||
        report.approval_status.includes("Rejected")));

  const openModal = (activity = null) => {
    if (activity) {
      setIsEdit(true);
      setData({
        id: activity.id,
        task_name: activity.task_name,
        description: activity.description,
        target_count: activity.target_count,
        target_unit: activity.target_unit,
        start_date: activity.start_date,
        end_date: activity.end_date,
        rkkl_code: activity.rkkl_code,
      });
    } else {
      setIsEdit(false);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearErrors();
    reset();
  };

  const submit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(route("activities.update", data.id), {
        onSuccess: () => closeModal(),
      });
    } else {
      post(route("activities.store", report.id), {
        onSuccess: () => closeModal(),
      });
    }
  };

  const deleteActivity = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      router.delete(route("activities.destroy", id), { preserveScroll: true });
    }
  };

  const handleImport = (e) => {
    e.preventDefault();
    postImport(route("import.program"), {
       onSuccess: () => resetImport(),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Detail Projek - ${report.period.month_year}`} />

      <div className="py-12 bg-gray-50 flex-1 min-h-screen">
        <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8 space-y-8">
          {/* HEADER INFO */}
          <div className="bg-white p-8 shadow-sm sm:rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="bg-blue-900 h-16 w-1 border-4 border-amber-400 rounded-full" />
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-blue-900 uppercase italic">
                    Informasi Pelapor
                  </h3>
                  <div className="flex flex-wrap gap-10 mt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        DIISI OLEH
                      </p>
                      <p className="text-sm font-black text-blue-900 uppercase italic">
                        {report.user.name} -{" "}
                        {report.user.gugus_mutu?.name || "UMUM"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        PERIODE TARGET
                      </p>
                      <p className="text-sm font-black text-blue-900 uppercase italic">
                        {report.period.month_year}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        STATUS SEKARANG
                      </p>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-lg border border-amber-200">
                        {report.approval_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={route("dashboard")}
                  className="p-4 bg-white text-blue-900 border border-gray-100 rounded-2xl hover:bg-gray-50 transition shadow-sm"
                >
                  <ChevronDoubleLeftIcon className="w-5 h-5" />
                </Link>
                {isEditable && (
                  <button
                    onClick={() => openModal()}
                    className="inline-flex items-center px-10 py-4 bg-blue-900 border border-transparent rounded-[20px] font-black text-xs text-white uppercase tracking-widest hover:bg-blue-950 transition shadow-2xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-3 text-amber-400" /> Tambah
                    Baris Baru
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Import Section (Conditional) */}
          {allowImport && isEditable && (
            <div className="bg-white p-8 shadow-sm sm:rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/20 to-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                     <div className="flex items-center space-x-5">
                          <div className="bg-amber-400 p-3 rounded-2xl shadow-lg border-2 border-white">
                               <CloudArrowUpIcon className="h-6 w-6 text-blue-900" />
                          </div>
                          <div>
                               <h4 className="text-lg font-black text-blue-900 uppercase italic tracking-tighter">Import Program Cepat</h4>
                               <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Gunakan file Excel untuk mengisi banyak kegiatan sekaligus.</p>
                               <a href="/users/export-template" className="text-[9px] font-black text-blue-700 uppercase mt-2 block hover:underline">Unduh Template Excel</a>
                          </div>
                     </div>
                     <form onSubmit={handleImport} className="flex-1 max-w-xl flex items-center gap-2">
                          <input 
                            type="file" 
                            onChange={e => setImportData('file', e.target.files[0])}
                            className="flex-1 bg-white border border-gray-100 h-12 rounded-xl px-4 text-[10px] items-center flex"
                            required
                          />
                          <button 
                            type="submit" 
                            disabled={importProcessing}
                            className="bg-blue-900 text-white px-8 h-12 rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-blue-950 disabled:opacity-50"
                          >
                             {importProcessing ? 'LOADING...' : 'IMPORT'}
                          </button>
                     </form>
                </div>
            </div>
          )}

          {/* TABLE SECTION */}
          <div className="bg-white p-2 shadow-sm sm:rounded-[32px] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-blue-900 text-white font-black uppercase text-[10px] tracking-widest italic border-b border-blue-950">
                  <tr>
                    <th className="px-6 py-6 border-r border-blue-950/30">
                      KODE RKKL
                    </th>
                    <th className="px-6 py-6 border-r border-blue-950/30">
                      TASK NAME
                    </th>
                    <th className="px-6 py-6 border-r border-blue-950/30">
                      DESKRIPSI
                    </th>
                    <th className="px-6 py-6 text-center border-r border-blue-950/30">
                      TARGET
                    </th>
                    <th className="px-6 py-6 border-r border-blue-950/30">
                      JADWAL
                    </th>
                    {isEditable && (
                      <th className="px-6 py-6 text-center">OPSI</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {report.activities && report.activities.length > 0 ? (
                    report.activities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-blue-50/20 transition-all group"
                      >
                        <td className="px-6 py-6 border-r border-gray-50">
                          <span className="text-[10px] font-black text-blue-900/40 uppercase">
                            {activity.rkkl_code || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50 min-w-[250px]">
                          <p className="font-black text-blue-900 text-[13px] uppercase tracking-tighter leading-tight italic">
                            {activity.task_name}
                          </p>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          <p className="text-[11px] text-gray-500 italic">
                            {activity.description || "N/A"}
                          </p>
                        </td>
                        <td className="px-6 py-6 text-center border-r border-gray-50">
                          <p className="text-sm font-black text-blue-900">
                            {activity.target_count}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase italic">
                            {activity.target_unit}
                          </p>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase italic">
                            <span>{activity.start_date}</span>
                            <span>→</span>
                            <span className="text-blue-900 underline decoration-amber-400">
                              {activity.end_date}
                            </span>
                          </div>
                        </td>
                        {isEditable && (
                          <td className="px-6 py-6 whitespace-nowrap text-center space-x-2">
                            <button
                              onClick={() => openModal(activity)}
                              className="p-3 bg-blue-50 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transition-all shadow-sm"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteActivity(activity.id)}
                              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isEditable ? 6 : 5} className="px-6 py-24 text-center">
                        <p className="text-gray-300 font-black uppercase tracking-[0.8em] italic animate-pulse">
                          BELUM ADA KEGIATAN
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT/TAMBAH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-blue-900/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-white/20">
            <div className="p-10">
              <h2 className="text-3xl font-black text-blue-900 uppercase italic mb-8 border-b-8 border-amber-400 inline-block pb-2 tracking-tighter">
                {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
              </h2>

              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Nama Kegiatan / Milestone
                    </label>
                    <input
                      type="text"
                      className="w-full h-16 bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner px-6"
                      value={data.task_name}
                      onChange={(e) => setData("task_name", e.target.value)}
                      required
                    />
                    {errors.task_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.task_name}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner p-6 h-32"
                      value={data.description}
                      onChange={(e) => setData("description", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Kode RKKL (Opsional)
                    </label>
                    <input
                      type="text"
                      className="w-full h-16 bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner px-6"
                      value={data.rkkl_code}
                      onChange={(e) => setData("rkkl_code", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Target (Angka)
                    </label>
                    <input
                      type="number"
                      className="w-full h-16 bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner px-6"
                      value={data.target_count}
                      onChange={(e) => setData("target_count", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Satuan
                    </label>
                    <input
                      type="text"
                      className="w-full h-16 bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner px-6"
                      value={data.target_unit}
                      onChange={(e) => setData("target_unit", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Mulai Pelaksanaan
                    </label>
                    <input
                      type="date"
                      className="w-full h-16 bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner px-6"
                      value={data.start_date}
                      onChange={(e) => setData("start_date", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Akhir Pelaksanaan
                    </label>
                    <input
                      type="date"
                      className="w-full h-16 bg-gray-50 border-gray-100 rounded-2xl text-sm font-black text-blue-900 focus:ring-amber-400 focus:border-amber-400 shadow-inner px-6"
                      value={data.end_date}
                      onChange={(e) => setData("end_date", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    type="submit"
                    className="flex-1 h-20 bg-blue-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-950 transition shadow-2xl"
                  >
                    Simpan Data
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-10 h-20 bg-gray-100 text-gray-400 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
