// ============================================================
// Prisma Seed - Tạo dữ liệu master cho danh mục chi tiêu
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { code: 'LIVING', name: 'Sinh hoạt phí', icon: '🛒', color: '#10B981', sortOrder: 1 },
  { code: 'EDUCATION', name: 'Giáo dục', icon: '📚', color: '#3B82F6', sortOrder: 2 },
  { code: 'CEREMONY', name: 'Hiếu hỉ', icon: '💒', color: '#F59E0B', sortOrder: 3 },
  { code: 'FAMILY_GIFT', name: 'Biếu tặng gia đình', icon: '🎁', color: '#EC4899', sortOrder: 4 },
];

async function main() {
  console.log('🌱 Seeding danh mục chi tiêu...');

  for (const cat of CATEGORIES) {
    await prisma.mst_categories.upsert({
      where: { code: cat.code },
      update: {
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    console.log(`  ✅ ${cat.icon} ${cat.name} (${cat.code})`);
  }

  console.log('🎉 Seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Seed lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
