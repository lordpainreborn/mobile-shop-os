"use client";
import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  Shield,
  Wrench,
  Edit3,
  UserX,
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type Role = 'ADMIN' | 'TECHNICIAN' | 'CASHIER';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  joinDate: string;
  active: boolean;
  onShift: boolean;
  avatar: string;
}

const initialStaff: StaffMember[] = [
  { id: '1', name: 'Hassan Ahmed', email: 'hassan@shopos.mm', phone: '09-421234567', role: 'ADMIN', joinDate: '2024-01-15', active: true, onShift: true, avatar: 'HA' },
  { id: '2', name: 'Aung Kyaw Min', email: 'aungkyaw@shopos.mm', phone: '09-448822110', role: 'TECHNICIAN', joinDate: '2024-03-22', active: true, onShift: true, avatar: 'AK' },
  { id: '3', name: 'Su Su Hlaing', email: 'susu@shopos.mm', phone: '09-775511330', role: 'CASHIER', joinDate: '2024-06-10', active: true, onShift: true, avatar: 'SS' },
  { id: '4', name: 'Ko Zaw Min', email: 'zawmin@shopos.mm', phone: '09-223344550', role: 'TECHNICIAN', joinDate: '2024-08-05', active: true, onShift: false, avatar: 'KZ' },
  { id: '5', name: 'Daw Myint Myint', email: 'myint@shopos.mm', phone: '09-889900110', role: 'CASHIER', joinDate: '2025-01-20', active: true, onShift: false, avatar: 'DM' },
  { id: '6', name: 'Thiha Oo', email: 'thiha@shopos.mm', phone: '09-556677880', role: 'TECHNICIAN', joinDate: '2025-04-12', active: false, onShift: false, avatar: 'TO' },
];

