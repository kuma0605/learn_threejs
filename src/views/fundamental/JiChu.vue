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
  const far = 5
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 2

  // 一个场景(Scene)
  const scene = new THREE.Scene()

  {
    const color = 0xffffff
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  // 一个包含盒子信息的立方几何体(BoxGeometry)
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

  /* // 创建一个基本的材质并设置它的颜色
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })

  // 创建一个网格(Mesh)对象
  const cube = new THREE.Mesh(geometry, material)

  // 最后我们将网格添加到场景中。
  scene.add(cube)
  // 之后将场景和摄像机传递给渲染器来渲染出整个场景。
  // renderer.render(scene, camera); */

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color })

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    cube.position.x = x

    return cube
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ]

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

  function render(time) {
    // requestAnimationFrame会将页面开始加载到函数运行所经历的时间当作入参传给回调函数，单位是毫秒数
    console.log(time)
    time *= 0.001 // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    /* cube.rotation.x = time
    cube.rotation.y = time */

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
onMounted(() => {
  main()
})
</script>
<template>
  <canvas id="c" class="w-full h-full"></canvas>
</template>
