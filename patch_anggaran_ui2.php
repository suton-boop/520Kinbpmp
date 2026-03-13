<?php
$f = 'resources/js/Pages/Anggaran/Index.jsx';
$c = file_get_contents($f);

// Replacement 1
$old1 = <<<EOF
        parent_id: '',
        urut: '',
        kode: '',
        tipe: '',
        nomenklatur: '',
        volume: '',
        pelaksanaan: '',
        anggaran_alokasi: '',
        anggaran_realisasi: '',
    });
EOF;

$new1 = <<<EOF
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
EOF;

$c = str_replace($old1, $new1, $c);

// Replacement 2
$old2 = <<<EOF
    const openAddModal = (parentId = null) => {
        reset();
        setModalMode('add');
        setData('parent_id', parentId || '');
        setIsModalOpen(true);
    };
EOF;

$new2 = <<<EOF
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
EOF;

$c = str_replace($old2, $new2, $c);

// Replacement 3
$old3 = <<<EOF
            anggaran_alokasi: item.anggaran_alokasi || '',
            anggaran_realisasi: item.anggaran_realisasi || '',
        });
        setIsModalOpen(true);
    };
EOF;

$new3 = <<<EOF
            anggaran_alokasi: item.anggaran_alokasi || '',
            anggaran_realisasi: item.anggaran_realisasi || '',
            kelengkapan: item.kelengkapan || Array(12).fill(false),
        });
        setIsModalOpen(true);
    };
EOF;

$c = str_replace($old3, $new3, $c);

// Replacement 4
$old4 = <<<EOF
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
                    </div>

                    <div className="mt-6 flex justify-end">
EOF;

$new4 = <<<EOF
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
EOF;

$c = str_replace($old4, $new4, $c);

file_put_contents($f, $c);
echo "File patched successfully.\n";
?>
