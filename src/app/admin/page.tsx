"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Wrench, 
  AlertCircle, 
  ShieldAlert, 
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserCheck,
  Package,
  Gavel,
  ChevronRight
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

const businessMetrics = {
  registeredUsers: 12840,
  activeUsers: 4320,
  sellers: 980,
  professionals: 420,
  publishedProducts: 5400,
  activeServices: 860,
  monthlyOperations: 2500,
  averageTicket: 65000,
  monthlyGMV: 162500000,
  takeRate: 0.12,
  monthlyGrossRevenue: 19500000,
  featuredRevenue: 2500000,
  logisticsMargin: 1500000,
  professionalSubscriptions: 1200000
};

const gmvData = [
  { name: "Ene", gmv: 120000000 },
  { name: "Feb", gmv: 135000000 },
  { name: "Mar", gmv: 142000000 },
  { name: "Abr", gmv: 162500000 },
];

const categoryData = [
  { name: "Tecno", value: 45 },
  { name: "Hogar", value: 30 },
  { name: "Servicios", value: 15 },
  { name: "Otros", value: 10 },
];

export default function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Top Bar */}
      <div className="bg-black text-white py-6 px-8 flex justify-between items-center shadow-lg">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">AD</div>
            <h1 className="text-xl font-black tracking-tight uppercase">Admin Panel <span className="text-gray-500">v1.2.0</span></h1>
         </div>
         <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
               <span>System Status: <span className="text-green-500">Optimal</span></span>
               <span>Cache: <span className="text-green-500">Hit (94%)</span></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700"></div>
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">
         {/* KPI Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign className="w-6 h-6" /></div>
                  <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                     <ArrowUpRight className="w-3 h-3 mr-1" />
                     14.2%
                  </div>
               </div>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">Monthly GMV</span>
               <div className="text-3xl font-black text-gray-900">{formatPrice(businessMetrics.monthlyGMV)}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><Users className="w-6 h-6" /></div>
                  <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                     <ArrowUpRight className="w-3 h-3 mr-1" />
                     8.5%
                  </div>
               </div>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">Active Users</span>
               <div className="text-3xl font-black text-gray-900">{businessMetrics.activeUsers.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Activity className="w-6 h-6" /></div>
                  <div className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                     <ArrowDownRight className="w-3 h-3 mr-1" />
                     2.1%
                  </div>
               </div>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">Operations</span>
               <div className="text-3xl font-black text-gray-900">{businessMetrics.monthlyOperations.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-50 rounded-2xl text-green-600"><TrendingUp className="w-6 h-6" /></div>
                  <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                     <ArrowUpRight className="w-3 h-3 mr-1" />
                     24%
                  </div>
               </div>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">Gross Revenue</span>
               <div className="text-3xl font-black text-gray-900">{formatPrice(businessMetrics.monthlyGrossRevenue)}</div>
            </div>
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">GMV Trend (4 Months)</h3>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> GMV</div>
                  </div>
               </div>
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gmvData}>
                       <defs>
                          <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <YAxis hide />
                       <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [formatPrice(value), 'GMV']}
                       />
                       <Area type="monotone" dataKey="gmv" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorGmv)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8">Revenue Breakdown</h3>
               <div className="space-y-6 flex-grow">
                  {[
                    { label: "Marketplace Commissions", value: 16250000, color: "bg-blue-600" },
                    { label: "Featured Ads", value: 2500000, color: "bg-purple-600" },
                    { label: "Professional Subscriptions", value: 1200000, color: "bg-orange-600" },
                    { label: "Logistics Margin", value: 1500000, color: "bg-green-600" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-gray-500">{item.label}</span>
                          <span className="text-gray-900">{formatPrice(item.value)}</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.color)} style={{ width: `${(item.value / businessMetrics.monthlyGrossRevenue) * 100}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Total Revenue</span>
                  <span className="text-xl font-black text-gray-900">{formatPrice(businessMetrics.monthlyGrossRevenue)}</span>
               </div>
            </div>
         </div>

         {/* Alerts and Critical Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
               <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-2">
                     <ShieldAlert className="w-5 h-5 text-red-600" />
                     <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Fraud & Anti-Bypass Alerts</h3>
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-full">4 New Events</span>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                    { user: "User_842", type: "Phone Injection", severity: "High", date: "2 mins ago", content: "te paso mi num 223..." },
                    { user: "Seller_Mdp", type: "External Link", severity: "Medium", date: "15 mins ago", content: "pagame por link..." },
                    { user: "User_112", type: "Contact Keyword", severity: "High", date: "42 mins ago", content: "arreglamos por fuera..." },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-2 h-2 rounded-full", alert.severity === "High" ? "bg-red-600 animate-pulse" : "bg-orange-500")}></div>
                          <div>
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">{alert.user}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alert.type}</span>
                             </div>
                             <p className="text-xs text-gray-500 italic">"{alert.content}"</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-400">{alert.date}</span>
                          <button className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Review</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Open Disputes</h3>
               </div>
               <div className="p-6 space-y-6">
                  {[
                    { id: "DISP-882", reason: "Product damaged", status: "Mediation" },
                    { id: "DISP-879", reason: "Professional no-show", status: "Evidence Required" }
                  ].map((disp, i) => (
                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                       <div>
                          <span className="block text-xs font-black text-blue-600">#{disp.id}</span>
                          <span className="text-sm font-bold text-gray-900">{disp.reason}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">{disp.status}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-all" />
                       </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all">
                     View All Claims
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
