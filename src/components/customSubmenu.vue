<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router"; // 引入userRouter
import customSubmenu from "@/components/customSubmenu.vue";
const router = useRouter();
defineProps({
  menuList: {
    type: Array,
    required: true,
  },
});
const goPage = (name) => {
  if (name.includes("/")) {
    router.push(name);
  } else {
    router.push({ name });
  }
};

const checkMenu = (menu) => {
  // 判断是不是最后一层菜单
  let notLastMenu = true;
  notLastMenu = menu.children && menu.children.length > 0;
  if (notLastMenu) {
    notLastMenu = menu.children[0].level != "BUTTON";
  }
  return notLastMenu;
};
</script>

<template>
  <template v-for="(menu, index) in menuList" :key="index">
    <t-submenu :value="menu.id" v-if="checkMenu(menu) && menu.enable">
      <template #icon>
        <img
          v-if="menu.icon"
          :src="menu.icon"
          class="w-[24px] h-[24px]"
          alt="icon"
        />
      </template>
      <template #title>
        <span class="ml-[12px]">{{ menu.name }}</span>
      </template>
      <custom-submenu :menu-list="menu.children" />
    </t-submenu>
    <t-menu-item
      v-else-if="menu.enable"
      :value="menu.router"
      @click="goPage(menu.router)"
    >
      <template #icon>
        <img
          v-if="menu.icon"
          :src="menu.icon"
          class="w-[24px] h-[24px]"
          alt="icon"
        />
      </template>
      <span class="ml-[12px]">{{ menu.name }}</span>
    </t-menu-item>
  </template>
</template>
