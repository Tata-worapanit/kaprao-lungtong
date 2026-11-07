// สถานะกลางของร้าน — ทุกหน้า import ไฟล์นี้ แล้วเห็นตะกร้า "ก้อนเดียวกัน"
import { ref, computed, watch } from 'vue';
import { supabase } from './supabase.js';

// ---------- ข้อมูลต้นทาง (state) ----------
export const products = ref([]);     // เริ่มว่าง — เดี๋ยวโหลดจาก Supabase
export const loading = ref(true);    // กำลังโหลดอยู่ไหม
export const errorMsg = ref('');     // ข้อความเมื่อโหลดพลาด
export const cart = ref([]);
export const notice = ref('');
export const FREE_SHIP = 200;

// ---------- ค่าที่คำนวณเอง (computed) ----------
export const totalPrice = computed(() => cart.value.reduce((sum, item) => sum + item.price, 0));
export const itemCount = computed(() => cart.value.length);
export const shippingFee = computed(() => {
  if (itemCount.value === 0) return 0;
  return totalPrice.value >= FREE_SHIP ? 0 : 30;
});
export const netTotal = computed(() => totalPrice.value + shippingFee.value);
export const progress = computed(() => Math.min(100, Math.round(totalPrice.value / FREE_SHIP * 100)));
export const remaining = computed(() => Math.max(0, FREE_SHIP - totalPrice.value));

// ---------- เฝ้าค่า (watch) ----------
watch(totalPrice, (newVal, oldVal) => {
  if (newVal >= FREE_SHIP && oldVal < FREE_SHIP) {
    notice.value = '🎉 ยอดถึง 200 บาทแล้ว — ส่งฟรีทันที!';
  } else if (newVal < FREE_SHIP) {
    notice.value = '';   // ยอดกลับมาต่ำกว่าเป้า (เช่น ล้างตะกร้า) → ลบข้อความ
  }
});

// ---------- ฟังก์ชันที่เปลี่ยน state ----------
export function addToCart(product) { cart.value.push(product); }
export function clearCart() { cart.value = []; }

// ---------- โหลดสินค้าจาก Supabase ----------
export async function loadProducts() {
  if (products.value.length === 0) loading.value = true;
  errorMsg.value = '';
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('price');   // เรียงจากราคาน้อยไปมาก
  if (error) {
    errorMsg.value = 'โหลดสินค้าไม่สำเร็จ กรุณาลองใหม่';
    console.error(error);
  } else {
    products.value = data;
  }
  loading.value = false;
}

// ---------- เพิ่มสินค้าใหม่ลง Supabase ----------
// คืนค่า '' ถ้าสำเร็จ หรือข้อความบอกปัญหาถ้าพลาด
export async function addProduct(newItem) {
  const { error } = await supabase.from('products').insert(newItem);
  if (error) return error.message;
  await loadProducts();
  return '';
}

// ---------- Realtime: ฟังการเปลี่ยนแปลงของตาราง products ----------
export const liveMsg = ref('');
let channel = null;

export function startRealtime() {
  if (channel) return;
  channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        liveMsg.value = '🔔 มีการอัปเดตสินค้า — แสดงข้อมูลล่าสุดแล้ว';
        setTimeout(() => { liveMsg.value = ''; }, 5000);
        loadProducts();
      }
    )
    .subscribe();
}

export function stopRealtime() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}

// ---------- ระบบล็อกอินจริง (Supabase Auth) ----------
export const user = ref(null);   // ผู้ใช้ที่ล็อกอินอยู่ (null = ยังไม่ล็อกอิน)

// ตอนเปิดแอป: ถาม Supabase ว่าเคยล็อกอินค้างไว้ไหม
// authReady = "สัญญา" ว่าถามเสร็จแล้ว (router ต้องรอก่อนตัดสินใจ)
export const authReady = supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null;
});

// ฟังทุกครั้งที่สถานะเปลี่ยน (ล็อกอิน / ออกจากระบบ / session หมดอายุ)
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
});

// คืนค่า '' ถ้าสำเร็จ หรือข้อความบอกปัญหาถ้าพลาด
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : '';
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ---------- แก้ไข / ลบ (Update / Delete) ----------
// .select() ต่อท้าย = ขอแถวที่ถูกแก้กลับมา ใช้เช็กว่าแก้ได้จริงไหม
export async function updatePrice(id, newPrice) {
  const { data, error } = await supabase
    .from('products')
    .update({ price: newPrice })
    .eq('id', id)          // ⚠️ ชี้เป้าแถวเดียว — ลืมบรรทัดนี้ เสี่ยงแก้ทุกแถว!
    .select();
  if (error) return error.message;
  if (data.length === 0) return 'ไม่มีสิทธิ์แก้ไข (ยังไม่ได้ล็อกอิน?) หรือไม่พบสินค้า';
  await loadProducts();
  return '';
}

export async function deleteProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)          // ⚠️ ลืมบรรทัดนี้ เสี่ยงลบทั้งตาราง!
    .select();
  if (error) return error.message;
  if (data.length === 0) return 'ไม่มีสิทธิ์ลบ (ยังไม่ได้ล็อกอิน?) หรือไม่พบสินค้า';
  await loadProducts();
  return '';
}