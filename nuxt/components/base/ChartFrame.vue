<script setup lang="ts">
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

/** Rahmen für alle Diagramme (Apache ECharts): feste Höhe, nur im Browser, passt sich der Breite an, mit Beschreibung für Screenreader. */
withDefaults(defineProps<{ option: EChartsOption, label: string, height?: number }>(), { height: 220 })
</script>

<template>
  <ClientOnly>
    <VChart :option="option" autoresize :style="{ height: `${height}px` }" role="img" :aria-label="label" />
    <template #fallback>
      <div :style="{ height: `${height}px` }" />
    </template>
  </ClientOnly>
</template>
