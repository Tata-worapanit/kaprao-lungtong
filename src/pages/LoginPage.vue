<template>
  <section>
    <h1>เข้าสู่ระบบผู้ดูแล</h1>
    <form @submit.prevent="login">
      <p>
        <label for="email">อีเมล</label>
        <input id="email" v-model.trim="email" type="email" autocomplete="username" required>
      </p>
      <p>
        <label for="password">รหัสผ่าน</label>
        <input id="password" v-model="password" :type="showPw ? 'text' : 'password'" autocomplete="current-password" required>
        <button type="button" @click="showPw = !showPw" :aria-pressed="showPw">
          {{ showPw ? '🙈 ซ่อนรหัส' : '👁️ แสดงรหัส' }}
        </button>
      </p>
      <button type="submit" :disabled="busy">
        {{ busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}
      </button>
    </form>
    <!-- role=alert: ถ้ารหัสผิด screen reader อ่านให้ทันที -->
    <p role="alert">{{ message }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signIn } from '../store.js';

const email = ref('');
const password = ref('');
const busy = ref(false);      // กันกดซ้ำระหว่างรอ
const message = ref('');
const showPw = ref(false);    // แสดง/ซ่อนรหัสผ่าน
const router = useRouter();

async function login() {
  busy.value = true;
  message.value = await signIn(email.value, password.value);
  busy.value = false;
  if (!message.value) router.push('/admin');   // สำเร็จ → เข้าหลังบ้าน
}
</script>