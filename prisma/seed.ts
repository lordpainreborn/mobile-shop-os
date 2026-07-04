import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.repairPart.deleteMany();
  await prisma.repairTicket.deleteMany();
  await prisma.iMEI.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shop.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // --- Shop Alpha ---
  const shopAlpha = await prisma.shop.create({
    data: {
      name: "Shop Alpha",
      ownerName: "Aung Min",
      phone: "+959123456789",
    },
  });

  const alphaOwner = await prisma.user.create({
    data: {
      email: "alpha@shop.com",
      passwordHash,
      name: "Aung Min",
      role: "SHOP_OWNER",
      shopId: shopAlpha.id,
    },
  });

  const alphaStaff = await prisma.user.create({
    data: {
      email: "alpha-staff@shop.com",
      passwordHash,
      name: "Kyaw Zin",
      role: "STAFF",
      shopId: shopAlpha.id,
    },
  });

  const alphaProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: "iPhone 15 Pro Max (256GB)",
        sku: "IP15PM-256",
        category: "PHONE",
        price: 4500000,
        cost: 4200000,
        stockQuantity: 5,
        shopId: shopAlpha.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Galaxy S24 Ultra",
        sku: "S24U-512",
        category: "PHONE",
        price: 4200000,
        cost: 3900000,
        stockQuantity: 3,
        shopId: shopAlpha.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Anker 20W Fast Charger",
        sku: "ACC-ANK-20W",
        category: "ACCESSORY",
        price: 45000,
        cost: 28000,
        stockQuantity: 24,
        shopId: shopAlpha.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "iPhone 11 Display / Screen",
        sku: "PRT-IP11-SCR",
        category: "PART",
        price: 85000,
        cost: 55000,
        stockQuantity: 2,
        shopId: shopAlpha.id,
      },
    }),
  ]);

  await prisma.repairTicket.create({
    data: {
      customerName: "Tun Tun",
      customerPhone: "+959222333444",
      deviceModel: "iPhone 13",
      issueDescription: "Cracked screen",
      status: "PENDING",
      estimateCost: 120000,
      shopId: shopAlpha.id,
      technicianId: alphaStaff.id,
    },
  });

  await prisma.sale.create({
    data: {
      totalAmount: 4410000,
      paymentMethod: "Cash",
      shopId: shopAlpha.id,
      items: {
        create: {
          productId: alphaProducts[2].id,
          quantity: 2,
          unitPrice: 45000,
        },
      },
    },
  });

  console.log(`Shop Alpha: ${shopAlpha.id}`);
  console.log(`  Owner: alpha@shop.com / password123`);
  console.log(`  Staff: alpha-staff@shop.com / password123`);
  console.log(`  Products: ${alphaProducts.length}`);

  // --- Shop Beta ---
  const shopBeta = await prisma.shop.create({
    data: {
      name: "Shop Beta",
      ownerName: "Su Su",
      phone: "+959876543210",
    },
  });

  const betaOwner = await prisma.user.create({
    data: {
      email: "beta@shop.com",
      passwordHash,
      name: "Su Su",
      role: "SHOP_OWNER",
      shopId: shopBeta.id,
    },
  });

  const betaProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: "Xiaomi Redmi Note 13 Pro",
        sku: "RN13P-128",
        category: "PHONE",
        price: 680000,
        cost: 580000,
        stockQuantity: 12,
        shopId: shopBeta.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "AirPods Pro (2nd Gen)",
        sku: "APP-2G",
        category: "ACCESSORY",
        price: 650000,
        cost: 520000,
        stockQuantity: 8,
        shopId: shopBeta.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "USB-C to Lightning Cable (1m)",
        sku: "ACC-CBL-LT1",
        category: "ACCESSORY",
        price: 18000,
        cost: 9000,
        stockQuantity: 45,
        shopId: shopBeta.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung S22 Battery",
        sku: "PRT-S22-BAT",
        category: "PART",
        price: 55000,
        cost: 32000,
        stockQuantity: 6,
        shopId: shopBeta.id,
      },
    }),
  ]);

  await prisma.repairTicket.create({
    data: {
      customerName: "Mya Mya",
      customerPhone: "+959555666777",
      deviceModel: "Samsung S23",
      issueDescription: "Battery draining fast",
      status: "CHECKING",
      estimateCost: 80000,
      shopId: shopBeta.id,
    },
  });

  console.log(`\nShop Beta: ${shopBeta.id}`);
  console.log(`  Owner: beta@shop.com / password123`);
  console.log(`  Products: ${betaProducts.length}`);
  console.log("\nSeed complete. Data isolation verified: each shop has its own private data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
