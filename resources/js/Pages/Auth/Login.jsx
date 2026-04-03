import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="mb-6">
                <h2 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Selamat Datang Kembali</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Sistem Penjaminan Mutu Terpadu</p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-sm font-bold text-emerald-700 animate-pulse">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="EMAIL ADDRESS" className="text-[10px] font-black tracking-[0.2em] text-blue-900/60" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full px-5 py-4 bg-gray-50 border-transparent focus:border-amber-400 focus:bg-white focus:ring-0 rounded-2xl transition-all font-bold text-sm text-blue-900 placeholder:text-gray-300"
                        placeholder="user@bpmp.id"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2 text-[10px] font-bold uppercase tracking-widest py-1 px-3 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 inline-block" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="PASSWORD" className="text-[10px] font-black tracking-[0.2em] text-blue-900/60" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full px-5 py-4 bg-gray-50 border-transparent focus:border-amber-400 focus:bg-white focus:ring-0 rounded-2xl transition-all font-bold text-sm text-blue-900 placeholder:text-gray-300"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2 text-[10px] font-bold uppercase tracking-widest py-1 px-3 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 inline-block" />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                             <Checkbox
                                name="remember"
                                checked={data.remember}
                                className="h-5 w-5 rounded-lg border-2 border-gray-200 text-blue-900 focus:ring-offset-0 focus:ring-0 hover:border-blue-900 transition-colors"
                                onChange={(e) => setData('remember', e.target.checked)}
                             />
                        </div>
                        <span className="ms-3 text-[10px] font-black text-gray-400 group-hover:text-blue-900 uppercase tracking-[0.15em] transition-colors">
                            Remember Me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[10px] font-black text-amber-500 hover:text-blue-900 uppercase tracking-[0.15em] transition-colors underline decoration-2 underline-offset-4"
                        >
                            Reset Password
                        </Link>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className={`w-full bg-blue-900 text-amber-400 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 hover:scale-[1.02] hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span>{processing ? 'Processing...' : 'Secure Sign In'}</span>
                        {!processing && <ArrowRightIcon className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" /> }
                    </button>
                    
                    <div className="mt-8 flex items-center justify-center space-x-4 opacity-30 grayscale hover:grayscale-0 transition-all hover:opacity-100">
                         <div className="h-px bg-blue-900 flex-1"></div>
                         <span className="text-[8px] font-black text-blue-900 uppercase tracking-widest">Internal Portal</span>
                         <div className="h-px bg-blue-900 flex-1"></div>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
