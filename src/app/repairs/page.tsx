"use client";
import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Plus,
  Search,
  Smartphone,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { RepairStatus } from '@prisma/client';
import { useLanguage } from '@/context/LanguageContext';
import {
  createRepairTicket,
  getRepairTickets,
  updateRepairStatus,
  type CreateRepairTicketInput,
} from '@/actions/repairActions';

type RepairTicketRow = {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  issueDescription: string;
  status: RepairStatus;
  estimateCost: number | null;
  createdAt: string;
};

const statusTabs = ['ALL', 'PENDING', 'CHECKING', 'REPAIRING', 'READY', 'DELIVERED'] as const;
const statusFlow: RepairStatus[] = ['PENDING', 'CHECKING', 'REPAIRING', 'READY', 'DELIVERED'];

type RepairFormState = {
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  issueDescription: string;
  estimateCost: string;
};

const emptyForm: RepairFormState = {
  customerName: '',
  customerPhone: '',
  deviceModel: '',
  issueDescription: '',
  estimateCost: '',
};

export default function RepairsPage() {
  const { language } = useLanguage();
  const [tickets, setTickets] = useState<RepairTicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<(typeof statusTabs)[number]>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicketRow | null>(null);
  const [form, setForm] = useState<RepairFormState>(emptyForm);

  const texts = {
    title: language === 'en' ? 'Repair Tickets & Service' : 'ပြုပြင်ရေး လုပ်ငန်းခွင် နှင့် စာရင်းများ',
    subtitle: language === 'en' ? 'Track customer devices, repair progress, and technician notes.' : 'ဖုန်းအပ်နှံမှုများ၊ ပြင်ဆင်မှု အဆင့်ဆင့်နှင့် မှတ်တမ်းများကို ကြည့်ရှုရန်',
    newTicket: language === 'en' ? 'New Repair Ticket' : 'ဖုန်းပြင်စာရင်း အသစ်သွင်းရန်',
    searchPlaceholder: language === 'en' ? 'Search customer name, phone or model...' : 'အမည်၊ ဖုန်းနံပါတ် သို့မဟုတ် မော်ဒယ်ဖြင့် ရှာရန်...',
    tabs: {
      ALL: language === 'en' ? 'All Tickets' : 'အားလုံး',
      PENDING: language === 'en' ? 'Pending' : 'စောင့်ဆိုင်းဆဲ',
      CHECKING: language === 'en' ? 'Checking' : 'စစ်ဆေးနေသည်',
      REPAIRING: language === 'en' ? 'Repairing' : 'ပြင်ဆင်နေသည်',
      READY: language === 'en' ? 'Ready for Pickup' : 'အပြီးစီး (ယူရန်အသင့်)',
      DELIVERED: language === 'en' ? 'Delivered' : 'ပေးအပ်ပြီး',
    },
    labels: {
      customerName: language === 'en' ? 'Customer Name' : 'ဖောက်သည်အမည်',
      customerPhone: language === 'en' ? 'Customer Phone' : 'ဖုန်းနံပါတ်',
      deviceModel: language === 'en' ? 'Device Model' : 'စက်ပစ္စည်း မော်ဒယ်',
      issueDescription: language === 'en' ? 'Issue Description' : 'ပြဿနာဖော်ပြချက်',
      estimateCost: language === 'en' ? 'Estimate Cost' : 'ခန့်မှန်းကုန်ကျစရိတ်',
      cancel: language === 'en' ? 'Cancel' : 'မလုပ်တော့',
      save: language === 'en' ? 'Create Ticket' : 'စာရင်း အသစ်သိမ်းမည်',
      updateStatus: language === 'en' ? 'Advance Status' : 'အခြေအနေ တိုးတက်ရန်',
    },
    noTickets: language === 'en' ? 'No repair tickets found.' : 'ပြုပြင်ရေး စာရင်း မတွေ့ပါ။',
    loading: language === 'en' ? 'Loading repair tickets...' : 'ပြုပြင်ရေး စာရင်းများ ရယူနေသည်...',
    details: language === 'en' ? 'View Details' : 'အသေးစိတ် ကြည့်မည်',
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getRepairTickets(searchTerm, selectedStatus === 'ALL' ? undefined : selectedStatus);
    if (response.success && response.data) {
      setTickets(response.data.map((ticket) => ({ ...ticket, createdAt: ticket.createdAt.toString() })));
    } else {
      setError(response.error ?? (language === 'en' ? 'Failed to load repair tickets' : 'ပြုပြင်ရေး စာရင်း မရပါ'));
    }
    setLoading(false);
  }, [language, searchTerm, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchTickets, 300);
    return () => clearTimeout(timer);
  }, [fetchTickets]);

  const openNewTicketModal = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const closeNewTicketModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleCreateTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const estimateCost = form.estimateCost.trim() === '' ? undefined : Number(form.estimateCost);

    if (!form.customerName.trim() || !form.customerPhone.trim() || !form.deviceModel.trim() || !form.issueDescription.trim()) {
      setError(language === 'en' ? 'Please fill all required fields.' : 'လိုအပ်သော နေရာများကို ဖြည့်ပါ။');
      setSaving(false);
      return;
    }

    if (estimateCost != null && (Number.isNaN(estimateCost) || estimateCost < 0)) {
      setError(language === 'en' ? 'Estimate cost must be a non-negative number.' : 'ခန့်မှန်းကုန်ကျစရိတ်ကို မှန်ကန်စွာ ထည့်ပါ။');
      setSaving(false);
      return;
    }

    try {
      const response = await createRepairTicket({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        deviceModel: form.deviceModel.trim(),
        issueDescription: form.issueDescription.trim(),
        estimateCost,
      });

      setSaving(false);
      if (response.success) {
        closeNewTicketModal();
        await fetchTickets();
        return;
      }
      setError(response.error ?? (language === 'en' ? 'Failed to create ticket.' : 'စာရင်း အသစ် ထည့်၍ မရပါ။'));
    } catch (error) {
      setSaving(false);
      setError(error instanceof Error ? error.message : (language === 'en' ? 'Unexpected error occurred.' : 'အမှားတစ်ခုဖြစ်ပွားလိုက်သည်။'));
    }
  };

  const getNextStatus = (status: RepairStatus): RepairStatus | null => {
    const index = statusFlow.indexOf(status);
    return index < statusFlow.length - 1 ? statusFlow[index + 1] : null;
  };

  const handleAdvanceStatus = async (ticket: RepairTicketRow) => {
    const nextStatus = getNextStatus(ticket.status);
    if (!nextStatus) return;
    setSaving(true);
    setError(null);
    const response = await updateRepairStatus(ticket.id, nextStatus);
    setSaving(false);
    if (response.success) {
      await fetchTickets();
      return;
    }
    setError(response.error ?? (language === 'en' ? 'Failed to update status.' : 'အခြေအနေ ပြင်ဆင်၍ မရပါ။'));
  };

  const openDetails = (ticket: RepairTicketRow) => {
    setSelectedTicket(ticket);
  };

  const closeDetails = () => {
    setSelectedTicket(null);
  };

  const renderStatusBadge = (ticket: RepairTicketRow) => {
    const isClickable = getNextStatus(ticket.status) !== null;
    const baseClass = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all';
    const className =
      ticket.status === 'PENDING'
        ? `${baseClass} bg-amber-100 text-amber-700 border-amber-200`
        : ticket.status === 'CHECKING'
        ? `${baseClass} bg-blue-100 text-blue-700 border-blue-200`
        : ticket.status === 'REPAIRING'
        ? `${baseClass} bg-purple-100 text-purple-700 border-purple-200`
        : ticket.status === 'READY'
        ? `${baseClass} bg-emerald-100 text-emerald-700 border-emerald-200`
        : `${baseClass} bg-slate-100 text-slate-700 border-slate-200`;
    return (
      <button
        type="button"
        onClick={() => handleAdvanceStatus(ticket)}
        disabled={!isClickable || saving}
        className={`${className} ${isClickable ? 'hover:bg-slate-200' : 'opacity-80 cursor-default'}`}
      >
        {ticket.status === 'PENDING' && <Clock size={14} />}
        {ticket.status === 'CHECKING' && <AlertCircle size={14} />}
        {ticket.status === 'REPAIRING' && <Wrench size={14} />}
        {ticket.status === 'READY' && <CheckCircle2 size={14} />}
        <span>{texts.tabs[ticket.status]}</span>
      </button>
    );
  };

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = [ticket.customerName, ticket.customerPhone, ticket.deviceModel, ticket.id]
      .some((value) => value.toLowerCase().includes(query));
    const matchesStatus = selectedStatus === 'ALL' || ticket.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{texts.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{texts.subtitle}</p>
        </div>
        <button
          onClick={openNewTicketModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          <span>{texts.newTicket}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {statusTabs.map((statusKey) => (
          <button
            key={statusKey}
            type="button"
            onClick={() => setSelectedStatus(statusKey)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              selectedStatus === statusKey
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {texts.tabs[statusKey]}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={texts.searchPlaceholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 size={24} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">{texts.loading}</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Smartphone size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">{texts.noTickets}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">{texts.tabs.ALL}</th>
                  <th className="py-4 px-6">{texts.labels.customerName}</th>
                  <th className="py-4 px-6">{texts.labels.deviceModel}</th>
                  <th className="py-4 px-6">{language === 'en' ? 'Status' : 'အခြေအနေ'}</th>
                  <th className="py-4 px-6">{texts.labels.estimateCost}</th>
                  <th className="py-4 px-6 text-right">{texts.details}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">{ticket.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <User size={16} className="text-slate-400" />
                        <span>{ticket.customerName}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{ticket.customerPhone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Smartphone size={16} className="text-slate-500" />
                        <span>{ticket.deviceModel}</span>
                      </div>
                      <p className="text-xs text-red-500 font-normal mt-0.5 max-w-xs truncate">{ticket.issueDescription}</p>
                    </td>
                    <td className="py-4 px-6">{renderStatusBadge(ticket)}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {ticket.estimateCost != null ? `${ticket.estimateCost.toLocaleString()} Ks` : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => openDetails(ticket)}
                        className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 transition-all"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeNewTicketModal} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">{texts.newTicket}</h2>
              <button type="button" onClick={closeNewTicketModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.labels.customerName}</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.labels.customerPhone}</label>
                  <input
                    type="text"
                    required
                    value={form.customerPhone}
                    onChange={(event) => setForm({ ...form, customerPhone: event.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.labels.deviceModel}</label>
                <input
                  type="text"
                  required
                  value={form.deviceModel}
                  onChange={(event) => setForm({ ...form, deviceModel: event.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.labels.issueDescription}</label>
                <textarea
                  required
                  value={form.issueDescription}
                  onChange={(event) => setForm({ ...form, issueDescription: event.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.labels.estimateCost}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  value={form.estimateCost}
                  onChange={(event) => setForm({ ...form, estimateCost: event.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeNewTicketModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {texts.labels.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {texts.labels.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeDetails} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{texts.details}</h2>
                <p className="text-sm text-slate-500">{selectedTicket.id}</p>
              </div>
              <button type="button" onClick={closeDetails} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{texts.labels.customerName}</p>
                  <p className="mt-2 font-semibold text-slate-900">{selectedTicket.customerName}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{texts.labels.customerPhone}</p>
                  <p className="mt-2 font-semibold text-slate-900">{selectedTicket.customerPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{texts.labels.deviceModel}</p>
                  <p className="mt-2 font-semibold text-slate-900">{selectedTicket.deviceModel}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{texts.labels.estimateCost}</p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedTicket.estimateCost != null ? `${selectedTicket.estimateCost.toLocaleString()} Ks` : '—'}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{texts.labels.issueDescription}</p>
                <p className="mt-2 text-slate-700">{selectedTicket.issueDescription}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>{renderStatusBadge(selectedTicket)}</div>
                <button
                  type="button"
                  disabled={saving || getNextStatus(selectedTicket.status) === null}
                  onClick={() => selectedTicket && handleAdvanceStatus(selectedTicket)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {texts.labels.updateStatus}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
