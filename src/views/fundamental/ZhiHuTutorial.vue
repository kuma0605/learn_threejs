<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
function main() {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

  // 透视摄像机(PerspectiveCamera)
  const fov = 75
  const aspect = 2 // 相机默认值
  const near = 0.1
  const far = 10
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 5
  camera.position.y = 2

  // 一个场景(Scene)
  const scene = new THREE.Scene()

  {
    const color = 0xffffff
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const gridHelper = new THREE.GridHelper()
  scene.add(gridHelper)

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const box = new THREE.Mesh(geometry, material)
  scene.add(box)

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = Math.floor(canvas.clientWidth * pixelRatio)
    const height = Math.floor(canvas.clientHeight * pixelRatio)
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  function animate() {
    box.rotation.x += 0.01
    box.rotation.y += 0.01

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)
  }



  renderer.setAnimationLoop(animate)
}
onMounted(() => {
  main()
})
</script>
<template>
  <canvas id="c" class="w-full h-full"></canvas>
</template>
