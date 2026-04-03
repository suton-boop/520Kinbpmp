import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0 overflow-hidden relative">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-amber-400 -skew-y-3 -translate-y-16 z-0 shadow-2xl border-b border-amber-500"></div>
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl z-0"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl z-0"></div>

            <div className="z-10 w-full sm:max-w-md mt-6 px-4">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="group">
                        <div className="bg-blue-900 p-5 rounded-[1.5rem] shadow-2xl group-hover:scale-110 transition-transform duration-500 border-2 border-amber-400">
                             <span className="text-3xl font-black text-amber-400 tracking-tighter uppercase">520</span>
                        </div>
                    </Link>
                    <h1 className="mt-6 text-2xl font-black text-blue-900 uppercase tracking-tighter">Dashboardkin 520</h1>
                    <div className="h-1 w-12 bg-amber-500 rounded-full mt-2"></div>
                </div>

                <div className="w-full bg-white/80 backdrop-blur-xl px-8 py-10 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] border border-white overflow-hidden relative">
                    {/* Subtle micro-glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 blur-2xl rounded-full"></div>
                    
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-[0.2em]">
                        &copy; 2026 BPMP PROVINSI KALIMANTAN TIMUR
                    </p>
                </div>
            </div>
        </div>
    );
}
