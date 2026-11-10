<script setup lang="ts">
/** Kartenzustand als Ampel-Tag (MT/NM grün … PO rot), voller Name als Tooltip bzw. mit `long` ausgeschrieben. */
import type { TagTone } from './Tag.vue'

const props = withDefaults(defineProps<{ condition: string, long?: boolean }>(), { long: false })
const tone = computed(() => ((CONDITION_ORDER as readonly string[]).includes(props.condition) ? props.condition : 'neutral') as TagTone)
</script>

<template>
  <Tag :tone="tone" :title="conditionLabel(condition)">
    {{ long ? conditionLabel(condition) : (CONDITION_SHORT[condition] ?? condition) }}
  </Tag>
</template>
