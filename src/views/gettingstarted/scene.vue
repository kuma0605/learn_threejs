<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref(null) // 创建一个 ref 来引用容器元素
let renderer = null // 将 renderer 提升到外部作用域以便清理
let animationFrameId = null // 用于存储 requestAnimationFrame 的 ID
let scene = null // 提升到外部
let camera = null // 提升到外部

const handleResize = () => {
  if (container.value && renderer) {
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
}

onMounted(() => {
  // --- Three.js 初始化代码 ---
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000,
  )

  renderer = new THREE.WebGLRenderer({ antialias: true }) // 在 onMounted 内部初始化
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio) // 优化高分屏显示
  container.value.appendChild(renderer.domElement) // 挂载到 ref 引用的元素

  // 添加一个简单的立方体作为示例
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.z = 5

  // 动画循环
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
  }

  window.addEventListener('resize', handleResize)

  animate() // 开始动画
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId) // 停止动画
  }
  if (renderer) {
    renderer.dispose() // 释放渲染器资源
    if (renderer.domElement && container.value) {
      // 确保 domElement 存在且父节点也存在
      try {
        container.value.removeChild(renderer.domElement) // 移除 canvas
      } catch (e) {
        console.error('Failed to remove renderer DOM element:', e)
      }
    }
  }
  window.removeEventListener('resize', handleResize) // 移除事件监听器
  // 其他 Three.js 对象的清理（如果需要）
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose()
    }
    if (object.material) {
      // If the material is an array, dispose each material individually.
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose())
      } else {
        object.material.dispose()
      }
    }
  })
})
</script>
<template>
  <div ref="container" style="width: 100%; height: 100vh">
    <!-- Three.js 画布将挂载在这里 -->
  </div>
</template>

<style scoped>
/* 添加一些基本样式，确保容器占满屏幕 */
div {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止滚动条出现 */
}
</style>