export default function StaffPage() {
  const { language } = useLanguage();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'CASHIER' as Role });

  const texts = {
    title: language === 'en' ? 'Staff & Employee Management' : 'ဝန်ထမ်း နှင့် ဝန်ထမ်းစီမံခန့်ခွဲမှု',
    subtitle: language === 'en' ? 'Manage team roles, shifts, and access permissions.' : 'အဖွဲ့ဝင်များ၊ တာဝန်များနှင့် ခွင့်ပြုချက်များကို စီမံရန်',
    addStaff: language === 'en' ? 'Add New Staff Member' : 'ဝန်ထမ်းအသစ် ထည့်ရန်',
    searchPlaceholder: language === 'en' ? 'Search by name, email or phone...' : 'အမည်၊ အီးမေးလ် သို့မဟုတ် ဖုန်းဖြင့် ရှာရန်...',
    stats: {
      total: language === 'en' ? 'Total Staff' : 'ဝန်ထမ်းစုစုပေါင်း',
      activeShifts: language === 'en' ? 'Active Shifts' : 'လက်ရှိ တာဝန်ဆောင်နေသူ',
      admins: language === 'en' ? 'Admins' : 'စီမံသူများ',
      technicians: language === 'en' ? 'Technicians' : 'ပြုပြင်ရေးသမားများ',
    },
    table: {
      employee: language === 'en' ? 'Employee' : 'ဝန်ထမ်း',
      email: language === 'en' ? 'Email' : 'အီးမေးလ်',
      role: language === 'en' ? 'Role' : 'တာဝန်',
      phone: language === 'en' ? 'Phone' : 'ဖုန်းနံပါတ်',
      joinDate: language === 'en' ? 'Join Date' : 'စတင်ရက်စွဲ',
      status: language === 'en' ? 'Status' : 'အခြေအနေ',
      actions: language === 'en' ? 'Actions' : 'လုပ်ဆောင်ချက်များ',
    },
    roles: {
      ADMIN: language === 'en' ? 'Admin' : 'စီမံသူ',
      TECHNICIAN: language === 'en' ? 'Technician' : 'ပြုပြင်ရေးသမား',
      CASHIER: language === 'en' ? 'Cashier' : 'ငွေကိုင်',
    },
    active: language === 'en' ? 'Active' : 'လုပ်ဆောင်နေသည်',
    inactive: language === 'en' ? 'Inactive' : 'ရပ်ဆိုင်းထား',
    onShift: language === 'en' ? 'On Shift' : 'တာဝန်ဆောင်နေ',
    editRole: language === 'en' ? 'Edit Role' : 'တာဝန်ပြင်ရန်',
    deactivate: language === 'en' ? 'Deactivate' : 'ရပ်ဆိုင်းရန်',
    activate: language === 'en' ? 'Activate' : 'ပြန်ဖွင့်ရန်',
    modal: {
      addTitle: language === 'en' ? 'Add New Staff Member' : 'ဝန်ထမ်းအသစ် ထည့်သွင်းရန်',
      editTitle: language === 'en' ? 'Edit Staff Role' : 'ဝန်ထမ်းတာဝန် ပြင်ဆင်ရန်',
      name: language === 'en' ? 'Full Name' : 'အမည်အပြည့်အစုံ',
      email: language === 'en' ? 'Email Address' : 'အီးမေးလ်လိပ်စာ',
      phone: language === 'en' ? 'Phone Number' : 'ဖုန်းနံပါတ်',
      role: language === 'en' ? 'Assign Role' : 'တာဝန်သတ်မှတ်ရန်',
      cancel: language === 'en' ? 'Cancel' : 'မလုပ်တော့',
      save: language === 'en' ? 'Save Staff Member' : 'သိမ်းဆည်းရန်',
      update: language === 'en' ? 'Update Role' : 'တာဝန်အပ်နှံရန်',
    },
  };

  const stats = useMemo(() => ({
    total: staff.length,
    activeShifts: staff.filter((s) => s.active && s.onShift).length,
    admins: staff.filter((s) => s.role === 'ADMIN' && s.active).length,
    technicians: staff.filter((s) => s.role === 'TECHNICIAN' && s.active).length,
  }), [staff]);

  const filteredStaff = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return staff;
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.phone.includes(term)
    );
  }, [staff, searchTerm]);

  const getRoleBadge = (role: Role) => {
    const styles: Record<Role, string> = {
      ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
      TECHNICIAN: 'bg-blue-100 text-blue-700 border-blue-200',
      CASHIER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    const icons: Record<Role, typeof Shield> = {
      ADMIN: Shield,
      TECHNICIAN: Wrench,
      CASHIER: UserCheck,
    };
    const Icon = icons[role];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[role]}`}>
        <Icon size={13} />
        {texts.roles[role]}
      </span>
    );
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: '', email: '', phone: '', role: 'CASHIER' });
    setShowModal(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingId(member.id);
    setForm({ name: member.name, email: member.email, phone: member.phone, role: member.role });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, name: form.name, email: form.email, phone: form.phone, role: form.role }
            : s
        )
      );
    } else {
      const initials = form.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      setStaff((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          joinDate: new Date().toISOString().split('T')[0],
          active: true,
          onShift: false,
          avatar: initials || 'NS',
        },
      ]);
    }
    closeModal();
  };

  const toggleActive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, active: !s.active, onShift: s.active ? false : s.onShift } : s
      )
    );
  };

  const statCards = [
    { label: texts.stats.total, value: stats.total, icon: Users, color: 'bg-slate-900 text-white', iconBg: 'bg-slate-700' },
    { label: texts.stats.activeShifts, value: stats.activeShifts, icon: Clock, color: 'bg-blue-600 text-white', iconBg: 'bg-blue-500' },
    { label: texts.stats.admins, value: stats.admins, icon: Shield, color: 'bg-purple-600 text-white', iconBg: 'bg-purple-500' },
    { label: texts.stats.technicians, value: stats.technicians, icon: Wrench, color: 'bg-blue-500 text-white', iconBg: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{texts.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{texts.subtitle}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus size={18} />
          <span>{texts.addStaff}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`${card.color} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-extrabold mt-1">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={texts.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">{texts.table.employee}</th>
                <th className="py-4 px-6">{texts.table.email}</th>
                <th className="py-4 px-6">{texts.table.role}</th>
                <th className="py-4 px-6">{texts.table.phone}</th>
                <th className="py-4 px-6">{texts.table.joinDate}</th>
                <th className="py-4 px-6">{texts.table.status}</th>
                <th className="py-4 px-6 text-right">{texts.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredStaff.map((member) => (
                <tr key={member.id} className={`hover:bg-slate-50/80 transition-colors ${!member.active ? 'opacity-60' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        {member.onShift && member.active && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {texts.onShift}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{member.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getRoleBadge(member.role)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-xs">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      {member.phone}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      {member.joinDate}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      member.active
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {member.active ? texts.active : texts.inactive}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(member)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-all cursor-pointer"
                      >
                        <Edit3 size={14} />
                        {texts.editRole}
                      </button>
                      <button
                        onClick={() => toggleActive(member.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          member.active
                            ? 'text-red-600 hover:bg-red-50 border-red-200'
                            : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                        }`}
                      >
                        <UserX size={14} />
                        {member.active ? texts.deactivate : texts.activate}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? texts.modal.editTitle : texts.modal.addTitle}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 overflow-y-auto">
              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {texts.modal.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {texts.modal.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {texts.modal.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {texts.modal.role}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['ADMIN', 'TECHNICIAN', 'CASHIER'] as Role[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForm({ ...form, role })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          form.role === role
                            ? role === 'ADMIN'
                              ? 'border-purple-500 bg-purple-50'
                              : role === 'TECHNICIAN'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {getRoleBadge(role)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {texts.modal.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
                >
                  {editingId ? texts.modal.update : texts.modal.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
