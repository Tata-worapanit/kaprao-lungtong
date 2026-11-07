<template>
    <article class="card">
        <img v-if="props.image" :src="props.image" :alt="props.title" width="110">
        <h3>{{ props.title }}</h3>
        <p>ราคา {{ props.price }} บาท</p>
        <router-link :to="'/product/' + props.id" :aria-label="'ดูรายละเอียด ' + props.title">ดูรายละเอียด</router-link>
        <p class="desc">{{ props.desc }}</p>
        <button
            :aria-label="'เพิ่ม ' + props.title + ' ลงตะกร้า'"
            @click="emit('add', { id: props.id, title: props.title, price: props.price })">🧺 เพิ่มลงตะกร้า</button>
        <button
            :aria-label="'ถูกใจ ' + props.title"
            @click="emit('favorite', props.title)">❤️ ถูกใจ</button>
    </article>
</template>

<script setup>

const props = defineProps({
    id:    {type: Number, required: true},
    title: {type: String, required: true},
    price: {type: Number, default: 0},
    image: {type: String, default: ''},
    desc:  {type: String, default: ''},
});

const emit = defineEmits(['add', 'favorite']);

</script>


<style scoped>
.card { border: 1px solid #e7e2d6; border-radius: 12px; padding: 14px; margin: 8px 0; }
</style>