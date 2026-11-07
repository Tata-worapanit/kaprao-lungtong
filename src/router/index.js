import ImpactPage from '../pages/ImpactPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ProductsPage from '../pages/ProductsPage.vue';
import ProductDetailPage from '../pages/ProductDetailPage.vue';
import CartPage from '../pages/CartPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import { user, authReady } from '../store.js';

// ตารางจับคู่ path -> component (หน้า)
const routes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductsPage },
  { path: '/product/:id', component: ProductDetailPage },
  { path: '/cart', component: CartPage },
  { path: '/login', component: LoginPage },
  { path: '/admin', component: AdminPage, meta: { requiresLogin: true } },
  { path: '/impact', component: ImpactPage }
];

// 1. ประกาศสร้าง router ก่อน (ต้องอยู่ตรงนี้!)
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
    if (to.meta.requiresLogin) {
        await authReady;                  // รอให้รู้ก่อนว่าล็อกอินค้างไว้ไหม (สำคัญตอนกด F5)
        if (!user.value) return '/login'; // ยังไม่ล็อกอิน -> ไปหน้าเข้าสู่ระบบ
    }
});

router.afterEach(() => {
  document.getElementById('main')?.focus();
});

export default router;