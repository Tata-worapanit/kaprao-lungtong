<template>
  <Panel>
    <template #header>🛒 ตะกร้าของฉัน</template>

    <p v-if="itemCount === 0">ยังไม่มีสินค้าในตะกร้า</p>
    <ul v-else>
      <li v-for="(item, index) in cart" :key="index">{{ item.title }} - {{ item.price }} บาท</li>
    </ul>

    <template #footer>
      <p>ยอดรวม {{ totalPrice }} บาท · ค่าส่ง {{ shippingFee }} บาท</p>
      <p><strong>ยอดสุทธิ {{ netTotal }} บาท</strong></p>
      <label for="ship-progress">ความคืบหน้าสู่ส่งฟรี {{ progress }}%</label>
      <progress id="ship-progress" :value="progress" max="100">{{ progress }}%</progress>
      <p v-if="remaining > 0">ซื้ออีก {{ remaining }} บาท ส่งฟรี!</p>
      <button @click="clearCart">ล้างตะกร้า</button>
      <button @click="router.push('/products')">เลือกซื้อต่อ</button>
    </template>
  </Panel>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
import Panel from '../components/Panel.vue';
import {
  cart, itemCount, totalPrice, shippingFee, netTotal, progress, remaining, clearCart,
} from '../store.js';

</script>