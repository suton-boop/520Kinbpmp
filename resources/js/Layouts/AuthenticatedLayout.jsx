import ApplicationLogo from '@/Components/ApplicationLogo';
import { HomeIcon, BriefcaseIcon, CurrencyDollarIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navigation = [
        { name: 'Home', href: route('dashboard'), icon: HomeIcon, active: route().current('dashboard') },
        { name: 'Project', href: route('reports.index'), icon: BriefcaseIcon, active: route().current('reports.*') },
        { name: 'Gugus Mutu', href: route('gugus-mutu-report.index'), icon: AcademicCapIcon, active: route().current('gugus-mutu-report.*') },
        { name: 'Anggaran', href: route('anggaran'), icon: CurrencyDollarIcon, active: route().current('anggaran') },
        { name: 'Users', href: route('users.index'), icon: UserGroupIcon, active: route().current('users.*') }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-x-hidden">
            <header className="bg-amber-400 h-16 sticky top-0 z-50 shadow-md border-b border-amber-500">
                <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link href={route('dashboard')} className="text-xl font-black text-blue-900 uppercase tracking-tighter">Dashboardkin 520</Link>
                        <nav className="hidden md:flex items-center space-x-2">
                             {navigation.map(m => (
                                <Link key={m.name} href={m.href} className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all ${m.active ? 'bg-blue-900 text-white shadow-lg border border-blue-950 font-black' : 'text-blue-900 hover:bg-amber-500/80 hover:font-black'}`}>
                                    <m.icon className={`h-4 w-4 ${m.active ? 'text-amber-400' : 'text-blue-900'}`} /> 
                                    <span className="uppercase text-[11px] tracking-widest">{m.name}</span>
                                </Link>
                             ))}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block text-[10px] font-black uppercase text-blue-900/60 border-r border-amber-500/50 pr-4">{user.email}</div>
                        <Link href={route('logout')} method="post" as="button" className="bg-red-600 text-white text-[10px] font-black px-5 py-2 rounded-xl shadow-lg hover:bg-red-700 active:scale-95 transition-all">LOGOUT</Link>
                        <div className="bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-lg border border-amber-500/30 text-xs font-black text-blue-900 shadow-sm uppercase tracking-widest">
                             2026
                        </div>
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="md:hidden p-2 text-blue-900"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden bg-amber-400 border-t border-amber-500 shadow-xl'}>
                    <div className="p-4 space-y-2">
                         {navigation.map(m => (
                            <Link key={m.name} href={m.href} className={`flex items-center space-x-4 p-4 rounded-xl ${m.active ? 'bg-blue-900 text-white shadow-lg' : 'text-blue-900 hover:bg-amber-500'}`}>
                                <m.icon className={`h-5 w-5 ${m.active ? 'text-amber-400' : 'text-blue-900'}`} />
                                <span className="uppercase text-[11px] font-black tracking-widest">{m.name}</span>
                            </Link>
                         ))}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
    );
}
