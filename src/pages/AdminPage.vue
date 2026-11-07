<template>
  <section>
    <h1>หลังบ้าน (เฉพาะผู้ดูแล)</h1>
    <p>จำนวนสินค้าในร้าน: {{ products.length }} รายการ</p>
    <p>ยอดสุทธิในตะกร้าตอนนี้: {{ netTotal }} บาท</p>

    <h2>เพิ่มสินค้าใหม่</h2>
    <!-- .prevent = ไม่ให้เบราว์เซอร์โหลดหน้าใหม่ตอนกดส่งฟอร์ม -->
    <form @submit.prevent="submitProduct">
      <p>
       <label for="new-title">ชื่อสินค้า</label>
       <input id="new-title" v-model.trim="newTitle" required>
      </p>
      <p>
       <label for="new-price">ราคา (บาท)</label>
       <input id="new-price" v-model.number="newPrice" type="number" min="0" required>
       <p>
        <label for="new-image">ลิงก์รูปภาพ (ไม่บังคับ)</label>
        <input id="new-image" v-model.trim="newImage" type="url">
       </p>
      </p>
      <button type="submit" :disabled="saving">
        {{ saving ? 'กำลังบันทึก...' : 'บันทึกสินค้า' }}
      </button>
    </form>
    <!-- ผลการบันทึก/แก้/ลบ: screen reader อ่านให้เอง -->
    <p role="status" aria-live="polite">{{ formMsg }}</p>

    <h2>จัดการสินค้า</h2>
    <table>
      <caption>สินค้าทั้งหมด {{ products.length }} รายการ</caption>
      <thead>
        <tr><th scope="col">ชื่อสินค้า</th><th scope="col">ราคา</th><th scope="col">จัดการ</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.title }}</td>
          <td>{{ p.price }} บาท</td>
          <td>
            <button @click="changePrice(p, 10)" :aria-label="'เพิ่มราคา ' + p.title + ' 10 บาท '">+10</button>
            <button @click="changePrice(p, -10)" :disabled="p.price < 10 " :aria-label="'ลดราคา ' + p.title + '10 บาท '">-10</button>
            <button @click="setPrice(p)" :aria-label="'ตั้งราคา ' + p.title">✏️ ตั้งราคา</button>
            <button @click="removeProduct(p)" :aria-label="'ลบ ' + p.title">🗑️ ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { products, netTotal, addProduct, updatePrice, deleteProduct } from '../store.js';

const newTitle = ref('');
const newPrice = ref(0);
const newImage = ref('');
const saving = ref(false);    // กันกดซ้ำระหว่างรอ Supabase ตอบ
const formMsg = ref('');

async function submitProduct() {
  saving.value = true;
  const problem = await addProduct({ title: newTitle.value, price: newPrice.value, image: newImage.value });
  saving.value = false;
  if (problem) {
    formMsg.value = '❌ บันทึกไม่สำเร็จ: ' + problem;
    return;
  }
  formMsg.value = `✅ เพิ่ม "${newTitle.value}" แล้ว`;
  newTitle.value = '';    // ล้างฟอร์ม รอรายการถัดไป
  newPrice.value = 0;
}

async function changePrice(p, step) {
    const newPrice = p.price + step;
    const problem = await updatePrice(p.id, newPrice);
    formMsg.value = problem ? '❌ แก้ไม่สำเร็จ: ' + problem : `✅ ${p.title} ราคาใหม่ ${newPrice} บาท`;
}

async function setPrice(p) {
    const text = prompt(`ราคาใหม่ของ ${p.title} (บาท)`, p.price);
    if (text === null) return;       // กดยกเลิก
    const newPrice = Number(text);
    if (!Number.isInteger(newPrice) || newPrice < 0) {
        formMsg.value = '❌ ราคาต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป';
        return;
    }
    const problem = await updatePrice(p.id, newPrice);
    formMsg.value = problem ? '❌ แก้ไม่สำเร็จ: ' + problem : `✅ ${p.title} ราคาใหม่ ${newPrice} บาท`;
}

async function removeProduct(p) {
    // ถามยืนยันก่อนเสมอ – ลบแล้วกู้คืนไม่ได้
    if (!confirm(`ลบ "${p.title}" ออกจากร้านจริงไหม`)) return;
    const problem = await deleteProduct(p.id);
    formMsg.value = problem ? '❌ ลบไม่สำเร็จ: ' + problem : `🗑️ ลบ ${p.title} แล้ว`;
}

</script>