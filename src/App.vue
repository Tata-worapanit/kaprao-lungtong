<template>
  <nav aria-label="เมนูหลัก">
    <router-link to="/">หน้าแรก</router-link>
    <router-link to="/products">สินค้า</router-link>
    <router-link to="/cart">ตะกร้า ({{ itemCount }})</router-link>
    <!-- ซ่อนเมนูหลังบ้านจากคนทั่วไป (ด่านหน้าจอ — ด่านจริงยังเป็น guard + RLS) -->
    <router-link v-if="user" to="/admin">หลังบ้าน</router-link>
    <!-- ยังไม่ล็อกอิน → ลิงก์เข้าสู่ระบบ · ล็อกอินแล้ว → อีเมล + ปุ่มออก -->
    <router-link v-if="!user" to="/login">เข้าสู่ระบบ</router-link>
    
    <span v-else>
      👤 {{ user.email }}
      <button @click="logout">ออกจากระบบ</button>
    </span>
  </nav>

  <!-- แจ้งเมื่อข้อมูลเปลี่ยนจากเครื่องอื่น (screen reader อ่านให้) -->
  <p class="live" role="status" aria-live="polite">{{ liveMsg }}</p>

  <main id="main" tabindex="-1">
    <router-view />
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  itemCount, loadProducts, liveMsg, startRealtime, stopRealtime,
  user, signOut,
} from './store.js';

const router = useRouter();
async function logout() {
  await signOut();
  router.push('/');   // ออกแล้วพากลับหน้าแรก ไม่ค้างอยู่ในหลังบ้าน
}

// เปิดแอปครั้งแรก → โหลดสินค้า + เริ่มฟังการเปลี่ยนแปลงแบบ real-time
onMounted(() => {
  loadProducts();
  startRealtime();
});

// ปิดแอป/ออกจากหน้า → เลิกฟัง
onUnmounted(stopRealtime);
</script>

<style>
nav { display: flex; gap: 10px; flex-wrap: wrap; padding: 12px 0; border-bottom: 1px solid #E7E2D6; }
nav a { padding: 6px 12px; border-radius: 8px; text-decoration: none; }
nav a.router-link-exact-active { background: #0E8C7B; color: #fff; }
main:focus { outline: none; }
</style>