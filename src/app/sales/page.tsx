"use client";
import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Smartphone,
  Headphones,
  Wrench,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Banknote,
  Wallet,
  CreditCard,
  Printer,
  ScanBarcode,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getProducts } from '@/actions/productActions';
import { createSale } from '@/actions/saleActions';

type Category = 'ALL' | 'PHONE' | 'ACCESSORY' | 'PART';
type PaymentMethod = 'CASH' | 'KBZPAY' | 'CBPAY';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: Exclude<Category, 'ALL'>;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const TAX_RATE = 0.05;
const DISCOUNT_RATE = 0.02;

export default function SalesPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const texts = {
    title: language === 'en' ? 'Point of Sale' : 'အရောင်းစနစ် (POS)',
    subtitle: language === 'en' ? 'Scan barcode or search products to add to cart.' : 'ဘားကုဒ်စကန် သို့မဟုတ် ပစ္စည်းအမည်ဖြင့် ရှာပြီး ခြင်းတောင်းထဲ ထည့်ပါ။',
    searchPlaceholder: language === 'en' ? 'Scan barcode / IMEI or search SKU...' : 'ဘားကုဒ် / IMEI စကန် သို့မဟုတ် ကုတ်နံပါတ်ဖြင့် ရှာရန်...',
    categories: {
      ALL: language === 'en' ? 'All' : 'အားလုံး',
      PHONE: language === 'en' ? 'Phones' : 'ဖုန်းများ',
      ACCESSORY: language === 'en' ? 'Accessories' : 'အပိုပစ္စည်းများ',
      PART: language === 'en' ? 'Spare Parts' : 'အပိုအပိုဒ်များ',
    },
    cart: language === 'en' ? 'Current Order' : 'လက်ရှိ မှာယူမှု',
    items: language === 'en' ? 'items' : 'ခု',
    emptyCart: language === 'en' ? 'Cart is empty. Tap a product to add.' : 'ခြင်းတောင်း ဗလာဖြစ်နေသည်။ ပစ္စည်းကို နှိပ်ပါ။',
    unitPrice: language === 'en' ? 'Unit' : 'တစ်ခု',
    subtotal: language === 'en' ? 'Subtotal' : 'စုစုပေါင်း',
    discount: language === 'en' ? 'Discount (2%)' : 'လျှော့ဈေး (၂%)',
    tax: language === 'en' ? 'Tax (5%)' : 'အခွန် (၅%)',
    total: language === 'en' ? 'Grand Total' : 'စုစုပေါင်းကျသင့်ငွေ',
    payment: language === 'en' ? 'Payment Method' : 'ငွေပေးချေမှု',
    payments: {
      CASH: language === 'en' ? 'Cash' : 'ငွေသား',
      KBZPAY: 'KBZPay',
      CBPAY: 'CB Pay',
    },
    clearCart: language === 'en' ? 'Clear Cart' : 'ခြင်းတောင်း ရှင်းရန်',
    checkout: language === 'en' ? 'Checkout & Print Voucher' : 'ငွေရှင်းပြီး ဘောင်ချာထုတ်ရန်',
    inStock: language === 'en' ? 'in stock' : 'လက်ကျန်',
    add: language === 'en' ? 'Add' : 'ထည့်မည်',
    checkoutSuccess: language === 'en' ? 'Order completed! Voucher sent to printer.' : 'ငွေရှင်းပြီးပါပြီ! ဘောင်ချာ ပရင့်ထုတ်နေသည်။',
    loading: language === 'en' ? 'Loading products...' : 'ပစ္စည်းများ ရယူနေသည်...',
    noProducts: language === 'en' ? 'No products match your search.' : 'ရှာဖွေမှုနှင့် ကိုက်ညီသော ပစ္စည်းမရှိပါ။',
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  async function loadProducts(showLoading = true) {
    if (showLoading) {
      setLoadingProducts(true);
    }

    const result = await getProducts();
    if (result.success && result.data) {
      setProducts(
        result.data.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku ?? '',
          category: p.category,
          price: p.price,
          stock: p.stockQuantity,
        }))
      );
    } else {
      setProducts([]);
      setNotice({
        type: 'error',
        text: result.error ?? 'Unable to load products from inventory.',
      });
    }
    setLoadingProducts(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.id.includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, products]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const taxable = subtotal - discount;
  const tax = taxable * TAX_RATE;
  const grandTotal = taxable + tax;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > item.stock) return item;
          return { ...item, quantity: nextQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setNotice(null);

    const response = await createSale({
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    });

    setCheckoutLoading(false);
    if (response.success) {
      clearCart();
      setNotice({ type: 'success', text: texts.checkoutSuccess });
      await loadProducts(false);
      return;
    }

    setNotice({
      type: 'error',
      text: response.error ?? 'Checkout failed. Please try again.',
    });
    await loadProducts(false);
  };

  const getCategoryIcon = (category: Category | Product['category']) => {
    switch (category) {
      case 'PHONE':
        return Smartphone;
      case 'ACCESSORY':
        return Headphones;
      case 'PART':
        return Wrench;
      default:
        return Package;
    }
  };

  const getCategoryColor = (category: Product['category']) => {
    switch (category) {
      case 'PHONE':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'ACCESSORY':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PART':
        return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  const paymentOptions: { id: PaymentMethod; icon: typeof Banknote; color: string }[] = [
    { id: 'CASH', icon: Banknote, color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
    { id: 'KBZPAY', icon: Wallet, color: 'border-blue-500 bg-blue-50 text-blue-700' },
    { id: 'CBPAY', icon: CreditCard, color: 'border-violet-500 bg-violet-50 text-violet-700' },
  ];

  return (
    <div className="animate-in fade-in duration-300 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{texts.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{texts.subtitle}</p>
      </div>

      {notice && (
        <div
          className={`mb-4 flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="lg:w-[65%] flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
            <div className="relative">
              <ScanBarcode size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder={texts.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(Object.keys(texts.categories) as Category[]).map((cat) => {
                const Icon = getCategoryIcon(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon size={16} />
                    {texts.categories[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loadingProducts ? (
              <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
                <Loader2 size={24} className="animate-spin text-blue-600" />
                <span className="text-sm font-medium">{texts.loading}</span>
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const Icon = getCategoryIcon(product.category);
                const inCart = cart.find((c) => c.id === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`group text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      product.stock === 0
                        ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50'
                        : inCart
                          ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100'
                          : 'border-slate-100 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${getCategoryColor(product.category)}`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">{product.sku}</p>
                    <div className="flex items-end justify-between mt-3">
                      <p className="text-base font-extrabold text-slate-900">
                        {product.price.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Ks</span>
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        product.stock <= 3 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {product.stock} {texts.inStock}
                      </span>
                    </div>
                    {inCart && (
                      <div className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
                        <ShoppingCart size={12} />
                        x{inCart.quantity}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            )}

            {!loadingProducts && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Package size={48} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">{texts.noProducts}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-[35%] flex flex-col min-h-0 bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/60 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ShoppingCart size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{texts.cart}</h2>
                  <p className="text-slate-400 text-xs">{cartCount} {texts.items}</p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  {texts.clearCart}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
                <ShoppingCart size={40} className="mb-3 opacity-30" />
                <p className="text-sm text-center px-4">{texts.emptyCart}</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {texts.unitPrice}: {item.price.toLocaleString()} Ks
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-extrabold text-blue-400">
                      {(item.price * item.quantity).toLocaleString()} Ks
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-700/60 bg-slate-900 shrink-0 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>{texts.subtotal}</span>
                <span className="font-semibold text-slate-300">{subtotal.toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{texts.discount}</span>
                <span className="font-semibold text-emerald-400">-{discount.toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{texts.tax}</span>
                <span className="font-semibold text-slate-300">{tax.toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-white font-bold">{texts.total}</span>
                <span className="text-xl font-extrabold text-white">{grandTotal.toLocaleString()} Ks</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{texts.payment}</p>
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map(({ id, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === id
                        ? color
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    <Icon size={18} />
                    {texts.payments[id]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-800/50 cursor-pointer"
            >
              {checkoutLoading ? <Loader2 size={20} className="animate-spin" /> : <Printer size={20} />}
              {texts.checkout}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
