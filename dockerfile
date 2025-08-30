# 1. نستخدم نسخة Node.js الرسمية
FROM node:18-alpine

# 2. نحدد مجلد العمل داخل الـ container
WORKDIR /nest-app

# 3. ننسخ ملفات الباكجات (package.json + package-lock.json)
COPY package*.json ./

# 4. نثبت الباكجات
RUN npm install

# 5. ننسخ باقي ملفات المشروع
COPY . .

# 6. نعمل build لـ NestJS
RUN npm run build

# 7. نفتح البورت
EXPOSE 5001

# 8. نشغل السيرفر
CMD ["npm", "run", "start:prod"]
