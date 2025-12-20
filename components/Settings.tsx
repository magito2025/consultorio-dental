
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, ProcedureItem } from '../types';
import { db } from '../services/db';
import { 
  Moon, Sun, Shield, User as UserIcon, Clock, Plus, Edit2, 
  Trash2, Save, X, Lock, Database, Tag, FileText, ChevronDown, ChevronUp
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
  
  // Data Management Accordion State
  const [activeSection, setActiveSection] = useState<'procedures' | 'reasons' | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Data State
  const [procedures, setProcedures] = useState<ProcedureItem[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  
  // Forms for Data
  const [newProcName, setNewProcName] = useState('');
  const [newProcPrice, setNewProcPrice] = useState('');
  const [newReason, setNewReason] = useState('');

  // User Form State
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>(UserRole.STAFF);

  useEffect(() => {
    setUsers(db.getUsers());
    refreshData();

    // Click outside listener for accordion
    const handleClickOutside = (event: MouseEvent) => {
        if (accordionRef.current && !accordionRef.current.contains(event.target as Node)) {
            setActiveSection(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const refreshData = () => {
      setProcedures(db.getProcedures());
      setReasons(db.getConsultationReasons());
  };

  // --- Handlers for Data Accordion ---
  const toggleSection = (section: 'procedures' | 'reasons') => {
      if (activeSection === section) {
          setActiveSection(null);
      } else {
          setActiveSection(section);
      }
  };

  // --- Handlers for User Management ---
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
      setFormRole(UserRole.STAFF);
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

  // --- Handlers for Data Management ---
  const handleAddProcedure = (e: React.FormEvent) => {
      e.preventDefault();
      if(newProcName && newProcPrice) {
          db.addProcedure({ name: newProcName, price: parseFloat(newProcPrice) });
          setNewProcName('');
          setNewProcPrice('');
          refreshData();
      }
  };

  const handleDeleteProcedure = (id: string) => {
      if(confirm('¿Eliminar este tratamiento de las sugerencias?')) {
          db.removeProcedure(id);
          refreshData();
      }
  };

  const handleAddReason = (e: React.FormEvent) => {
      e.preventDefault();
      if(newReason) {
          db.addConsultationReason(newReason);
          setNewReason('');
          refreshData();
      }
  };

  const handleDeleteReason = (reason: string) => {
      if(confirm('¿Eliminar este motivo de las sugerencias?')) {
          db.removeConsultationReason(reason);
          refreshData();
      }
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

      {/* 1. Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Apariencia</h3>
        <div className="flex items-center justify-between">
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
      </div>

      {/* 2. System Data Management (Accordion Style) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6" ref={accordionRef}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Database size={20} className="text-primary" />
                Administrar precios y datos
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configure las listas desplegables y sugerencias del sistema.
            </p>
          </div>

          {(user.role === UserRole.PRINCIPAL || user.role === UserRole.DOCTOR) ? (
            <div className="space-y-4">
                
                {/* Accordion Item 1: Treatments */}
                <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeSection === 'procedures' ? 'border-primary shadow-md bg-slate-50 dark:bg-slate-700/30' : 'border-slate-200 dark:border-slate-600'}`}>
                    <button 
                        onClick={() => toggleSection('procedures')}
                        className="w-full px-5 py-4 flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Tag size={18} className="text-slate-500 dark:text-slate-400" />
                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Tratamientos & Precios</span>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">{procedures.length} items</span>
                        </div>
                        {activeSection === 'procedures' ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </button>
                    
                    {activeSection === 'procedures' && (
                        <div className="p-5 border-t border-slate-200 dark:border-slate-700 animate-slide-down">
                            {/* List */}
                            <div className="flex-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-2 space-y-1 mb-4">
                                {procedures.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-2 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-red-200 dark:hover:border-red-900/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div>
                                            <div className="text-sm font-medium text-slate-800 dark:text-white">{p.name}</div>
                                            <div className="text-xs text-slate-500">Bs {p.price}</div>
                                        </div>
                                        <button onClick={() => handleDeleteProcedure(p.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-500 rounded transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {/* Add Form */}
                            <form onSubmit={handleAddProcedure} className="flex gap-2">
                                <input 
                                    placeholder="Nombre Tratamiento" 
                                    value={newProcName} 
                                    onChange={e => setNewProcName(e.target.value)}
                                    className="flex-1 text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:border-primary outline-none"
                                />
                                <input 
                                    type="number"
                                    placeholder="Precio" 
                                    value={newProcPrice} 
                                    onChange={e => setNewProcPrice(e.target.value)}
                                    className="w-24 text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:border-primary outline-none"
                                />
                                <button type="submit" disabled={!newProcName || !newProcPrice} className="bg-slate-900 dark:bg-primary text-white p-2 rounded-lg disabled:opacity-50 hover:opacity-90">
                                    <Plus size={16} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Accordion Item 2: Reasons */}
                <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeSection === 'reasons' ? 'border-primary shadow-md bg-slate-50 dark:bg-slate-700/30' : 'border-slate-200 dark:border-slate-600'}`}>
                    <button 
                        onClick={() => toggleSection('reasons')}
                        className="w-full px-5 py-4 flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-slate-500 dark:text-slate-400" />
                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Motivos de Consulta</span>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">{reasons.length} items</span>
                        </div>
                        {activeSection === 'reasons' ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </button>
                    
                    {activeSection === 'reasons' && (
                        <div className="p-5 border-t border-slate-200 dark:border-slate-700 animate-slide-down">
                            {/* List */}
                            <div className="flex-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-2 space-y-1 mb-4">
                                {reasons.map((r, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-red-200 dark:hover:border-red-900/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="text-sm font-medium text-slate-800 dark:text-white">{r}</div>
                                        <button onClick={() => handleDeleteReason(r)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-500 rounded transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {/* Add Form */}
                            <form onSubmit={handleAddReason} className="flex gap-2">
                                <input 
                                    placeholder="Nuevo Motivo (ej. Estética)" 
                                    value={newReason} 
                                    onChange={e => setNewReason(e.target.value)}
                                    className="flex-1 text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:border-primary outline-none"
                                />
                                <button type="submit" disabled={!newReason} className="bg-slate-900 dark:bg-primary text-white p-2 rounded-lg disabled:opacity-50 hover:opacity-90">
                                    <Plus size={16} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-700/20 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center text-slate-500 text-sm">
                <Lock size={20} className="mx-auto mb-2 opacity-50" />
                Solo Doctores y Administradores pueden editar los precios y datos del sistema.
            </div>
          )}
      </div>

      {/* 3. User Management */}
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
          
          {user.role === UserRole.PRINCIPAL && (
             <button 
               onClick={() => handleOpenModal()}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
             >
               <Plus size={16} />
               Añadir Usuario
             </button>
          )}
        </div>

        {user.role !== UserRole.PRINCIPAL ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-300">
             <Lock size={20} />
             <p className="text-sm font-medium">Solo el Usuario Principal puede gestionar el personal.</p>
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
                            u.role === UserRole.PRINCIPAL 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                              : u.role === UserRole.DOCTOR
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                          }`}>
                            {u.role === UserRole.PRINCIPAL ? 'Principal' : u.role === UserRole.DOCTOR ? 'Doctor' : 'Staff'}
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
                      placeholder="Ej. Dr. Juan / Srta. Ana"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol / Permisos</label>
                   <select
                      value={formRole}
                      onChange={e => setFormRole(e.target.value as UserRole)}
                      className={inputClass}
                   >
                      <option value={UserRole.STAFF}>Staff (Secretaria/Asistente) - Acceso General</option>
                      <option value={UserRole.DOCTOR}>Doctor - Manejo de Pacientes & Configuración</option>
                      <option value={UserRole.PRINCIPAL}>Principal - Acceso Total (Admin)</option>
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
