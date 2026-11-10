import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'

/** Registriert nur die ECharts-Teile, die Shop und CMS nutzen (hält das Bundle klein). Neue Diagrammarten hier ergänzen. */
export default defineNuxtPlugin(() => {
  use([CanvasRenderer, BarChart, LineChart, PieChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent])
})
