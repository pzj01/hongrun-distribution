<script setup lang="ts">
import { products } from '~/data/products'
import { PackagingType, type Product } from '~/types'

const route = useRoute()

// 模拟产品数据
const product = computed<Product>(() => products.find(p => p.id === +route.params.id)!)

watch(product, () => {
  scrollTo(0, 0)
})

// 格式化日期
function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 计算库存百分比
const stockPercentage = computed(() => {
  const maxStock = 1000 // 假设最大库存为1000
  return Math.min(Math.round((product.value.stockQuantity / maxStock) * 100), 100)
})

// 库存状态
const stockStatus = computed(() => {
  const percentage = stockPercentage.value
  if (percentage > 70)
    return '库存充足'
  if (percentage > 30)
    return '库存适中'
  return '库存紧张'
})

// 库存状态样式
const stockStatusClass = computed(() => {
  const percentage = stockPercentage.value
  if (percentage > 70)
    return 'text-green-600'
  if (percentage > 30)
    return 'text-yellow-600'
  return 'text-red-600'
})

const relatedProducts = computed(() => {
  return products.filter(p => p.id !== product.value.id && p.category === product.value.category).slice(0, 4)
})

// 产品批次相关
// 批次筛选控制
// const showBatchFilter = ref(false)
// function toggleBatchFilter() {
//   showBatchFilter.value = !showBatchFilter.value
// }

// 批次筛选条件
// const batchFilters = ref({
//   dateRange: null,
//   stockStatus: null,
//   packagingType: null,
// })

// enum StockStatus {
//   High = '库存充足',
//   Medium = '库存适中',
//   Low = '库存不足',
// }

// 库存状态选项
// const stockStatusOptions = ref([StockStatus.High, StockStatus.Medium, StockStatus.Low])

// 包装类型选项
// const packagingTypeOptions = ref(PackagingTypeList)

// 重置批次筛选
// function resetBatchFilters() {
//   batchFilters.value = {
//     dateRange: null,
//     stockStatus: null,
//     packagingType: null,
//   }
// }

// 应用批次筛选
// function applyBatchFilters() {
//   // 实际应用中这里会调用API获取筛选后的数据
//   console.log('应用批次筛选:', batchFilters.value)
//   showBatchFilter.value = false
// }

// 模拟产品批次数据
interface ProductBatch {
  batchId: string
  productionDate: Date
  expiryDate: Date
  quantity: number
  packagingType: string
}

const batchId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const productBatches = computed<ProductBatch[]>(() => {
  const batch = batchId[random(0, batchId.length - 1)]
  // eslint-disable-next-line ts/no-non-null-asserted-optional-chain
  const shelfLife = +product.value.shelfLife.match(/\d+/)?.[0]!
  return Array.from({ length: random(3, 10) }, (_, i) => {
    const year = product.value.date.getFullYear()
    const month = product.value.date.getMonth() + i
    const day = product.value.date.getDate() + 1

    return {
      batchId: `${batch}${i + 1}${year}${month}${day}${product.value.id}`,
      productionDate: product.value.date,
      expiryDate: new Date(year, month + shelfLife, day),
      quantity: random(100, 500),
      packagingType: product.value.packagingType,
    }
  })
})

// 获取库存百分比
function getStockPercentage(quantity: number): number {
  const maxStock = 300 // 假设单批次最大库存为300
  return Math.min(Math.round((quantity / maxStock) * 100), 100)
}

// 获取库存状态颜色
function getStockStatusColor(quantity: number): string {
  const percentage = getStockPercentage(quantity)
  if (percentage > 70)
    return 'bg-green-500'
  if (percentage > 30)
    return 'bg-yellow-500'
  if (percentage > 0)
    return 'bg-red-500'
  return 'bg-gray-500'
}

// 获取包装类型标签样式
function getPackagingSeverity(packagingType: string): string {
  switch (packagingType) {
    case PackagingType.Vacuum:
      return 'info'
    case PackagingType.Compressed:
      return 'success'
    case PackagingType.PlasticBag:
      return 'warning'
    case PackagingType.PaperBag:
      return 'primary'
    default:
      return 'secondary'
  }
}

