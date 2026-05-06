import React from "react";
import Link from "next/link";
import { Globe, Mail, Phone, MapPin, Share2, Shield, Heart, Zap, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Columnas informativas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1 space-y-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-[1rem] flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-900/50">M</div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none tracking-tighter">MDP MARKET</span>
                <span className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase">Mar del Plata</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed font-medium text-gray-500 max-w-xs">
              La plataforma de comercio y servicios de la costa atlántica. 
              Compras protegidas y profesionales certificados.
            </p>
          </div>

          {/* Comprar */}
          <div className="space-y-5">
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Comprar</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><Link href="/productos" className="hover:text-blue-400 transition-colors">Productos</Link></li>
              <li><Link href="/servicios" className="hover:text-blue-400 transition-colors">Servicios</Link></li>
              <li><Link href="/profesionales" className="hover:text-blue-400 transition-colors">Profesionales</Link></li>
              <li><Link href="/productos" className="hover:text-blue-400 transition-colors">Ofertas del día</Link></li>
              <li><Link href="/categorias" className="hover:text-blue-400 transition-colors">Categorías</Link></li>
              <li><Link href="/pedir-servicio" className="hover:text-blue-400 transition-colors">Urgencias 24hs</Link></li>
            </ul>
          </div>

          {/* Vender */}
          <div className="space-y-5">
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Vender</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><Link href="/publicar" className="hover:text-blue-400 transition-colors">Publicar producto</Link></li>
              <li><Link href="/publicar" className="hover:text-blue-400 transition-colors">Ofrecer servicio</Link></li>
              <li><Link href="/dashboard/vendedor" className="hover:text-blue-400 transition-colors">Panel vendedor</Link></li>
              <li><Link href="/dashboard/profesional" className="hover:text-blue-400 transition-colors">Panel profesional</Link></li>
            </ul>
          </div>

          {/* Mi Cuenta */}
          <div className="space-y-5">
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Mi Cuenta</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><Link href="/dashboard/usuario" className="hover:text-blue-400 transition-colors">Mi perfil</Link></li>
              <li><Link href="/dashboard/usuario" className="hover:text-blue-400 transition-colors">Mis compras</Link></li>
              <li><Link href="/favoritos" className="hover:text-blue-400 transition-colors">Favoritos</Link></li>
              <li><Link href="/chat" className="hover:text-blue-400 transition-colors">Mensajes</Link></li>
              <li><Link href="/reclamos" className="hover:text-blue-400 transition-colors">Reclamos</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div className="space-y-5">
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Ayuda</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><Link href="/reclamos" className="hover:text-blue-400 transition-colors">Centro de ayuda</Link></li>
              <li><Link href="/reclamos" className="hover:text-blue-400 transition-colors">Cómo comprar</Link></li>
              <li><Link href="/reclamos" className="hover:text-blue-400 transition-colors">Cómo vender</Link></li>
              <li><Link href="/reclamos" className="hover:text-blue-400 transition-colors">Resolución de problemas</Link></li>
              <li><Link href="/reclamos" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-white/5 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Pago Protegido</h4>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Tu dinero en custodia hasta la entrega</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Urgencias 24hs</h4>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Profesionales en menos de 45 min</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest">100% Local</h4>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Soporte humano en Mar del Plata</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[9px] font-black uppercase tracking-widest text-gray-600">
            <span>© 2024 MDP Market & Services · Argentina</span>
            <div className="flex items-center gap-4">
              <Link href="/reclamos" className="hover:text-white transition-colors">Términos</Link>
              <Link href="/reclamos" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/reclamos" className="hover:text-white transition-colors">Defensa al Consumidor</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[Globe, Mail, Share2, MessageCircle].map((Icon, i) => (
              <Link key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all">
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
