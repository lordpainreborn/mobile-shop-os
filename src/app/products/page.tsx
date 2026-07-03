"use client";
import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Headphones,
  Loader2,
  Package,
  Plus,
  Search,
  Smartphone,
  Trash2,
  Wrench,
  X,
  Edit,
} from 'lucide-react';
import { ProductCategory } from '@prisma/client';
import { useLanguage } from '@/context/LanguageContext';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type CreateProductInput,
} from '@/actions/productActions';

type ProductRow = {
  id: string;
  name: string;
  sku: string | null;
  category: ProductCategory;
  price: number;
  cost: number;
  stockQuantity: number;
};

type CategoryFilter = 'ALL' | ProductCategory;

type ProductFormState = {
  name: string;
  sku: string;
  category: ProductCategory;
  price: string;
  cost: string;
  stockQuantity: string;
};

const emptyForm: ProductFormState = {
  name: '',
  sku: '',
  category: 'PHONE',
  price: '',
  cost: '',
  stockQuantity: '',
};

export default function ProductsPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);

  const texts = {
    title: language === 'en' ? 'Products & Inventory' : 'ကုန်ပစ္စည်း နှင့် လက်ကျန်စာရင်း',
    subtitle: language === 'en' ? 'Manage phones, accessories, and spare parts stock.' : 'ဖုန်းများ၊ အပိုပစ္စည်းများနှင့် လက်ကျန်အရေအတွက်များကို စီမံရန်',
    addProduct: language === 'en' ? 'Add New Product' : 'ပစ္စည်းအသစ်ထည့်ရန်',
    searchPlaceholder: language === 'en' ? 'Search by name, SKU or category...' : 'အမည်၊ ကုတ်နံပါတ် သို့မဟုတ် အမျိုးအစားဖြင့် ရှာရန်...',
    tableHeader: {
      name: language === 'en' ? 'Product Name' : 'ပစ္စည်းအမည်',
      sku: language === 'en' ? 'SKU / Code' : 'ကုတ်နံပါတ်',
      category: language === 'en' ? 'Category' : 'အမျိုးအစား',
      price: language === 'en' ? 'Selling Price' : 'ရောင်းဈေး',
      cost: language === 'en' ? 'Cost' : 'ဝယ်ဈေး',
      stock: language === 'en' ? 'In Stock' : 'လက်ကျန်',
      actions: language === 'en' ? 'Actions' : 'လုပ်ဆောင်ချက်များ',
    },
    categories: {
      ALL: language === 'en' ? 'All' : 'အားလုံး',
      PHONE: language === 'en' ? 'Phone' : 'ဖုန်း',
      ACCESSORY: language === 'en' ? 'Accessory' : 'အပိုပစ္စည်း',
      PART: language === 'en' ? 'Spare Part' : 'အပိုအပိုဒ်',
    },
    inStock: language === 'en' ? 'Units' : 'ခု',
    lowStock: language === 'en' ? 'Low Stock' : 'လက်ကျန်နည်းနေသည်',
    noProducts: language === 'en' ? 'No products found.' : 'ပစ္စည်းများ မတွေ့ပါ။',
    loading: language === 'en' ? 'Loading products...' : 'ပစ္စည်းများ ရယူနေသည်...',
    modal: {
      addTitle: language === 'en' ? 'Add New Product' : 'ပစ္စည်းအသစ် ထည့်သွင်းရန်',
      editTitle: language === 'en' ? 'Edit Product' : 'ပစ္စည်း ပြင်ဆင်ရန်',
      name: language === 'en' ? 'Product Name' : 'ပစ္စည်းအမည်',
      sku: language === 'en' ? 'SKU / Code' : 'ကုတ်နံပါတ်',
      category: language === 'en' ? 'Category' : 'အမျိုးအစား',
      price: language === 'en' ? 'Selling Price (Ks)' : 'ရောင်းဈေး (Ks)',
      cost: language === 'en' ? 'Cost Price (Ks)' : 'ဝယ်ဈေး (Ks)',
      stock: language === 'en' ? 'Stock Quantity' : 'လက်ကျန်အရေအတွက်',
      cancel: language === 'en' ? 'Cancel' : 'မလုပ်တော့',
      save: language === 'en' ? 'Save Product' : 'သိမ်းဆည်းရန်',
      update: language === 'en' ? 'Update Product' : 'ပြင်ဆင်မှု သိမ်းရန်',
    },
    delete: {
      title: language === 'en' ? 'Delete Product?' : 'ပစ္စည်း ဖျက်မလား?',
      message: language === 'en' ? 'This action cannot be undone.' : 'ဤလုပ်ဆောင်ချက်ကို ပြန်လည်မရနိုင်ပါ။',
      confirm: language === 'en' ? 'Delete' : 'ဖျက်မည်',
      cancel: language === 'en' ? 'Cancel' : 'မလုပ်တော့',
    },
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const category = categoryFilter === 'ALL' ? undefined : categoryFilter;
    const response = await getProducts(searchTerm, category);
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      setError(response.error ?? (language === 'en' ? 'Failed to load products' : 'ပစ္စည်းများ ရယူ၍ မရပါ'));
    }
    setLoading(false);
  }, [searchTerm, categoryFilter, language]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product: ProductRow) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku ?? '',
      category: product.category,
      price: String(product.price),
      cost: String(product.cost),
      stockQuantity: String(product.stockQuantity),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim() || undefined,
      category: form.category,
      price: Number(form.price),
      cost: Number(form.cost),
      stockQuantity: Number(form.stockQuantity),
    };

    if (!payload.name) {
      setError(language === 'en' ? 'Product name is required.' : 'ပစ္စည်းအမည်လိုအပ်ပါသည်။');
      setSaving(false);
      return;
    }

    if (form.price.trim() === '' || Number.isNaN(payload.price) || payload.price < 0) {
      setError(language === 'en' ? 'Selling price must be a non-negative number.' : 'ရောင်းဈေးကို မှန်ကန်စွာ ထည့်ပါ။');
      setSaving(false);
      return;
    }

    if (form.cost.trim() === '' || Number.isNaN(payload.cost) || payload.cost < 0) {
      setError(language === 'en' ? 'Cost price must be a non-negative number.' : 'ဝယ်ဈေးကို မှန်ကန်စွာ ထည့်ပါ။');
      setSaving(false);
      return;
    }

    if (form.stockQuantity.trim() === '' || Number.isNaN(payload.stockQuantity) || !Number.isInteger(payload.stockQuantity) || payload.stockQuantity < 0) {
      setError(language === 'en' ? 'Stock quantity must be a non-negative integer.' : 'လက်ကျန်အရေအတွက်ကို မှန်ကန်စွာ ထည့်ပါ။');
      setSaving(false);
      return;
    }

    const response = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    setSaving(false);
    if (response.success) {
      closeModal();
      await fetchProducts();
      return;
    }
    setError(response.error ?? (language === 'en' ? 'Operation failed' : 'လုပ်ဆောင်မှု မအောင်မြင်ပါ'));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const response = await deleteProduct(deleteTarget.id);
    setSaving(false);
    setDeleteTarget(null);
    if (response.success) {
      await fetchProducts();
      return;
    }
    setError(response.error ?? (language === 'en' ? 'Delete failed' : 'ဖျက်၍ မရပါ'));
  };

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'PHONE':
        return Smartphone;
      case 'ACCESSORY':
        return Headphones;
      case 'PART':
        return Wrench;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{texts.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{texts.subtitle}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          <span>{texts.addProduct}</span>
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

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
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
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['ALL', 'PHONE', 'ACCESSORY', 'PART'] as CategoryFilter[]).map((category) => {
            const Icon = category === 'ALL' ? Package : getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  categoryFilter === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon size={16} />
                {texts.categories[category]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 size={24} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">{texts.loading}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">{texts.noProducts}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">{texts.tableHeader.name}</th>
                  <th className="py-4 px-6">{texts.tableHeader.sku}</th>
                  <th className="py-4 px-6">{texts.tableHeader.category}</th>
                  <th className="py-4 px-6">{texts.tableHeader.price}</th>
                  <th className="py-4 px-6 hidden md:table-cell">{texts.tableHeader.cost}</th>
                  <th className="py-4 px-6">{texts.tableHeader.stock}</th>
                  <th className="py-4 px-6 text-right">{texts.tableHeader.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {products.map((product) => {
                  const Icon = getCategoryIcon(product.category);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 font-semibold text-slate-800">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Icon size={18} />
                          </div>
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">{product.sku ?? '—'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.category === 'PHONE'
                              ? 'bg-purple-100 text-purple-700'
                              : product.category === 'ACCESSORY'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {texts.categories[product.category]}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">{product.price.toLocaleString()} Ks</td>
                      <td className="py-4 px-6 text-slate-500 hidden md:table-cell">{product.cost.toLocaleString()} Ks</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${product.stockQuantity <= 3 ? 'text-red-600' : 'text-slate-800'}`}>
                            {product.stockQuantity} {texts.inStock}
                          </span>
                          {product.stockQuantity <= 3 && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                              {texts.lowStock}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? texts.modal.editTitle : texts.modal.addTitle}
              </h2>
              <button type="button" onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.modal.name}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.modal.sku}</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) => setForm({ ...form, sku: event.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.modal.category}</label>
                  <select
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="PHONE">{texts.categories.PHONE}</option>
                    <option value="ACCESSORY">{texts.categories.ACCESSORY}</option>
                    <option value="PART">{texts.categories.PART}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.modal.price}</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    required
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: event.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.modal.cost}</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    required
                    min={0}
                    step={0.01}
                    value={form.cost}
                    onChange={(event) => setForm({ ...form, cost: event.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{texts.modal.stock}</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    min={0}
                    step={1}
                    value={form.stockQuantity}
                    onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {texts.modal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? texts.modal.update : texts.modal.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{texts.delete.title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">{deleteTarget.name}</p>
            <p className="text-sm text-slate-400 mb-6">{texts.delete.message}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                {texts.delete.cancel}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {texts.delete.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
