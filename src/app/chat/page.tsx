"use client";

import React, { useState, useEffect } from "react";
import { 
  Send, 
  Phone, 
  Info, 
  ShieldCheck, 
  Paperclip,
  Image as ImageIcon,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  User,
  Star,
  MessageSquare
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import StatusTracker, { OperationStatus } from "@/components/marketplace/StatusTracker";

const MOCK_CONVERSATIONS = [
  { id: "c1", name: "Sofi Iturralde", lastMsg: "Ya salgo para allá, llego en 40 min.", time: "14:02", unread: 0, online: true, status: "FONDEADO", initials: "SI", color: "#a855f7" },
  { id: "c2", name: "TechStore MDP", lastMsg: "El iPhone ya fue entregado al correo.", time: "Ayer", unread: 0, online: false, status: "EN_CURSO", initials: "TS", color: "#1e293b" },
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("c1");
  const [msgInput, setMsgInput] = useState("");
  const [status, setStatus] = useState<OperationStatus>("FONDEADO");
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "¡Hola! Soy Sofi. Recibí el pedido, ya salgo para allá.", time: "14:02" },
    { id: 2, sender: "me", text: "Dale, gracias. La dirección es Independencia 2350, 4° B.", time: "14:03" },
  ]);

  const [alert, setAlert] = useState<{ type: "warning" | "error", text: string } | null>(null);

  const handleSend = () => {
    if (!msgInput.trim()) return;
    const newMsg = { id: Date.now(), sender: "me", text: msgInput, time: "Ahora" };
    setMessages([...messages, newMsg]);
    setMsgInput("");
  };

  const advanceStatus = () => {
    if (status === "FONDEADO") setStatus("EN_CURSO");
    else if (status === "EN_CURSO") setStatus("ESPERANDO_LIBERACION");
    else if (status === "ESPERANDO_LIBERACION") setStatus("LIBERADO");
  };

  const getPrimaryCta = () => {
    if (status === "FONDEADO") return { label: "El profesional llegó · Empezar trabajo", icon: CheckCircle2, onClick: advanceStatus };
    if (status === "EN_CURSO") return { label: "Marcar trabajo terminado", icon: CheckCircle2, onClick: advanceStatus };
    if (status === "ESPERANDO_LIBERACION") return { label: "Dar OK y liberar pago", icon: Unlock, onClick: advanceStatus };
    return null;
  };

  const cta = getPrimaryCta();

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 h-[calc(100vh-140px)] md:py-6">
      <div className="bg-white rounded-none md:rounded-[2.5rem] shadow-2xl border border-gray-100 flex h-full overflow-hidden">
        
        {/* Sidebar */}
        <aside className={cn(
          "w-full md:w-80 lg:w-96 border-r border-gray-50 flex flex-col transition-all",
          activeTab ? "hidden md:flex" : "flex"
        )}>
           <div className="p-8 border-b border-gray-50">
              <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter">Mensajes</h1>
           </div>
           
           <div className="flex-grow overflow-y-auto">
              {MOCK_CONVERSATIONS.map(conv => (
                <button 
                  key={conv.id}
                  onClick={() => setActiveTab(conv.id)}
                  className={cn(
                    "w-full p-6 flex gap-4 hover:bg-gray-50 transition-all text-left relative",
                    activeTab === conv.id ? "bg-blue-50/40" : ""
                  )}
                >
                   {activeTab === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-r-full"></div>}
                   <div className="relative shrink-0">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm", activeTab === conv.id ? "shadow-blue-200" : "")} style={{backgroundColor: conv.color}}>
                        {conv.initials}
                      </div>
                      {conv.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>}
                   </div>
                   <div className="flex-grow min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="font-black text-gray-900 truncate tracking-tight">{conv.name}</h4>
                         <span className="text-[10px] text-gray-400 font-bold uppercase">{conv.time}</span>
                      </div>
                      <p className="text-xs truncate text-gray-500 font-medium">
                        {conv.lastMsg}
                      </p>
                   </div>
                </button>
              ))}
           </div>
        </aside>

        {/* Chat Area */}
        <main className={cn(
          "flex-grow flex flex-col transition-all bg-white relative",
          !activeTab ? "hidden md:flex" : "flex"
        )}>
           {activeTab ? (
             <>
                {/* Chat Header */}
                <header className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setActiveTab("")} className="md:hidden p-2 text-gray-400">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-500 border border-gray-50">
                        {MOCK_CONVERSATIONS.find(c => c.id === activeTab)?.initials}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 leading-none mb-1 tracking-tight">{MOCK_CONVERSATIONS.find(c => c.id === activeTab)?.name}</h3>
                        <span className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          En línea
                        </span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-95"><Phone className="w-5 h-5" /></button>
                      <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-95"><Info className="w-5 h-5" /></button>
                   </div>
                </header>

                {/* Operation Context (Sticky under header) */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orden:</span>
                         <span className="text-xs font-bold text-gray-900 font-mono">#MDP-88219</span>
                      </div>
                      <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                         <AlertTriangle className="w-3 h-3" /> Reportar Problema
                      </button>
                   </div>
                   <StatusTracker status={status} />
                </div>

                {/* Messages Container */}
                <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-gray-50/20">
                   {/* Safety Notice */}
                   <div className="max-w-md mx-auto bg-blue-900 rounded-3xl text-white p-6 flex flex-col items-center text-center gap-4 shadow-xl mb-12">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="space-y-2">
                         <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Pago Protegido MDP</p>
                         <p className="text-sm font-medium leading-relaxed opacity-90">
                            Tu plata está en custodia. No la liberes hasta que el trabajo esté terminado. 
                            Nunca pagues por fuera de la app para no perder tu cobertura.
                         </p>
                      </div>
                   </div>

                   {messages.map((msg) => (
                     <div key={msg.id} className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.sender === "me" ? "ml-auto items-end" : "items-start"
                     )}>
                        <div className={cn(
                          "px-5 py-4 rounded-[1.5rem] text-sm font-medium shadow-sm leading-relaxed",
                          msg.sender === "me" 
                            ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100" 
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-gray-100"
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-tighter">{msg.time}</span>
                     </div>
                   ))}

                   {status === "LIBERADO" && (
                     <div className="max-w-md mx-auto bg-green-50 border border-green-100 rounded-3xl p-6 text-center animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-gray-900 mb-2">¡Pago Liberado!</h4>
                        <p className="text-sm font-medium text-gray-500 mb-6">El profesional ya recibió sus fondos. ¡Gracias por usar MDP Market!</p>
                        <div className="flex gap-2 justify-center">
                           {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
                        </div>
                     </div>
                   )}
                </div>

                {/* Chat Input & CTA */}
                <footer className="p-6 bg-white border-t border-gray-100 space-y-4">
                   {cta && (
                     <button 
                      onClick={cta.onClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
                     >
                        <cta.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm uppercase tracking-widest">{cta.label}</span>
                     </button>
                   )}
                   
                   <div className="flex items-center gap-4">
                      <div className="flex-grow bg-gray-50 rounded-[1.5rem] border border-gray-100 p-2 flex items-center gap-2">
                         <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                         <input 
                          type="text"
                          value={msgInput}
                          onChange={(e) => setMsgInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSend()}
                          placeholder="Escribí un mensaje..." 
                          className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2 px-2 font-medium"
                         />
                         <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                      </div>
                      <button 
                        onClick={handleSend}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90",
                          msgInput.trim() ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-400"
                        )}
                      >
                         <Send className="w-5 h-5" />
                      </button>
                   </div>
                </footer>
             </>
           ) : (
             <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-gray-50/20">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mb-8 border border-gray-100">
                   <MessageSquare className="w-12 h-12 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Tu Centro de Operaciones</h3>
                <p className="text-gray-500 text-lg max-w-sm font-medium leading-relaxed mb-8">Elegí una conversación para gestionar tu pago protegido y coordinar la entrega.</p>
                <div className="flex gap-4">
                   <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Protección Activa</p>
                         <p className="text-xs font-bold text-gray-900">$ 1.250.000 Fondeados</p>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