// 检查是否即将到期
function isExpiringSoon(date: Date): boolean {
  const today = new Date()
  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(today.getDate() + 30)
  return date <= thirtyDaysLater && date >= today
}

// 计算总批次库存
const totalBatchStock = computed(() => {
  return productBatches.value.reduce((sum, batch) => sum + batch.quantity, 0)
})

// 获取最新批次日期
const latestBatchDate = computed(() => {
  const dates = productBatches.value.map(batch => batch.productionDate)
  return new Date(Math.max(...dates.map(date => date.getTime())))
})
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- 页面标题 -->
      <section class="relative overflow-hidden from-blue-900 to-blue-800 bg-gradient-to-r py-12 text-white md:py-16">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0 bg-repeat" style="background-image: url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E');" />
        </div>
        <div class="relative z-10 mx-auto max-w-7xl px-4">
          <div class="mb-2 flex items-center text-sm">
            <a href="/" class="transition-colors hover:text-sky-300">首页</a>
            <i class="pi pi-angle-right mx-2 text-xs" />
            <a href="/products" class="transition-colors hover:text-sky-300">产品中心</a>
            <i class="pi pi-angle-right mx-2 text-xs" />
            <span>{{ product.name }}</span>
          </div>
          <h1 class="text-3xl font-bold md:text-4xl">
            {{ product.name }}
          </h1>
        </div>
        <!-- 波浪分隔符 -->
        <div class="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="h-auto w-full">
            <path fill="#F9FAFB" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      <!-- 产品详情内容 -->
      <section class="px-4 py-8">
        <div class="mx-auto max-w-7xl">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <!-- 左侧产品图片 -->
            <div class="lg:col-span-5">
              <div class="overflow-hidden rounded-xl bg-white shadow-md">
                <div class="relative pb-[100%]">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="absolute inset-0 h-full w-full object-cover"
                  >
                  <div class="absolute right-4 top-4">
                    <span class="rounded-full bg-sky-500 px-3 py-1 text-xs text-white font-bold">
                      {{ product.category }}
                    </span>
                  </div>
                </div>
                <div class="border-t border-gray-100 p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <i class="pi pi-eye mr-1 text-gray-500" />
                      <span class="text-sm text-gray-500">1,234 次浏览</span>
                    </div>
                    <div class="flex space-x-2">
                      <button class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                        <i class="pi pi-share-alt text-gray-600" />
                      </button>
                      <button class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                        <i class="pi pi-heart text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 认证与报告 -->
              <div class="mt-6 rounded-xl bg-white p-6 shadow-md">
                <h3 class="mb-4 flex items-center text-lg text-blue-900 font-bold">
                  <i class="pi pi-verified mr-2 text-sky-500" />认证与报告
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="(cert, index) in product.certifications" :key="index"
                    class="flex items-center rounded-lg bg-gray-50 p-3"
                  >
                    <i class="pi pi-check-circle mr-2 text-green-500" />
                    <span class="text-sm text-gray-700">{{ cert }}</span>
                  </div>
                  <div v-if="product.testReport" class="flex items-center rounded-lg bg-gray-50 p-3">
                    <i class="pi pi-file-pdf mr-2 text-red-500" />
                    <a :href="product.testReport" target="_blank" class="text-sm text-sky-600 hover:underline">检测报告</a>
                  </div>
                  <div v-if="product.productionLicense" class="flex items-center rounded-lg bg-gray-50 p-3">
                    <i class="pi pi-id-card mr-2 text-blue-500" />
                    <span class="text-sm text-sky-600">生产许可认证</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧产品信息 -->
            <div class="lg:col-span-7">
              <div class="mb-6 rounded-xl bg-white p-6 shadow-md">
                <h2 class="mb-2 text-2xl text-blue-900 font-bold">
                  {{ product.name }}
                </h2>
                <p class="mb-4 text-gray-600">
                  {{ product.description }}
                </p>

                <div class="mb-4 flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in product.tags" :key="index"
                    class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="mb-4 border-t border-gray-100 pt-4">
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="flex items-center">
                      <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                        <i class="pi pi-tag text-blue-900" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">
                          价格
                        </p>
                        <p class="text-lg text-blue-900 font-bold">
                          ¥{{ product.price.toFixed(2) }} / {{ product.unit }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                        <i class="pi pi-box text-blue-900" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">
                          规格
                        </p>
                        <p class="text-lg text-blue-900 font-bold">
                          {{ product.weight }}{{ product.weightUnit }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                        <i class="pi pi-map-marker text-blue-900" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">
                          产地
                        </p>
                        <p class="text-lg text-blue-900 font-bold">
                          {{ product.origin }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                        <i class="pi pi-shopping-bag text-blue-900" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">
                          包装方式
                        </p>
                        <p class="text-lg text-blue-900 font-bold">
                          {{ product.packagingType }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                        <i class="pi pi-calendar text-blue-900" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">
                          生产日期
                        </p>
                        <p class="text-lg text-blue-900 font-bold">
                          {{ formatDate(product.date) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                        <i class="pi pi-clock text-blue-900" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">
                          保质期
                        </p>
                        <p class="text-lg text-blue-900 font-bold">
                          {{ product.shelfLife }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4 border-t border-gray-100 pt-4">
                  <h3 class="mb-3 text-lg text-blue-900 font-bold">
                    库存状态
                  </h3>
                  <div class="flex items-center">
                    <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div class="h-full bg-green-500" :style="{ width: `${stockPercentage}%` }" />
                    </div>
                    <span class="ml-3 text-sm font-medium" :class="stockStatusClass">{{ stockStatus }}</span>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-4">
                  <div class="flex flex-wrap gap-4">
                    <Button label="立即咨询" icon="pi pi-comments" class="border-blue-900 bg-blue-900" />
                    <Button label="获取报价" icon="pi pi-file-o" outlined class="border-blue-900 text-blue-900" />
                    <Button label="下载资料" icon="pi pi-download" text />
                  </div>
                </div>
              </div>

              <!-- 详细信息标签页 -->
              <div class="overflow-hidden rounded-xl bg-white shadow-md">
                <TabView>
                  <TabPanel header="产品概述">
                    <div class="p-6">
                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        产品介绍
                      </h3>
                      <p class="mb-6 text-gray-700">
                        {{ product.description }}
                      </p>

                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        品牌信息
                      </h3>
                      <div class="mb-6 flex items-center">
                        <div class="mr-4 h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100">
                          <i class="pi pi-building text-xl text-blue-900" />
                        </div>
                        <div>
                          <p class="text-gray-800 font-bold">
                            {{ product.brand }}
                          </p>
                          <p class="text-sm text-gray-600">
                            品牌来自{{ product.origin }}
                          </p>
                        </div>
                      </div>

                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        产品特点
                      </h3>
                      <div class="grid grid-cols-1 mb-6 gap-4 md:grid-cols-2">
                        <div
                          v-for="(characteristic, index) in product.processCharacteristics" :key="index"
                          class="flex items-start"
                        >
                          <div class="mr-3 h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-full bg-sky-100">
                            <i class="pi pi-star text-sky-500" />
                          </div>
                          <div>
                            <h4 class="mb-1 text-gray-800 font-bold">
                              {{ characteristic.name }}
                            </h4>
                            <p class="text-sm text-gray-600">
                              {{ characteristic.description }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        储存方法
                      </h3>
                      <div class="mb-6 rounded-lg bg-gray-50 p-4">
                        <p class="text-gray-700">
                          {{ product.storageMethod }}
                        </p>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel header="营养成分">
                    <div class="p-6">
                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        营养信息
                      </h3>
                      <p class="mb-4 text-gray-700">
                        {{ product.nutritionalInfo.description }}
                      </p>
                      <p class="mb-4 text-sm text-gray-500">
                        {{ product.nutritionalInfo.gContent }}
                      </p>

                      <div class="rounded-lg bg-gray-50 p-6">
                        <table class="w-full">
                          <thead>
                            <tr class="border-b border-gray-200">
                              <th class="py-2 text-left text-gray-700">
                                营养成分
                              </th>
                              <th class="py-2 text-right text-gray-700">
                                含量
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(ingredient, index) in product.nutritionalInfo.ingredients" :key="index"
                              class="border-b border-gray-200"
                            >
                              <td class="py-3 text-gray-800">
                                {{ ingredient.name }}
                              </td>
                              <td class="py-3 text-right text-gray-800">
                                {{ ingredient.weight }}{{ ingredient.unit }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel header="原材料成分">
                    <div class="p-6">
                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        原材料信息
                      </h3>

                      <div class="space-y-6">
                        <div
                          v-for="(material, index) in product.rawMaterials" :key="index"
                          class="rounded-lg bg-gray-50 p-6"
                        >
                          <h4 class="mb-2 text-lg text-blue-900 font-bold">
                            {{ material.name }}
                          </h4>
                          <p class="mb-4 text-gray-700">
                            {{ material.description }}
                          </p>

                          <div class="grid grid-cols-1 mb-4 gap-4 md:grid-cols-3">
                            <div class="rounded-lg bg-white p-4 shadow-sm">
                              <p class="mb-1 text-sm text-gray-500">
                                产地
                              </p>
                              <p class="text-gray-800 font-medium">
                                {{ material.origin }}
                              </p>
                            </div>
                          </div>

                          <h5 class="mb-3 text-gray-800 font-bold">
                            成分详情
                          </h5>
                          <div class="rounded-lg bg-white p-4 shadow-sm">
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div>
                                <p class="mb-1 text-sm text-gray-500">
                                  成分名称
                                </p>
                                <p class="text-gray-800 font-medium">
                                  {{ material.ingredient.name }}
                                </p>
                              </div>
                              <div>
                                <p class="mb-1 text-sm text-gray-500">
                                  来源
                                </p>
                                <p class="text-gray-800 font-medium">
                                  {{ material.ingredient.origin }}
                                </p>
                              </div>
                              <div>
                                <p class="mb-1 text-sm text-gray-500">
                                  功能
                                </p>
                                <p class="text-gray-800 font-medium">
                                  {{ material.ingredient.function }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel header="生产工艺">
                    <div class="p-6">
                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        生产流程
                      </h3>

                      <div class="relative">
                        <!-- 时间线 -->
                        <div class="absolute bottom-0 left-8 top-0 hidden w-1 bg-blue-200 md:block" />

                        <div class="space-y-8">
                          <div v-for="(step, index) in product.productionSteps" :key="index" class="relative">
                            <div class="flex items-start">
                              <div class="relative z-10 mr-4 h-16 w-16 flex flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <span class="text-xl text-blue-900 font-bold">{{ index + 1 }}</span>
                              </div>
                              <div class="flex-1 rounded-lg bg-gray-50 p-6">
                                <h4 class="mb-2 text-lg text-blue-900 font-bold">
                                  {{ step.name }}
                                </h4>
                                <p class="text-gray-700">
                                  {{ step.description }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 class="mb-4 mt-8 text-lg text-blue-900 font-bold">
                        工艺特点
                      </h3>
                      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div
                          v-for="(characteristic, index) in product.processCharacteristics" :key="index"
                          class="rounded-lg bg-gray-50 p-6"
                        >
                          <h4 class="mb-2 text-gray-800 font-bold">
                            {{ characteristic.name }}
                          </h4>
                          <p class="text-gray-700">
                            {{ characteristic.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel header="烹饪提示">
                    <div class="p-6">
                      <h3 class="mb-4 text-lg text-blue-900 font-bold">
                        烹饪建议
                      </h3>

                      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div
                          v-for="(tip, index) in product.cookingTips" :key="index"
                          class="rounded-lg bg-gray-50 p-6"
                        >
                          <div class="flex items-start">
                            <div class="mr-4 h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-full bg-sky-100">
                              <i class="pi pi-info-circle text-sky-500" />
                            </div>
                            <p class="text-gray-700">
                              {{ tip }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </div>
            <div lg:col-span-12>
              <!-- 产品批次信息 -->
              <div class="mb-6 rounded-xl bg-white p-6 shadow-md">
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="flex items-center text-lg text-blue-900 font-bold">
                    <i class="pi pi-box mr-2 text-sky-500" />产品批次信息
                  </h3>
                  <!-- <Button
                    icon="pi pi-filter"
                    label="筛选批次"
                    outlined
                    class="p-button-sm border-blue-900 text-blue-900"
                    @click="toggleBatchFilter"
                  /> -->
                </div>

                <!-- 批次筛选面板
                <div v-if="showBatchFilter" class="mb-4 rounded-lg bg-gray-50 p-4">
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label class="mb-1 block text-sm text-gray-700 font-medium">生产日期范围</label>
                      <Calendar
                        v-model="batchFilters.dateRange"
                        selection-mode="range"
                        date-format="yy-mm-dd"
                        placeholder="选择日期范围"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label class="mb-1 block text-sm text-gray-700 font-medium">库存状态</label>
                      <Dropdown
                        v-model="batchFilters.stockStatus"
                        :options="stockStatusOptions"
                        placeholder="选择库存状态"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label class="mb-1 block text-sm text-gray-700 font-medium">包装方式</label>
                      <Dropdown
                        v-model="batchFilters.packagingType"
                        :options="packagingTypeOptions"
                        placeholder="选择包装方式"
                        class="w-full"
                      />
                    </div>
                  </div>
                  <div class="mt-4 flex justify-end">
                    <Button
                      label="重置"
                      icon="pi pi-refresh"
                      text
                      class="mr-2"
                      @click="resetBatchFilters"
                    />
                    <Button
                      label="应用筛选"
                      icon="pi pi-check"
                      class="p-button-sm border-blue-900 bg-blue-900"
                      @click="applyBatchFilters"
                    />
                  </div>
                </div> -->

                <!-- 批次表格 -->
                <DataTable
                  :value="productBatches"
                  :paginator="true"
                  :rows="5"
                  :rows-per-page-options="[5, 10, 20]"
                  responsive-layout="scroll"
                  striped-rows
                  class="p-datatable-sm"
                >
                  <Column field="batchId" header="批次号" sortable style="width: 15%">
                    <template #body="{ data }">
                      <span class="text-blue-900 font-medium">#{{ data.batchId }}</span>
                    </template>
                  </Column>

                  <Column field="productionDate" header="生产日期" sortable style="width: 20%">
                    <template #body="{ data }">
                      <div class="flex items-center">
                        <i class="pi pi-calendar mr-2 text-gray-500" />
                        <span>{{ formatDate(data.productionDate) }}</span>
                      </div>
                    </template>
                  </Column>

                  <Column field="expiryDate" header="到期日期" sortable style="width: 20%">
                    <template #body="{ data }">
                      <div class="flex items-center">
                        <i class="pi pi-calendar-times mr-2 text-gray-500" />
                        <span>{{ formatDate(data.expiryDate) }}</span>
                        <Tag
                          v-if="isExpiringSoon(data.expiryDate)"
                          value="即将到期"
                          severity="warning"
                          class="ml-2"
                        />
                      </div>
                    </template>
                  </Column>

                  <Column field="quantity" header="库存数量" sortable style="width: 20%">
                    <template #body="{ data }">
                      <div>
                        <div class="flex items-center">
                          <span class="font-medium">{{ data.quantity }}</span>
                          <span class="ml-1 text-gray-500">{{ product.unit }}</span>
                        </div>
                        <div class="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            class="h-full rounded-full"
                            :class="getStockStatusColor(data.quantity)"
                            :style="{ width: `${getStockPercentage(data.quantity)}%` }"
                          />
                        </div>
                      </div>
                    </template>
                  </Column>

                  <Column field="packagingType" header="包装方式" style="width: 15%">
                    <template #body="{ data }">
                      <Tag :value="data.packagingType" :severity="getPackagingSeverity(data.packagingType)" />
                    </template>
                  </Column>

                  <!-- <Column header="操作" style="width: 10%">
                    <template #body="{ data }">
                      <div class="flex space-x-1">
                        <Button
                          v-tooltip.top="'查看详情'"
                          icon="pi pi-eye"
                          class="p-button-rounded p-button-text p-button-sm"
                        />
                        <Button
                          v-tooltip.top="'下载批次报告'"
                          icon="pi pi-download"
                          class="p-button-rounded p-button-text p-button-sm"
                        />
                      </div>
                    </template>
                  </Column> -->
                </DataTable>

                <!-- 批次统计信息 -->
                <div class="grid grid-cols-1 mt-4 gap-4 md:grid-cols-3">
                  <div class="flex items-center rounded-lg bg-gray-50 p-4">
                    <div class="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                      <i class="pi pi-box text-blue-900" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">
                        总批次数
                      </p>
                      <p class="text-lg text-blue-900 font-bold">
                        {{ productBatches.length }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center rounded-lg bg-gray-50 p-4">
                    <div class="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                      <i class="pi pi-shopping-cart text-green-600" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">
                        总库存量
                      </p>
                      <p class="text-lg text-green-600 font-bold">
                        {{ totalBatchStock }} {{ product.unit }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center rounded-lg bg-gray-50 p-4">
                    <div class="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100">
                      <i class="pi pi-calendar text-yellow-600" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">
                        最新批次
                      </p>
                      <p class="text-lg text-yellow-600 font-bold">
                        {{ formatDate(latestBatchDate) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 相关产品推荐 -->
      <section class="bg-gray-100 px-4 py-12">
        <div class="mx-auto max-w-7xl">
          <div class="mb-8 flex items-center justify-between">
            <h2 class="text-2xl text-blue-900 font-bold">
              相关产品推荐
            </h2>
            <Button label="查看更多" icon="pi pi-arrow-right" text class="text-blue-900" />
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-2">
            <div
              v-for="p, i in relatedProducts" :key="i"
              class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div class="relative">
                <img :src="p.image" alt="相关产品" class="h-48 w-full object-cover">
                <div class="absolute right-0 top-0 m-2">
                  <span class="rounded-full bg-sky-500 px-2 py-1 text-xs text-white font-bold">
                    {{ p.category }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="mb-1 text-lg text-blue-900 font-bold">
                  {{ p.name }}
                </h3>
                <p class="line-clamp-2 mb-3 text-sm text-gray-600">
                  {{ p.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-sky-600 font-bold">¥{{ p.price }} / {{ p.unit }}</span>
                  <Button label="查看详情" icon="pi pi-eye" class="p-button-sm border-blue-900 bg-blue-900" @click="$router.push(`/details/${p.id}`)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 咨询与合作 -->
      <section class="from-blue-900 to-blue-800 bg-gradient-to-r px-4 py-12 text-white">
        <div class="mx-auto max-w-7xl text-center">
          <h2 class="mb-6 text-3xl font-bold">
            需要更多产品信息？
          </h2>
          <p class="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            如果您对该产品有任何疑问或需要定制化服务，请随时与我们联系
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <Button
              label="立即咨询" icon="pi pi-comments"
              class="border-white bg-white text-blue-900 hover:bg-gray-100"
            />
            <Button
              label="获取报价" icon="pi pi-file-o" outlined
              class="border-white text-white hover:bg-white/10"
            />
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style scoped>
/* 自定义样式 */
:deep(.p-tabview .p-tabview-nav) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  color: #64748b;
  padding: 1rem 1.5rem;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  border-bottom: 2px solid #0ea5e9;
  color: #0ea5e9;
}

:deep(.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled):hover .p-tabview-nav-link) {
  border-bottom: 2px solid #e0f2fe;
  color: #0ea5e9;
}

:deep(.p-tabview-panels) {
  padding: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
