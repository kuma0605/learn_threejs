<script setup>
import { onMounted,ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useShareStore } from "@/stores/share";
import customSubmenu from "@/components/customSubmenu.vue";
const shares = useShareStore();
const expanded = ref([]);
const activeTab = ref("");
const collapsed = ref(false);
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};
const menuList = shares.menuList;
</script>

<template>
  <div class="flex h-vh">
    <div class="w-fit h-full">
        <!-- 菜单 -->
        <t-menu
          v-model:value="activeTab"
          v-model:expanded="expanded"
          theme="light"
          expand-mutex
          :collapsed="collapsed"
        >
          <custom-submenu :menu-list="menuList" />
          <template #operations>
            <t-button variant="text" shape="square" @click="changeCollapsed">
              <template #icon><t-icon name="view-list" /></template>
            </t-button>
          </template>
        </t-menu>
    </div>
    <div class="flex-1 h-full">
      <RouterView></RouterView>
    </div>
  </div>
</template>


