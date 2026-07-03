import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    { name: 'iPhone 15 Pro Max (256GB)', sku: 'IP15PM-256', category: 'PHONE' as const, price: 4500000, cost: 4200000, stockQuantity: 5 },
    { name: 'Samsung Galaxy S24 Ultra', sku: 'S24U-512', category: 'PHONE' as const, price: 4200000, cost: 3900000, stockQuantity: 3 },
    { name: 'Xiaomi Redmi Note 13 Pro', sku: 'RN13P-128', category: 'PHONE' as const, price: 680000, cost: 580000, stockQuantity: 12 },
    { name: 'Anker 20W Fast Charger', sku: 'ACC-ANK-20W', category: 'ACCESSORY' as const, price: 45000, cost: 28000, stockQuantity: 24 },
    { name: 'AirPods Pro (2nd Gen)', sku: 'APP-2G', category: 'ACCESSORY' as const, price: 650000, cost: 520000, stockQuantity: 8 },
    { name: 'USB-C to Lightning Cable (1m)', sku: 'ACC-CBL-LT1', category: 'ACCESSORY' as const, price: 18000, cost: 9000, stockQuantity: 45 },
    { name: 'iPhone 11 Display / Screen', sku: 'PRT-IP11-SCR', category: 'PART' as const, price: 85000, cost: 55000, stockQuantity: 2 },
    { name: 'Samsung S22 Battery', sku: 'PRT-S22-BAT', category: 'PART' as const, price: 55000, cost: 32000, stockQuantity: 6 },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
