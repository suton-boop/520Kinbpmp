const fs = require('fs');
let file = 'resources/js/Pages/Reports/Show.jsx';
let content = fs.readFileSync(file, 'utf8');

let search = `const isEditable = (userRole === 'admin' || userRole === 'super-admin') || ((userRole === 'staff' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')));`;
let replaceStr = `const isEditable = (userRole === 'admin' || userRole === 'super-admin') || ((userRole === 'staff' || userRole === 'manager') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected')));`;

content = content.replace(search, replaceStr);

let oldEditable = `const isEditable = (userRole === 'staff' || userRole === 'admin' || userRole === 'super-admin') && (report.approval_status === 'Draft' || report.approval_status.includes('Rejected'));`;
if(content.includes(oldEditable)){
    content = content.replace(oldEditable, replaceStr);
}


fs.writeFileSync(file, content);

console.log('isEditable patched again to ensure safe state');
