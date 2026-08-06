# AYA Printer Bridge — POC 0.1

ต้นแบบ Android APK สำหรับทดสอบเส้นทางพิมพ์:

```text
Android → Wi-Fi → 192.168.1.1:9100 → ZTE F6107A → USB → Canon PIXMA E410
```

## ขอบเขตที่ทำแล้ว

- ตั้ง IP และพอร์ต โดยค่าเริ่มต้นเป็น `192.168.1.1:9100`
- ทดสอบ TCP connection พร้อม timeout และ log
- เลือกไฟล์ `.prn`, `.raw` หรือ `.bin`
- ส่งไฟล์แบบ byte-for-byte ผ่าน RAW TCP พอร์ต 9100
- รับไฟล์ `application/octet-stream` จากเมนู Share ของ Android
- จดจำ IP และพอร์ตล่าสุด
- ปฏิเสธ PDF/JPG เพื่อไม่ส่งข้อมูลผิดชนิดเข้าเครื่องพิมพ์

## ข้อจำกัดสำคัญ

รุ่นนี้เป็น **transport proof of concept** เท่านั้น ยังไม่มี Canon E410 driver engine อยู่ใน APK

ดังนั้นไฟล์ที่ส่งต้องเป็นงานพิมพ์ RAW/PRN ที่สร้างด้วยไดรเวอร์ Canon PIXMA E410 แล้ว การส่ง PDF, JPG, PNG หรือข้อความตรงไปพอร์ต 9100 จะไม่กลายเป็นงานพิมพ์ที่ถูกต้อง

## วิธีทดสอบ

1. ติดตั้ง APK debug จาก GitHub Actions artifact
2. เชื่อมมือถือกับ Wi-Fi ของ Router เดียวกัน
3. เปิด Canon E410 และเสียบ USB เข้ากับ Router
4. เปิดแอป แล้วกด `ทดสอบการเชื่อมต่อ`
5. ผลที่ผ่านต้องขึ้น `CONNECTED 192.168.1.1:9100`
6. เลือกไฟล์ `.prn/.raw/.bin` ที่สร้างจากไดรเวอร์ E410
7. กด `ส่งงานพิมพ์ไปยัง Router`
8. ตรวจจำนวน bytes, เวลา และผลจากเครื่องพิมพ์จริง

## การสร้างไฟล์ PRN สำหรับทดสอบจาก Windows

ใช้ Canon E410 driver เดิมบนคอมพิวเตอร์ แล้วเลือก `Print to file` หรือพอร์ต `FILE:` จาก Printer Properties ก่อนพิมพ์หน้าทดสอบ บันทึกผลเป็น `.prn` ห้ามเปิดหรือแก้ไฟล์ด้วยโปรแกรมข้อความ

ไฟล์ PRN ผูกกับค่าที่เลือกตอนสร้าง เช่น รุ่นเครื่องพิมพ์ กระดาษ A4 สี/ขาวดำ คุณภาพ และแนวกระดาษ

## เกณฑ์ผ่าน POC

- แอปเชื่อม `192.168.1.1:9100` ได้
- ส่งไฟล์ครบทุก byte โดยไม่ timeout
- Router ส่งต่อให้ E410 และเครื่องพิมพ์พิมพ์ออกถูกต้อง
- ไม่มีการเรียก PrintHand หรือ Print Service ของบริษัทอื่น

เมื่อผ่านครบ ขั้นต่อไปคือเพิ่ม driver engine เพื่อแปลงภาพ/PDF เป็น Canon E410 raster stream ภายใน APK แล้วจึงเพิ่มการเรียกจากเว็บไซต์และ Android PrintService

## Build

```text
gradle -p tools/aya-printer-bridge :app:assembleDebug
```

APK จะอยู่ที่:

```text
tools/aya-printer-bridge/app/build/outputs/apk/debug/app-debug.apk
```
