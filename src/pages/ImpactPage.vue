<template>
  <section class="impact">
    <h1>ผลลัพธ์จากการใช้งานจริง</h1>

    <p v-if="loading">กำลังโหลดข้อมูล…</p>
    <p v-else-if="loadError" role="alert">โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่</p>

    <template v-else>
      <p class="stat" aria-live="polite">
        ผู้ใช้ที่ลองใช้งานจริง <strong>{{ userCount }}</strong> คน
      </p>

      <h2>เสียงจากผู้ใช้</h2>
      <ul v-if="quotes.length" class="quotes">
        <li v-for="q in quotes" :key="q.id">
          <q>{{ q.quote }}</q> — {{ q.user_code }}
        </li>
      </ul>
      <p v-else>ยังไม่มีคำพูดที่ผู้ใช้อนุญาตให้เผยแพร่</p>

      <h2>ภาพการใช้งาน</h2>
      <div v-if="photos.length" class="photos">
        <figure v-for="p in photos" :key="p.src">
          <img :src="p.src" :alt="p.alt" />
          <figcaption>{{ p.alt }}</figcaption>
        </figure>
      </div>
      <p v-else>ยังไม่มีภาพที่ผู้ใช้อนุญาตให้เผยแพร่</p>

      <h2>สิ่งที่ปรับปรุงจากฟีดแบ็ก</h2>
      <ul v-if="improvements.length">
        <li v-for="(t, i) in improvements" :key="i">{{ t }}</li>
      </ul>
      <p v-else>อยู่ระหว่างปรับปรุง</p>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../supabase.js';

const rows = ref([]);
const loading = ref(true);
const loadError = ref(false);

// รูปต้องอยู่ในโฟลเดอร์ public/ และชื่อไฟล์ต้องตรงกับ src ด้านล่าง
const photos = [
  { src: '/impact1.jpg', alt: 'ผู้ใช้ U1 ลองใช้เว็บร้านกะเพราลุงโต้ง' },
  { src: '/impact2.jpg', alt: 'ผู้ใช้ U2 ลองใช้เว็บร้านกะเพราลุงโต้ง' },
  { src: '/impact3.jpg', alt: 'ผู้ใช้ U3 ลองใช้เว็บร้านกะเพราลุงโต้ง' },
];

const improvements = [
  'ขยายปุ่ม "ไปที่ตะกร้า" ให้ใหญ่ขึ้น กดง่ายสำหรับผู้สูงอายุ ตามที่ผู้ใช้ U3 แนะนำ',
];

const userCount = computed(() => new Set(rows.value.map((r) => r.user_code)).size);
const quotes = computed(() => rows.value.filter((r) => r.allow_quote && r.quote));

onMounted(async () => {
  const { data, error } = await supabase
    .from('impact_log')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) loadError.value = true;
  else rows.value = data;
  loading.value = false;
});
</script>

<style scoped>
.impact { padding: 16px; max-width: 900px; margin: 0 auto; }
.stat strong { font-size: 2rem; }
.quotes { list-style: none; padding: 0; }
.quotes li { margin: 12px 0; }
.photos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.photos figure { margin: 0; }
.photos img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
}
.photos figcaption { font-size: 0.9rem; margin-top: 4px; }
</style>