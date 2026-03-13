import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, users }) {
    const { delete: destroy } = useForm();

    const deleteUser = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-lg font-medium">List of Users</h3>
                                <Link
                                    href={route('users.create')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Create User
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Gugus Mutu</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    {user.roles && user.roles.length > 0 ? user.roles.map(r => r.name).join(', ') : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.gugus_mutu ? user.gugus_mutu.name : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route('users.edit', user.id)}
                                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    {user.id !== auth.user.id && (
                                                        <button
                                                            onClick={(e) => deleteUser(e, user.id)}
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {users.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Links (Simplified) */}
                            <div className="mt-4 flex space-x-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'} ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
