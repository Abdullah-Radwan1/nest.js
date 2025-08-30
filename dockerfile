# 1. استخدم صورة Node كأساس
FROM node:22

# 2. حدد مكان العمل داخل الحاوية
WORKDIR /app

# 3. انسخ package.json و package-lock.json
COPY package*.json ./

# 4. ثبت dependencies
RUN npm install

# 5. انسخ ملفات Prisma (schema فقط)
COPY prisma ./prisma

# 6. شغل Prisma generate
RUN npx prisma generate

# 7. انسخ باقي الملفات
COPY . .

# 8. ابني التطبيق (NestJS محتاج build للـ dist)
RUN npm run build

# 9. عرف البورت اللي التطبيق هيشتغل عليه
EXPOSE 3000

# 10. شغل التطبيق
CMD ["npm", "run", "start:prod"]
