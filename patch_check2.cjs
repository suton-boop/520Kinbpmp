const fs = require('fs');
let file = 'resources/js/Pages/Reports/Show.jsx';
let content = fs.readFileSync(file, 'utf8');

let search = `                            {isEditable && (
                                <button onClick={openAddModal} className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors font-medium shadow-sm flex items-center">
                                    <PlusIcon className="w-4 h-4 mr-1"/> Tambah Baris
                                </button>
                            )}`;

if (content.includes(search)) {
    console.log("Found Tambah Baris block");
} else {
    console.log("NOT FOUND Tambah Baris block");
}

let search2 = `{isEditable ? (
                                                        <div className="flex items-center justify-center space-x-2">`;
if (content.includes(search2)) {
    console.log("Found isEditable inside table");
} else {
    console.log("NOT FOUND isEditable inside table");
}

