"use client";

import { useState } from "react";
import { Printer, X, Loader2 } from "lucide-react";

type CartItem = {
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

type PrintVoucherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  saleId?: string;
};

export default function PrintVoucherModal({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  tax,
  grandTotal,
  paymentMethod,
  saleId,
}: PrintVoucherModalProps) {
  const [printing, setPrinting] = useState(false);
  const [paperSize, setPaperSize] = useState<"58" | "80">("80");

  if (!isOpen) return null;

  function handlePrint() {
    setPrinting(true);

    const width = paperSize === "58" ? "80mm" : "100mm";
    const fontSize = paperSize === "58" ? "10px" : "12px";
    const smallFont = paperSize === "58" ? "8px" : "10px";

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @page { size: ${width} auto; margin: 2mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: ${fontSize}; width: ${width}; padding: 4px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #000; margin: 4px 0; }
          .row { display: flex; justify-content: space-between; margin: 2px 0; }
          .item-row { margin: 3px 0; }
          .small { font-size: ${smallFont}; }
          .total-line { border-top: 2px solid #000; margin: 4px 0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: ${paperSize === "58" ? "14px" : "16px"};">AIOMS POS</div>
        <div class="center small">All In One Mobile Shop</div>
        <div class="center small">${new Date().toLocaleString()}</div>
        ${saleId ? `<div class="center small">Sale #${saleId.slice(-8).toUpperCase()}</div>` : ""}
        <div class="line"></div>
        <div class="bold" style="margin: 4px 0;">ITEMS:</div>
        ${items
          .map(
            (item) => `
          <div class="item-row">
            <div>${item.name}</div>
            <div class="row">
              <span class="small">  ${item.quantity} x ${item.price.toLocaleString()}</span>
              <span class="bold">${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        `
          )
          .join("")}
        <div class="line"></div>
        <div class="row"><span>Subtotal:</span><span>${subtotal.toLocaleString()} Ks</span></div>
        <div class="row"><span>Discount (2%):</span><span>-${discount.toLocaleString()} Ks</span></div>
        <div class="row"><span>Tax (5%):</span><span>${tax.toLocaleString()} Ks</span></div>
        <div class="total-line row bold"><span>TOTAL:</span><span>${grandTotal.toLocaleString()} Ks</span></div>
        <div class="row small"><span>Payment:</span><span>${paymentMethod}</span></div>
        <div class="line"></div>
        <div class="center small" style="margin-top: 8px;">Thank you for your purchase!</div>
        <div class="center small">AIOMS POS - mobile-shop-os.vercel.app</div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setPrinting(false);
      }, 500);
    } else {
      setPrinting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Print Voucher</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Paper Size</label>
            <div className="flex gap-2">
              {(["58", "80"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPaperSize(size)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition cursor-pointer ${
                    paperSize === size
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {size}mm
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 max-h-60 overflow-y-auto">
            <div className="text-center font-bold text-sm mb-2">AIOMS POS</div>
            <div className="text-center text-xs text-slate-500 mb-3">{new Date().toLocaleString()}</div>
            <div className="border-t border-dashed border-slate-300 my-2" />
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs mb-1">
                <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="font-semibold">{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-300 my-2" />
            <div className="flex justify-between text-xs"><span>Subtotal</span><span>{subtotal.toLocaleString()} Ks</span></div>
            <div className="flex justify-between text-xs"><span>Discount</span><span>-{discount.toLocaleString()} Ks</span></div>
            <div className="flex justify-between text-xs"><span>Tax</span><span>{tax.toLocaleString()} Ks</span></div>
            <div className="border-t-2 border-slate-900 my-2" />
            <div className="flex justify-between text-sm font-bold"><span>TOTAL</span><span>{grandTotal.toLocaleString()} Ks</span></div>
            <div className="flex justify-between text-xs mt-1"><span>Payment</span><span>{paymentMethod}</span></div>
          </div>

          <button
            onClick={handlePrint}
            disabled={printing}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition cursor-pointer"
          >
            {printing ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
            {printing ? "Printing..." : "Print Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
}
