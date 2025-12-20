
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    setCustomLogo(db.getLogo());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove leading/trailing whitespace based on user request
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    const user = db.login(cleanUsername, cleanPassword);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas.');
    }
  };

  // Elegant Vector Tooth Logo (Default)
  const ToothLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 3C4.2 3 2 5.2 2 8c0 4 3 7 5 11 1 2 2.5 3 5 3s4-1 5-3c2-4 5-7 5-11 0-2.8-2.2-5-5-5-1.5 0-3 1-4 2-1-1-2.5-2-4-2z" />
      <path d="M12 6v6" opacity="0.6" />
      <path d="M9 10h6" opacity="0.6" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white z-10">
        <div className="w-full max-w-[380px] space-y-8">
            
            {/* Header - Branding */}
            <div className="flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/10 border border-primary/20 p-2">
                  {customLogo ? (
                      <img src={customLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                      <ToothLogo size={48} />
                  )}
               </div>
               
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Consultorio Taboada</h2>
               <p className="text-slate-400 text-xs mt-2 font-semibold uppercase tracking-[0.2em]">Sistema de Gestión Clínica</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    placeholder="Ingrese su usuario"
                    required
                  />
               </div>

               <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-slate-700">Contraseña</label>
                  </div>
                  <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>

               {error && (
                  <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                  </div>
               )}

               <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-primary text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
               >
                  Iniciar Sesión
               </button>
            </form>

            {/* Footer */}
            <div className="pt-8 mt-8 border-t border-slate-100 text-center">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-slate-200">
                    <ShieldCheck size={12} className="text-primary" />
                    Datos protegidos por jerarquía
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                    <p>Gestión de usuarios restringida al administrador.</p>
                    <p className="font-medium text-slate-500">® 2025 Marca registrada TMG</p>
                </div>
            </div>

        </div>
      </div>

      {/* Right Side - Image Only (No Text) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 overflow-hidden">
        {/* Background Image - Clean */}
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
          alt="Dental Office" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle overlay just for slight tint, no text */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
      </div>

    </div>
  );
};

export default Login;
