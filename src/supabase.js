import { createClient } from '@supabase/supabase-js';

// อ่านค่าจาก .env.local (Vite ให้โค้ดเห็นเฉพาะตัวแปรที่ขึ้นต้นด้วย VITE_)
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

// ตัวเชื่อม Supabase – สร้างครั้งเดียว ทุกไฟล์ import ไปใช้ร่วมกัน
export const supabase = createClient(url, key);