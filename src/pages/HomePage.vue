<template>
  <section class="home">
    <h1>🍳 ร้านกะเพราลุงโต้ง</h1>
    <p class="tagline">ร้านอาหารตามสั่ง หน้ามหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ ศูนย์สุพรรณบุรี</p>

    <ul class="info">
      <li>🕙 เปิดทุกวัน 10:00–20:00 น.</li>
      <li>📍 หน้ามหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ ศูนย์สุพรรณบุรี</li>
      <li>🌶️ กะเพรา ข้าวผัด ไข่เจียว อาหารตามสั่งหลากหลายเมนู</li>
    </ul>

    <router-link class="cta" to="/products">ดูเมนูทั้งหมด →</router-link>
  </section>
</template>

<style scoped>
.home { text-align: center; padding: 16px; }
.tagline { font-size: 1.1rem; }
.info { list-style: none; padding: 0; margin: 16px 0; line-height: 2; }
.cta {
  display: inline-block;
  min-height: 44px;
  padding: 10px 20px;
  border-radius: 10px;
  background: #0E8C7B;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
</style>