<template>
  <p v-if="loading" role="status">⌛กำลังโหลดสินค้า...</p>

  <section v-else-if="product">
    <h1>{{ product.title }}</h1>
    <img :src="product.image" :alt="product.title" width="200">
    <p>ราคา {{ product.price }} บาท</p>
    <button @click="buyNow">🛍️ ซื้อเลย</button>
    <p><router-link to="/products">← กลับรายการสินค้า</router-link></p>
  </section>

  <!-- ถ้าพิมพ์ id ที่ไม่มีอยู่จริง เช่น /product/99 -->
  <section v-else>
    <h1>ไม่พบสินค้ารหัส {{ route.params.id }}</h1>
    <router-link to="/products">← กลับรายการสินค้า</router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { products, addToCart, loading } from '../store.js';

const route = useRoute();     // อ่าน "ข้อมูล" ของเส้นทางปัจจุบัน (params)
const router = useRouter();   // "ตัวสั่ง" เปลี่ยนหน้า (push)

// route.params.id เป็นข้อความเสมอ ("2") ต้องแปลงเป็นตัวเลขก่อนเทียบกับ id
const product = computed(() =>
  products.value.find((p) => p.id === Number(route.params.id))
);

function buyNow() {
  const p = product.value;
  addToCart({ id: p.id, title: p.title, price: p.price });
  router.push('/cart');     // พาผู้ใช้ไปหน้าตะกร้าทันที
}
</script>