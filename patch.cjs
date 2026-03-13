const fs = require('fs');

function replace(file, search, replaceStr) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(search, replaceStr);
    fs.writeFileSync(file, content);
}

// 1. ReportController.php
replace(
    'app/Http/Controllers/ReportController.php',
    `        if ($user->hasRole('admin')) {`,
    `        if ($user->hasRole(['admin', 'super-admin'])) {`
);

replace(
    'app/Http/Controllers/ReportController.php',
    `        if (!Auth::user()->hasRole('admin') && $report->user_id !== Auth::id()) abort(403);`,
    `        if (!Auth::user()->hasRole(['admin', 'super-admin']) && $report->user_id !== Auth::id()) abort(403);`
);

replace(
    'app/Http/Controllers/ReportController.php',
    `        // Memastikan user yg login adalah pemilik (Kecuali Admin/Manajer berhak ikut campur jika dibutuhkan)\n        if (!Auth::user()->hasRole('admin') && $report->user_id !== Auth::id()) abort(403);`,
    `        // Memastikan user yg login adalah pemilik (Kecuali Admin/Manajer berhak ikut campur jika dibutuhkan)\n        if (!Auth::user()->hasRole(['admin', 'super-admin']) && $report->user_id !== Auth::id()) abort(403);`
);

// 2. ApprovalController.php
replace(
    'app/Http/Controllers/ApprovalController.php',
    `        if ($user->hasRole('admin')) {`,
    `        if ($user->hasRole(['admin', 'super-admin'])) {`
);
replace(
    'app/Http/Controllers/ApprovalController.php',
    `        if (!Auth::user()->hasRole(['manager', 'admin'])) abort(403);`,
    `        if (!Auth::user()->hasRole(['manager', 'admin', 'super-admin'])) abort(403);`
);
replace(
    'app/Http/Controllers/ApprovalController.php',
    `        if (!Auth::user()->hasRole('admin')) abort(403);`,
    `        if (!Auth::user()->hasRole(['admin', 'super-admin'])) abort(403);`
);
// Another replace for Reject condition in ApprovalController
replace(
    'app/Http/Controllers/ApprovalController.php',
    `        if ($user->hasRole('admin')) {\n            $status = 'Rejected_Admin';`,
    `        if ($user->hasRole(['admin', 'super-admin'])) {\n            $status = 'Rejected_Admin';`
);

// 3. Show.jsx
replace(
    'resources/js/Pages/Reports/Show.jsx',
    `const isEditable = (userRole === 'staff' || userRole === 'admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));`,
    `const isEditable = (userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));`
);
replace(
    'resources/js/Pages/Reports/Show.jsx',
    `const canSubmitPlan = (userRole === 'staff' || userRole === 'admin' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));`,
    `const canSubmitPlan = (userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));`
);
replace(
    'resources/js/Pages/Reports/Show.jsx',
    `const canApproveManager = (userRole === 'manager' || userRole === 'admin') && report.approval_status === 'Pending_Manager';`,
    `const canApproveManager = (userRole === 'manager' || userRole === 'admin' || userRole === 'super-admin') && report.approval_status === 'Pending_Manager';`
);
replace(
    'resources/js/Pages/Reports/Show.jsx',
    `const canApproveAdmin = userRole === 'admin' && report.approval_status === 'Pending_Admin';`,
    `const canApproveAdmin = (userRole === 'admin' || userRole === 'super-admin') && report.approval_status === 'Pending_Admin';`
);

// 4. Index.jsx
replace(
    'resources/js/Pages/Approvals/Index.jsx',
    `const endpoint = userRole === 'admin' ? \`/approvals/\${id}/approve-admin\` : \`/approvals/\${id}/approve-manager\`;`,
    `const endpoint = (userRole === 'admin' || userRole === 'super-admin') ? \`/approvals/\${id}/approve-admin\` : \`/approvals/\${id}/approve-manager\`;`
);
replace(
    'resources/js/Pages/Approvals/Index.jsx',
    `header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Menunggu Persetujuan ({userRole === 'admin' ? 'Admin Pusat' : 'Manajer Gugus'})</h2>}`,
    `header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Menunggu Persetujuan ({(userRole === 'admin' || userRole === 'super-admin') ? 'Admin Pusat' : 'Manajer Gugus'})</h2>}`
);
replace(
    'resources/js/Pages/Approvals/Index.jsx',
    `(item.approval_status === 'Pending_Admin' && userRole === 'admin') ? (`,
    `(item.approval_status === 'Pending_Admin' && (userRole === 'admin' || userRole === 'super-admin')) ? (`
);

console.log('Patch completed successfully.');
