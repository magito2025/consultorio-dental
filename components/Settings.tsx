
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';
import { 
  Moon, 
  Sun, 
  Shield, 
  User as UserIcon, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Lock,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface SettingsProps {
  user: User;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, isDarkMode, toggleTheme }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>(UserRole.SECRETARY);

  // Logo State
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsers(db.getUsers());
    setCustomLogo(db.getLogo());
  }, []);

  const handleOpenModal = (userToEdit?: User) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setFormName(userToEdit.name);
      setFormUsername(userToEdit.username);
      setFormPassword(userToEdit.password || '');
      setFormRole(userToEdit.role);
    } else {
      setEditingUser(null);
      setFormName('');
      setFormUsername('');
      setFormPassword('');
      setFormRole(UserRole.SECRETARY);
    }
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      db.updateUser(editingUser.id, {
        name: formName,
        username: formUsername,
        password: formPassword,
        role: formRole
      });
    } else {
      db.addUser({
        name: formName,
        username: formUsername,
        password: formPassword,
        role: formRole
      });
    }
    setUsers(db.getUsers());
    setShowUserModal(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      db.deleteUser(id);
      setUsers(db.getUsers());
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        db.saveLogo(base64String);
        setCustomLogo(base64String);
        // Dispatch a custom event or force a reload to update other components if needed
        // For now, a reload is the simplest way to propagate this global change without context/redux
        if(confirm("Logo actualizado. Se recargará la página para aplicar cambios.")) {
            window.location.reload();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
      db.saveLogo('');
      setCustomLogo(null);
      window.location.reload();
  };

  // Consistent input class
  const inputClass = "w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none";

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración del Sistema</h2>
          <p className="text-slate-500 dark:text-slate-400">Personalización y gestión de accesos.</p>
        </div>
      </div>

      {/* 1. Theme & Appearance Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Apariencia y Marca</h3>
        
        <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-amber-400 text-white'}`}>
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Tema del Sistema</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{isDarkMode ? 'Modo Oscuro activado' : 'Modo Claro activado'}</p>
                    </div>
                </div>
                <button 
                    onClick={toggleTheme}
                    className={`
                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none
                    ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}
                    `}
                >
                    <span
                    className={`
                        inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                        ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}
                    `}
                    />
                </button>
            </div>

            {/* Logo Upload */}
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden relative">
                         {customLogo ? (
                             <img src={customLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                         ) : (
                             <ImageIcon className="text-slate-300" size={32} />
                         )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">Logotipo de la Clínica</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                            Este logo reemplazará al icono por defecto en la pantalla de inicio de sesión y en la barra lateral. Formatos soportados: PNG, JPG, SVG.
                        </p>
                        <div className="flex gap-2 mt-3">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleLogoUpload} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <button 
                                onClick={triggerFileInput}
                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-2"
                            >
                                <Upload size={14} /> Subir Imagen
                            </button>
                            {customLogo && (
                                <button 
                                    onClick={removeLogo}
                                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. User Management (Only for Owner) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Administración de Usuarios
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestione los perfiles que tienen acceso a la plataforma.
            </p>
          </div>
          
          {user.role === UserRole.OWNER && (
             <button 
               onClick={() => handleOpenModal()}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
             >
               <Plus size={16} />
               Añadir Usuario
             </button>
          )}
        </div>

        {user.role !== UserRole.OWNER ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-300">
             <Lock size={20} />
             <p className="text-sm font-medium">Solo el Dr. Taboada (Administrador) puede gestionar usuarios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Cards */}
            {users.map((u) => (
              <div key={u.id} className="relative group bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-all">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {u.name.charAt(0)}
                       </div>
                       <div>
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{u.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            u.role === UserRole.OWNER 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {u.role === UserRole.OWNER ? 'Administrador' : 'Staff'}
                          </span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                       <Clock size={14} />
                       <span>Último acceso:</span>
                       <span className="font-medium text-slate-700 dark:text-slate-300">
                         {new Date(u.lastAccess).toLocaleDateString()} {new Date(u.lastAccess).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                       <UserIcon size={14} />
                       <span>Usuario: {u.username}</span>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(u)}
                      className="p-1.5 bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg shadow-sm hover:text-primary hover:bg-slate-50 border border-slate-200 dark:border-slate-500"
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                    {u.id !== user.id && ( // Can't delete yourself
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 bg-white dark:bg-slate-600 text-red-500 dark:text-red-400 rounded-lg shadow-sm hover:bg-red-50 border border-slate-200 dark:border-slate-500"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                 </div>
              </div>
            ))}

            {/* Add User Card (Dashed) */}
            <button 
               onClick={() => handleOpenModal()}
               className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-400 hover:text-primary hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all min-h-[160px]"
            >
               <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                 <Plus size={24} />
               </div>
               <span className="font-medium text-sm">Añadir Nuevo Perfil</span>
            </button>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
             <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                 {editingUser ? 'Editar Perfil' : 'Nuevo Usuario'}
               </h3>
               <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-red-500">
                 <X size={20} />
               </button>
             </div>
             
             <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                   <input 
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className={inputClass}
                      placeholder="Ej. Dra. Ana"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol / Cargo</label>
                   <select
                      value={formRole}
                      onChange={e => setFormRole(e.target.value as UserRole)}
                      className={inputClass}
                   >
                      <option value={UserRole.SECRETARY}>Recepcionista / Staff</option>
                      <option value={UserRole.OWNER}>Administrador / Doctor</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Usuario de Acceso</label>
                   <input 
                      required
                      value={formUsername}
                      onChange={e => setFormUsername(e.target.value)}
                      className={inputClass}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
                   <input 
                      type="password"
                      required
                      value={formPassword}
                      onChange={e => setFormPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••"
                   />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                   <button 
                      type="button" 
                      onClick={() => setShowUserModal(false)}
                      className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                   >
                      Cancelar
                   </button>
                   <button 
                      type="submit"
                      className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-teal-700 flex items-center gap-2"
                   >
                      <Save size={16} />
                      Guardar
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
