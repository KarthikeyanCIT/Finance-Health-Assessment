import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, User, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import axios from 'axios';
import { Card, Button, Badge, cn } from './components/ui';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
        const BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

        console.log("[Production] Auth request to:", BASE_URL);
        try {
            if (!isLogin) {
                // Real Signup
                const res = await axios.post(`${BASE_URL}/auth/signup`, {
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.name || "Enterprise Lead"
                });
                onLogin(res.data.business_id);
            } else {
                // Real Login
                const res = await axios.post(`${BASE_URL}/auth/login`, {
                    email: formData.email,
                    password: formData.password
                });
                onLogin(res.data.business_id);
            }
        } catch (err) {
            console.error("Auth failed:", err);
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : "Authentication service unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-slate-900/50 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl overflow-hidden z-10"
            >
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col p-12 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <Activity size={28} />
                            </div>
                            <div className="leading-tight">
                                <h1 className="text-2xl font-black tracking-tighter text-white">FINHEALTH</h1>
                                <p className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase">Enterprise AI</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-4xl font-black text-white leading-tight mb-4">
                                    The Future of <br />
                                    <span className="text-blue-200">MSME Finance</span> is here.
                                </h2>
                                <p className="text-blue-100/70 font-medium leading-relaxed max-w-sm">
                                    Analyze, project, and optimize your business health with our proprietary AI engine.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: ShieldCheck, label: "AES-256 Secure" },
                                    { icon: Globe, label: "Multilingual" },
                                    { icon: Activity, label: "Real-time AI" },
                                    { icon: ArrowRight, label: "SME Focused" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                        <item.icon size={18} className="text-blue-200" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto relative z-10 pt-8 border-t border-white/10">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                +2k
                            </div>
                        </div>
                        <p className="text-xs text-blue-100/60 font-bold">Trusted by 2,000+ Indian SME Founders</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10">
                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                                {isLogin ? "Welcome Back" : "Create Account"}
                            </h3>
                            <p className="text-slate-500 font-bold text-sm">
                                {isLogin ? "Enter your enterprise credentials to continue." : "Start your financial transformation today."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Aditya Sharma"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                                                required={!isLogin}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Enterprise Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        placeholder="ceo@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                    {isLogin && (
                                        <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">Forgot?</button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full py-4 rounded-2xl shadow-xl shadow-blue-600/20 group relative overflow-hidden"
                                disabled={loading}
                            >
                                <span className={cn("relative z-10 flex items-center justify-center gap-2", loading ? "opacity-0" : "opacity-100")}>
                                    {isLogin ? "Sign In" : "Register Enterprise"}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
                                        />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 font-bold text-xs">
                                {isLogin ? "Don't have an enterprise account?" : "Already have an account?"}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest font-black"
                                >
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                        </div>

                        <div className="mt-12 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-800" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Industry standard compliance</p>
                            <div className="flex-1 h-px bg-slate-800" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
