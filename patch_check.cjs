const fs = require('fs');
let file = 'resources/js/Pages/Reports/Show.jsx';
let content = fs.readFileSync(file, 'utf8');

let search = `const isEditable = (userRole === 'admin' || userRole === 'super-admin') || ((userRole === 'staff' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')));`;
// Wait, in previous patch we did:
// let search = `const isEditable = (userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));`;
// let replaceStr = `const isEditable = (userRole === 'admin' || userRole === 'super-admin') || ((userRole === 'staff' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')));`;

// Let's print out isEditable to see its exact form

console.log(content.match(/const isEditable.*/g)[0]);
