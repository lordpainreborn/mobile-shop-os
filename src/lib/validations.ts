import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email/Username is required")
    .max(255, "Email/Username is too long")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const registerSchema = z.object({
  shopName: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .max(100, "Shop name is too long")
    .trim(),
  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .max(100, "Owner name is too long")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .max(20, "Phone number is too long")
    .trim(),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase(),
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only digits"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase(),
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only digits"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(128, "Password is too long"),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name is too long")
    .trim(),
  sku: z
    .string()
    .max(100, "SKU is too long")
    .trim()
    .optional()
    .nullable(),
  barcode: z
    .string()
    .max(100, "Barcode is too long")
    .trim()
    .optional()
    .nullable(),
  category: z.enum(["PHONE", "ACCESSORY", "PART"]),
  price: z.number().positive("Price must be positive"),
  cost: z.number().nonnegative("Cost must be non-negative"),
  stockQuantity: z.number().int().nonnegative("Stock must be non-negative"),
  warrantyMonths: z.number().int().nonnegative().default(0),
});

export const createSaleSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        unitPrice: z.number().nonnegative("Unit price must be non-negative"),
      })
    )
    .min(1, "At least one item is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  cashAmount: z.number().nonnegative().optional(),
  kbzPayAmount: z.number().nonnegative().optional(),
  cbPayAmount: z.number().nonnegative().optional(),
  wavePayAmount: z.number().nonnegative().optional(),
});

export const createRepairTicketSchema = z.object({
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name is too long")
    .trim(),
  customerPhone: z
    .string()
    .min(1, "Customer phone is required")
    .max(20, "Phone number is too long")
    .trim(),
  deviceModel: z
    .string()
    .min(1, "Device model is required")
    .max(100, "Device model is too long")
    .trim(),
  issueDescription: z
    .string()
    .min(1, "Issue description is required")
    .max(1000, "Issue description is too long")
    .trim(),
  includedAccessories: z
    .string()
    .max(500, "Accessories description is too long")
    .trim()
    .optional(),
  estimateCost: z.number().nonnegative().optional(),
});

export const createTradeInSchema = z.object({
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name is too long")
    .trim(),
  customerPhone: z
    .string()
    .max(20, "Phone number is too long")
    .trim()
    .optional(),
  deviceModel: z
    .string()
    .min(1, "Device model is required")
    .max(100, "Device model is too long")
    .trim(),
  deviceCondition: z
    .string()
    .min(1, "Device condition is required")
    .max(500, "Condition description is too long")
    .trim(),
  imeiNumber: z
    .string()
    .max(20, "IMEI is too long")
    .trim()
    .optional(),
  buyInPrice: z.number().positive("Buy-in price must be positive"),
  resellPrice: z.number().nonnegative().optional(),
  notes: z
    .string()
    .max(500, "Notes are too long")
    .trim()
    .optional(),
});

export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description is too long")
    .trim(),
  amount: z.number().positive("Amount must be positive"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category is too long")
    .trim(),
});

export const telegramWebhookSchema = z.object({
  message: z.object({
    text: z.string().optional(),
    chat: z.object({
      id: z.number(),
    }),
  }),
});
