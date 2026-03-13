const fs = require('fs');

function replace(file, search, replaceStr) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(search, replaceStr);
    fs.writeFileSync(file, content);
}

// 5. Reports/Index.jsx
replace(
    'resources/js/Pages/Reports/Index.jsx',
    `{(userRole === 'staff' || userRole === 'admin') && (`,
    `{(userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (`
);

replace(
    'resources/js/Pages/Reports/Index.jsx',
    `{(userRole === 'staff' || userRole === 'admin') && report.approval_status === 'Draft' ? 'Input Capaian' : 'Lihat Detail'}`,
    `{(userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && report.approval_status === 'Draft' ? 'Input Capaian' : 'Lihat Detail'}`
);

replace(
    'resources/js/Pages/Reports/Index.jsx',
    `{(userRole === 'staff' || userRole === 'admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')) && (`,
    `{(userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')) && (`
);

console.log('Patch Index completed successfully.');
