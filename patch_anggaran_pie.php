<?php
$f = 'resources/js/Pages/Anggaran/Index.jsx';
$c = file_get_contents($f);

// 1. Add imports
$importOld = "import React, { useState } from 'react';";
$importNew = "import React, { useState } from 'react';\nimport { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';";
$c = str_replace($importOld, $importNew, $c);

// 2. Add calculations before return
$calcOld = "    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];";
$calcNew = "    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const totalAlokasi = anggaranData ? anggaranData.reduce((acc, curr) => acc + Number(curr.anggaran_alokasi), 0) : 0;
    const totalRealisasi = anggaranData ? anggaranData.reduce((acc, curr) => acc + Number(curr.anggaran_realisasi), 0) : 0;
    const sisaAnggaran = totalAlokasi - totalRealisasi;
    
    const pieData = [
        { name: 'Realisasi', value: totalRealisasi, color: '#3b82f6' },
        { name: 'Sisa Anggaran', value: sisaAnggaran > 0 ? sisaAnggaran : 0, color: '#e5e7eb' },
    ];
    
    const chartFormatter = (value) => 'Rp ' + formatRp(value);";
$c = str_replace($calcOld, $calcNew, $c);

// 3. Add UI
$uiOld = "                    <div className=\"flex justify-end\">
                        <PrimaryButton onClick={() => openAddModal()} className=\"bg-blue-600 hover:bg-blue-700\">
                            <PlusIcon className=\"w-5 h-5 mr-1\" /> Tambah RO Utama
                        </PrimaryButton>
                    </div>";

$uiNew = "                    <div className=\"flex justify-between items-center\">
                        <h3 className=\"text-lg font-bold text-gray-800\">Ringkasan & Data Anggaran</h3>
                        <PrimaryButton onClick={() => openAddModal()} className=\"bg-blue-600 hover:bg-blue-700\">
                            <PlusIcon className=\"w-5 h-5 mr-1\" /> Tambah RO Utama
                        </PrimaryButton>
                    </div>
                    
                    <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-6\">
                        <div className=\"bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col justify-center\">
                            <div className=\"text-sm text-gray-500 font-medium uppercase tracking-wider mb-1\">Total Alokasi (Rp)</div>
                            <div className=\"text-3xl font-bold text-gray-800\">{formatRp(totalAlokasi)}</div>
                        </div>
                        <div className=\"bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col justify-center\">
                            <div className=\"text-sm text-gray-500 font-medium uppercase tracking-wider mb-1\">Total Realisasi (Rp)</div>
                            <div className=\"text-3xl font-bold text-blue-600\">{formatRp(totalRealisasi)}</div>
                            <div className=\"text-xs text-green-600 font-medium mt-2\">
                                {totalAlokasi > 0 ? ((totalRealisasi / totalAlokasi) * 100).toFixed(1) : 0}% Terserap
                            </div>
                        </div>
                        <div className=\"bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center h-48\">
                            <h4 className=\"text-xs font-bold text-gray-500 uppercase tracking-wider mb-2\">Grafik Serapan</h4>
                            <div className=\"w-full h-full min-h-[120px]\">
                                <ResponsiveContainer width=\"100%\" height=\"100%\">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx=\"50%\"
                                            cy=\"50%\"
                                            innerRadius={30}
                                            outerRadius={50}
                                            paddingAngle={2}
                                            dataKey=\"value\"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={\cell-\\} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={chartFormatter} />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>";

$c = str_replace($uiOld, $uiNew, $c);

file_put_contents($f, $c);
echo "OK\n";
?>
