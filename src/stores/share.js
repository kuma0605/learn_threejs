import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { NotifyPlugin } from 'tdesign-vue-next'
import { axiosIns as request } from '@/httpService'

export const useShareStore = defineStore('share', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || {})
  const menuList = ref([
    {
      enable: true,
      id: 'fundamental',
      name: '基本',
      children: [
        {
          enable: true,
          id: 'JiChu',
          name: '基础',
          router:'/fundamental/JiChu',
        },
        {
          enable: true,
          id: 'ZhiHuTutorial',
          name: '知乎入门',
          router:'/fundamental/ZhiHuTutorial',
        },
      ],
    },
  ])
  const resourceTree = ref(JSON.parse(localStorage.getItem('resourceTree')) || {})
  const listTypeMap = reactive({})

  const openTabs = ref(JSON.parse(sessionStorage.getItem('openTabs')) || [])

  function setUser(nv) {
    user.value = nv
    localStorage.setItem('user', JSON.stringify(nv))
  }

  function setMenuList(nv) {
    menuList.value = nv
  }

  function setResourceTree(nv) {
    resourceTree.value = nv
    localStorage.setItem('resourceTree', JSON.stringify(nv))
  }

  function setTabs(nv) {
    openTabs.value = nv
    sessionStorage.setItem('openTabs', JSON.stringify(nv))
  }

  async function getListByType(typeValue) {
    var matchList = listTypeMap[typeValue]
    if (matchList == undefined) {
      await requestListByType(typeValue)
    }
    return listTypeMap[typeValue]
  }

  async function requestListByType(typeValue) {
    try {
      const options = {
        method: 'POST',
        data: {
          type: typeValue,
        },
        url: '/sys/dictData/findListByType',
      }
      let res = await request(options)
      if (res.data.code == 200) {
        listTypeMap[typeValue] = res.data.data
        return listTypeMap[typeValue]
      } else {
        NotifyPlugin('error', { title: res.data.message })
      }
    } catch (err) {
      console.log(err)
      NotifyPlugin('error', { title: err.message })
    }
  }

  return {
    user,
    setUser,
    menuList,
    setMenuList,
    resourceTree,
    setResourceTree,
    getListByType,
    openTabs,
    setTabs,
  }
})
