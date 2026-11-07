<template>
    <Panel>
        <template #header>🥣สินค้าจากชุมชน</template>

        <!-- 1) กำลังโหลด -->
        <p v-if="loading" role="status">⌛ กำลังโหลดสินค้า...</p>

        <!-- 2) โหลดผิดพลาด: บอกผู้ใช้ + ให้ทดลองใหม่ได้ -->
        <div v-else-if="errorMsg" role="alert">
            <p>{{ errorMsg }}</p>
            <button @click="loadProducts">ลองใหม่</button>
        </div>

<!-- 3) โหลดสำเร็จ: วนแสดงการ์ดเหมือนเดิม (v-else ต่อจากสองกรณีข้างบน) -->

        <ProductCard
          v-else
          v-for="item in products"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :price="item.price"
          :image="item.image"
          :desc="item.desc"
          @add="addToCart"/>

        <template #footer>
         <p aria-live="polite">🧺 ตะกร้าสินค้า: {{itemCount}}ชิ้น - ยอดรวม {{ totalPrice }}บาท</p>
         <p role="status" aria-live="polite">{{ notice }}</p>
         <router-link class="cart-btn" to="/cart">🧺 ไปที่ตะกร้า →</router-link>
        </template>
    </Panel>
</template>

<script setup>
import Panel from '../components/Panel.vue';
import ProductCard from '../components/ProductCard.vue';
import {
  products, itemCount, totalPrice, notice, addToCart,
  loading, errorMsg, loadProducts,
} from '../store.js';
</script>