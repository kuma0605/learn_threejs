<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref(null) // 创建一个 ref 来引用容器元素
let renderer = null // 将 renderer 提升到外部作用域以便清理

onMounted(() => {
  //   第一步：我们需要一个<canvas>标签
  //   const canvas = document.querySelector('#c')
  const canvas = container.value

  //   第二步：Three.js需要使用这个canvas标签来绘制，所以我们要先获取它然后传给three.js。
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

  //   第三步：接下来我们需要一个透视摄像机(PerspectiveCamera)。

  //   fov是视野范围(field of view)的缩写。它是通过摄像机的透镜所能看到的最大角度。
  //   注意three.js中大多数的角用弧度表示，但是因为某些原因透视摄像机使用角度表示。
  const fov = 75

  //   aspect指画布的宽高比。
  //   在默认情况下 画布是300x150像素，所以宽高比为300/150或者说2。
  const aspect = 2 // 相机默认值

  //   near和far代表近平面和远平面，它们限制了摄像机面朝方向的可绘区域。
  //   任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)。
  const near = 0.1
  const far = 5

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  //   这四个参数定义了一个 "视椎(frustum)"。
  //   视椎(frustum)是指一个像被削去顶部的金字塔形状。
  //   换句话说，可以把"视椎(frustum)"想象成其他三维形状如球体、立方体、棱柱体、截椎体。

  //   近平面和远平面的高度由视野范围决定，宽度由视野范围和宽高比决定。
  //   视椎体内部的物体将被绘制，视椎体外的东西将不会被绘制。

  //   第四步：设置摄像机的位置
  //   摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。我们将会把立方体放置在坐标原点，所以我们需要往后移一下摄像机才能显示出物体。
  camera.position.z = 2

  //   第五步：创建一个场景
  //   场景(Scene)是three.js的基本的组成部分。需要three.js绘制的东西都需要加入到scene中。
  const scene = new THREE.Scene()
  //   然后创建一个包含盒子信息的立方几何体(BoxGeometry)。
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  //   然后创建一个基本的材质并设置它的颜色. 颜色的值可以用css方式和十六进制来表示。
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })
  //   然后创建一个网格(Mesh)，它是几何体和材质的组合。
  const cube = new THREE.Mesh(geometry, material)
  //   最后我们将网格添加到场景中。
  scene.add(cube)

  //   添加些光照效果
  {
    const color = 0xffffff
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  //   之后将场景和摄像机传递给渲染器来渲染出整个场景。
  renderer.render(scene, camera)

  function render(time) {
    time *= 0.001 // 将时间单位变为秒

    cube.rotation.x = time
    cube.rotation.y = time

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
})
</script>
<template>
  <canvas ref="container" id="c">
    <!-- Three.js 画布将挂载在这里 -->
  </canvas>
</template>

<style scoped></style>
