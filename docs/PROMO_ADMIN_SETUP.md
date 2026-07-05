# Promo Admin Module

โมดูลนี้เพิ่มระบบโปรรายเดือนเข้า Solomon App 2 โดยไม่ต้องแก้โค้ดทุกเดือน

## หน้าใช้งาน

```text
/?view=promo
```

ใช้สำหรับดูโปร เลือกเดือน เลือกคลาส จิ้มการ์ด ใส่จำนวน และคำนวณยอดสุทธิ

## หน้าหลังบ้าน

```text
/?view=promo-admin
```

ใช้สำหรับนำเข้า JSON รายเดือน กรอกราคา เคลียร์ REVIEW_QUEUE และ Publish เดือนโปร

## Supabase

ตั้งค่า Vercel Environment Variables:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<public anon / publishable key>
```

ฐานข้อมูลที่ใช้:

```text
promo_months
promo_classes
promo_cards
sku_master
sku_aliases
card_skus
price_by_month
promo_tiers
review_queue
promo_admin_users
```

Migration ถูก apply แล้วใน Supabase project ที่เชื่อมไว้ระหว่างการทำงานนี้ ถ้าย้าย project ให้ใช้ schema ใน `database/promo_schema_reference.sql`

## การเปิดสิทธิ์ Admin

1. สร้างผู้ใช้ใน Supabase Auth
2. เอา user id มาเพิ่มในตาราง `promo_admin_users`
3. เข้า `/?view=promo-admin`
4. Login ด้วย email/password
5. นำเข้า `promo-data-*.json`
6. กรอกราคา missing/conflict
7. เคลียร์ REVIEW_QUEUE
8. Publish เดือนโปร

## กฎสำคัญ

- ห้ามเดาราคา ถ้าไม่พบราคาให้ปล่อย `missing`
- ห้าม Publish ใช้งานจริงถ้า REVIEW_QUEUE ยังมีรายการสำคัญ
- การ์ด 1 ใบมีหลาย SKU ได้ ต้องแยกใน `card_skus`
- ราคาต้องอยู่ที่ `price_by_month` เพราะเดือนหน้าอาจเปลี่ยน
