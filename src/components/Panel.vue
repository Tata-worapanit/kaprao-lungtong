<template>
    <section class="panel">

        <header class="panel-head">
            <slot name="header">หัวข้อเริ่มต้น</slot>
        </header>

        <div class="panel-body"> 
            <slot></slot>
        </div>

        <footer class="panel-foot">
            <slot name="footer"></slot>
        </footer>
    </section>
</template>

<style scoped>
.panel { border: 1px solid #e7e2d6; border-radius: 14px; overflow: hidden; margin: 16px 0; }
.panel-head { background: #0e8c7b; color: #fff; padding: 12px 16px; font-weight: 600; }
.panel-body { padding: 16px;}
.panel.foot { border-top: 1px solid #eee; padding: 12px 16px; background: #fbfaf6; }
</style>