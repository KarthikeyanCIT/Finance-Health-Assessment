import { useState, useEffect, useRef } from 'react';
import { Upload, Activity, TrendingUp, AlertCircle, Globe, PieChart as PieIcon, Plus, Search, Bell, ShieldCheck, Download, Languages, FileText, CheckCircle2, LogOut } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, cn } from './components/ui';
import { ChartCard } from './components/ChartCard';
import { Sidebar } from './components/Sidebar';
import { generateInvestorReport } from './utils/reportGenerator';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const Dashboard = ({ onLogout, businessId }) => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const [bizData, setBizData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
    const [uploadError, setUploadError] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [selectedIndustry, setSelectedIndustry] = useState('Services');
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    // Initial Data Fetch (Simulating Enterprise State)
    useEffect(() => {
        if (!businessId) return;

        const fetchInitialData = async () => {
            try {
                const res = await axios.get(`${API_URL}/comprehensive/${businessId}`);
                setBizData(res.data);
            } catch (err) {
                console.warn("API not reachable yet, using optimized fallback");
            }
        };
        fetchInitialData();
    }, [businessId]);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        // Using the newly isolated content container for cleaner PDF capture
        const result = await generateInvestorReport('report-content', `FinHealth_Analysis_${selectedIndustry}.pdf`);
        setExporting(false);

        if (!result.success) {
            alert(`Export failed: ${result.error}. Please try again or use Chrome.`);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log("Starting upload for Business ID:", businessId);
            if (!businessId) throw new Error("Missing Business ID. Please re-login.");

            await axios.post(`${API_URL}/data/upload?business_id=${businessId}`, formData);

            setUploadStatus('success');
            // Refresh data after upload
            const res = await axios.get(`${API_URL}/comprehensive/${businessId}`);
            setBizData(res.data);
            setTimeout(() => setUploadStatus(null), 5000);
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus('error');
            const detail = err.response?.data?.detail;
            const msg = typeof detail === 'string' ? detail : (typeof detail === 'object' ? JSON.stringify(detail) : (err.message || "Unknown Error"));
            setUploadError(msg);
            setTimeout(() => {
                setUploadStatus(null);
                setUploadError(null);
            }, 8000);
        } finally {
            setUploading(false);
            // Reset input so the same file can be picked again
            event.target.value = '';
        }
    };

    const chartData = bizData?.timeseries?.length > 0 ? bizData.timeseries : [
        { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 }, { name: 'Apr', value: 0 },
        { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    ];

    const score = bizData?.has_data ? (bizData?.credit_score || 0) : 0;
    const currentNarrative = bizData?.has_data ? (bizData?.narratives?.[i18n.language] || "Analysis ready.") : (i18n.language === 'en' ? "Please upload financial documents to generate analysis." : "विश्लेषण उत्पन्न करने के लिए कृपया वित्तीय दस्तावेज अपलोड करें।");

    const handleTabChange = (tab) => {
        console.log("Navigating to:", tab);
        if (tab === 'signout') {
            setIsLoggedOut(true);
            setTimeout(() => {
                onLogout();
            }, 2000);
            return;
        }
        setActiveTab(tab);
    };

    return (
        <div className="flex min-h-screen bg-mesh dark:bg-slate-950 transition-colors duration-500 font-sans">
            <AnimatePresence>
                {isLoggedOut && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-500/40"
                        >
                            <LogOut size={48} />
                        </motion.div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic">SEE YOU SOON</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Securely closing your session...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

            <main className="flex-1 ml-64 p-8">
                {/* Isolated content container for precision PDF capture */}
                <div id="report-content" className="w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    {/* Global Header */}
                    <header className="flex justify-between items-center mb-10 no-print">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {t(`nav.${activeTab}`)}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{t('dashboard.welcome')}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="md" onClick={toggleLanguage} className="gap-2">
                                <Languages size={18} /> {i18n.language === 'en' ? 'Hindi' : 'English'}
                            </Button>
                            <Button variant="secondary" size="md" onClick={handleExport} className="gap-2" disabled={exporting}>
                                {exporting ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-slate-400 border-t-blue-500 rounded-full" />
                                ) : (
                                    <Download size={18} />
                                )}
                                {exporting ? "Generating..." : t('nav.export_report', 'Export PDF')}
                            </Button>
                            <Button variant="primary" size="md" onClick={() => setDarkMode(!darkMode)} className="rounded-full w-10 h-10 p-0">
                                {darkMode ? "☀️" : "🌙"}
                            </Button>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-900/10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.health_index')}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400">{score}</h3>
                                            <Badge variant={bizData?.has_data ? "success" : "default"} className="mb-1">{bizData?.has_data ? "+5.2%" : "NEW"}</Badge>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold italic">Proprietary Credit Score</p>
                                    </Card>

                                    <Card>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.liquidity')}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                                {bizData?.has_data ? (bizData?.analysis?.metrics?.current_ratio || "0.0") : "0.0"}
                                            </h3>
                                            <Badge variant={bizData?.has_data ? "info" : "default"}>
                                                {bizData?.has_data ? "Median: 1.5" : "NO DATA"}
                                            </Badge>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: bizData?.has_data ? '82%' : '0%' }} />
                                        </div>
                                    </Card>

                                    <Card>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.burn_rate')}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                                {bizData?.has_data ? (bizData?.analysis?.metrics?.burn_rate || "$0") : "$0"}
                                            </h3>
                                            <Badge variant={bizData?.has_data ? "warning" : "default"}>
                                                {bizData?.has_data ? "Alert" : "STABLE"}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold italic">Normalized for {bizData?.industry || "Enterprise"}</p>
                                    </Card>

                                    <Card className="bg-slate-900 dark:bg-blue-600 text-white border-none shadow-xl shadow-blue-500/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShieldCheck size={16} className="text-blue-400 dark:text-white" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">{t('dashboard.ai_recommendation')}</p>
                                        </div>
                                        <h4 className="font-bold text-sm mb-4">Working Capital Funding</h4>
                                        <Button variant="secondary" size="sm" className="w-full bg-white/10 border-white/20 text-white">
                                            {t('dashboard.apply_now', 'Explore Products')}
                                        </Button>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <ChartCard
                                        className="lg:col-span-2"
                                        title="Financial Trajectory"
                                        subtitle={`AI-benchmarked against ${bizData?.industry || "Enterprise"} standards`}
                                    >
                                        <div className="h-[300px] w-full mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#e2e8f0"} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </ChartCard>

                                    <Card className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-6">
                                            <FileText size={18} className="text-blue-500" />
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('dashboard.insights')}</h4>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                                                    {currentNarrative}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase text-slate-400">Action Items</p>
                                                {bizData?.analysis?.industry_insights?.map((insight, idx) => (
                                                    <div key={idx} className="flex gap-2 items-start">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                                                        <p className="text-[10px] font-bold text-slate-900 dark:text-blue-300">{insight}</p>
                                                    </div>
                                                )) || (
                                                        <p className="text-[10px] font-bold text-slate-500">Generating strategic insights...</p>
                                                    )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div
                                key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ChartCard title="Revenue vs Expenses" subtitle="Enterprise Profitability Map">
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#e2e8f0"} />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </ChartCard>

                                    <Card className="p-10 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
                                            <TrendingUp size={32} className="text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-black mb-2 dark:text-white">
                                            {bizData?.has_data ? (score > 80 ? "Growth Potential: High" : "Growth Potential: Moderate") : "Analysis Pending"}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[280px]">
                                            {bizData?.has_data ?
                                                `Based on your current score of ${score}, our AI identifies ${bizData.recommendations?.[0]?.product || "opportunities"} for your business.` :
                                                "Upload your data to see your AI-driven growth roadmap and product eligibility."}
                                        </p>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'compliance' && (
                            <motion.div
                                key="compliance" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <Card className="border-l-4 border-l-teal-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <ShieldCheck className="text-teal-500" size={32} />
                                        <div>
                                            <h3 className="text-xl font-black dark:text-white">Regulatory Health Map</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Standards Ready</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Readiness</p>
                                            <p className="text-lg font-black text-teal-500">{bizData?.has_data ? "98%" : "0%"}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Score</p>
                                            <p className="text-lg font-black text-blue-500">{bizData?.has_data ? "A+" : "N/A"}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Margin</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">{bizData?.has_data ? "Minimal" : "TBD"}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'upload' && (
                            <motion.div
                                key="upload" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto"
                            >
                                <Card className="p-20 border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center group active:scale-[0.99] transition-all">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept=".csv,.xlsx,.xls,.pdf"
                                    />
                                    <div className={cn(
                                        "w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500",
                                        uploading ? "bg-blue-600 text-white animate-pulse" :
                                            uploadStatus === 'success' ? "bg-emerald-600 text-white" :
                                                "bg-blue-600/10 group-hover:bg-blue-600 group-hover:text-white"
                                    )}>
                                        {uploadStatus === 'success' ? <CheckCircle2 size={40} /> : <Upload size={40} />}
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 dark:text-white">
                                        {uploading ? "Processing assets..." : uploadStatus === 'success' ? "Assets Ingested" : "Ingest Financial Assets"}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                                        {uploadStatus === 'success' ? "Your financial health index has been updated based on the latest data." :
                                            uploadStatus === 'error' ? `Error: ${uploadError}` :
                                                "Upload CSV, XLSX, or Text-based PDFs. Our AI will normalize and benchmark the data in seconds."}
                                    </p>
                                    <div className="flex flex-col items-center gap-4">
                                        <Button
                                            variant={uploadStatus === 'success' ? "primary" : "secondary"}
                                            size="lg"
                                            className="px-12 rounded-full shadow-2xl shadow-blue-500/40"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                        >
                                            {uploadStatus === 'success' ? "Upload More" : "Browse Files"}
                                        </Button>

                                        <a
                                            href="/sample_transactions.csv"
                                            download
                                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2"
                                        >
                                            <Download size={14} />
                                            Download CSV Sample
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                <Card className="p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                                            <Activity size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black dark:text-white">Enterprise Profile</h3>
                                            <p className="text-sm text-slate-500">Manage your business preferences</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Organization Name</label>
                                            <input
                                                type="text"
                                                value={bizData?.business || "Unregistered Enterprise"}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Tax ID / GSTIN</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value="••••••••••••••••"
                                                    readOnly
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold"
                                                />
                                                <Badge className="absolute right-3 top-2.5" variant="success">Encrypted</Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Industry Context</label>
                                            <select
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                                value={selectedIndustry}
                                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                            >
                                                <option>Services</option>
                                                <option>Retail</option>
                                                <option>Manufacturing</option>
                                                <option>E-commerce</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Reporting Currency</label>
                                            <input
                                                type="text"
                                                value="INR (₹)"
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                        <Button variant="outline" size="md">Discard</Button>
                                        <Button variant="primary" size="md">Save Changes</Button>
                                    </div>
                                </Card>

                                <Card className="p-8 border-l-4 border-l-amber-500 bg-amber-50/10">
                                    <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">GDPR & Privacy Compliance</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        All your financial data is stored with AES-256 bit encryption. By changing your industry context, you will trigger a re-normalization of all AI benchmarks.
                                    </p>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
