<template>
<v-container fluid pa-0>
  <v-flex xs12>
      <v-tabs>

        <!-- Tabs Bar -->
        <v-tabs-bar>
          <v-tabs-item href='#plot' ripple>
            Plot
          </v-tabs-item>
          <v-tabs-item href='#data-table' ripple>
            Data Table
          </v-tabs-item>
          <v-tabs-slider color='accent'></v-tabs-slider>
        </v-tabs-bar>

        <!-- First level of tab items  -->
        <v-tabs-items>
          <v-tabs-content id='plot'>
            <v-layout row wrap>

              <!-- Chart container -->
              <v-flex xs12 :id='`stitch-chart-wrapper-${ID}`' text-xs-center mb-3>
                <svg :class='`stitch-chart stitch-chart-${ID}`' />
              </v-flex>

              <v-flex xs12>
                <v-toolbar height='auto' flat>
                  <v-container class='pa-0' fluid>
                    <v-layout row wrap class='pa-0'>
                      <v-reset-chart-button @reset-chart='resetChart' :disable='filesSelected.length === 0'></v-reset-chart-button>
                      <v-export-chart-button :ID='ID' :selection='`stitch-chart-${ID}`' :disable='filesSelected.length === 0'></v-export-chart-button>
                      <v-legend-button @toggle-legend='showLegend = !showLegend' @close-legend='showLegend = false' :disable='filesSelected.length === 0'></v-legend-button>

                      <slot name='toolbar-slot'
                        :toggle-edit='toggleEdit'
                        :remove-brushes='removeBrushes'
                        :stitch-data='stitchData'
                        :remove-stitch-line='removeStitchLine'
                        :draw-saved-brushes='drawSavedBrushes'
                        :files-selected='filesSelected'
                      ></slot>

                      <v-spacer></v-spacer>
                      <!-- scatter point hover values -->
                      <v-subheader class='hidden-sm-and-down' v-if='filesSelected.length > 0 && xPoint'>
                        <span class='mr-2'>X: {{xPoint.toExponential(2)}}</span>
                        <span class='mr-2'>Y: {{yPoint.toExponential(2)}}</span>
                        <span class='mr-2'>Error: {{errorPoint.toExponential(2)}}</span>
                      </v-subheader>
                      <v-spacer></v-spacer>
                      <v-btn :icon='!isBreakpointSmall' flat @click='showTabs = !showTabs' v-if='stitchedData.length > 0'>
                        <v-icon small>{{ showTabs ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
                      </v-btn>
                    </v-layout>
                  </v-container>
                </v-toolbar>
              </v-flex>

              <slot name='tabs-slot'
                :show-tabs='showTabs'
                :files-selected='filesSelected'
                :stitched-data='stitchedData'
                :brush-selections='brushSelections'
              ></slot>
            </v-layout>
          </v-tabs-content>

          <!-- Plotted Data Table -->
          <v-tabs-content id='data-table'>
            <v-card flat>
              <v-card-text>
                <v-plotted-data-table :plotted-data='preparedData.map(d => d.values).reduce((a,b) => a.concat(b), [])' :files='filesSelected' />
              </v-card-text>
            </v-card>
          </v-tabs-content>

        </v-tabs-items>
      </v-tabs>
  </v-flex>

  <v-legend
    :drawer-right='showLegend'
    :color-scale='colorScale'
    :files-selected='filesSelected'
    :is-stitch='stitchedData.length > 0'>
  </v-legend>
</v-container>
</template>

<script>
// Import Packages
import * as d3 from 'd3';

import chartMethods from './chartMethods';

export default {
  name: 'ChartStitch',
  props: {
    ID: {
      type: String,
      required: true,
    },
  },
  mixins: [
    chartMethods,
  ],
  components: {
    'v-legend-button': () => import('../../Legend/LegendButton'),
    'v-legend': () => import('../../Legend/Legend'),
    'v-export-chart-button': () => import('../../ExportChartButton'),
    'v-reset-chart-button': () => import('../../ResetChartButton'),
    'v-plotted-data-table': () => import('../../PlottedDataTable'),
  },
  data() {
    return {
      svg: undefined,
      g: undefined,
      showLegend: false,
      showTabs: true,
      width: 960,
      height: 600,
      viewBox: '0 0 960 600',
      defaultMargin: {
        top: 20,
        right: 50,
        bottom: 50,
        left: 100,
      },
    };
  },
  computed: {
    margin() {
      return this.defaultMargin;
    },
    plotData() {
      return this.chartConfigurations.data;
    },
    xScale() {
      return this.plotScale.x.value
        .range([0, this.width])
        .domain(this.xExtent)
        .nice();
    },
    yScale() {
      return this.plotScale.y.value
        .range([this.height, 0])
        .domain(this.yExtent)
        .nice();
    },
    yType() {
      return this.plotScale.y.label;
    },
    xType() {
      return this.plotScale.x.label;
    },
    colorScale() {
      return d3.scaleOrdinal(d3.schemeCategory20).domain(this.colorDomain);
    },
    xAxis() {
      return d3.axisBottom(this.xScale);
    },
    yAxis() {
      return d3.axisLeft(this.yScale);
    },
    xGrid() {
      return d3.axisBottom(this.xScale)
        .ticks(10)
        .tickSize(-this.height)
        .tickFormat('');
    },
    yGrid() {
      return d3.axisLeft(this.yScale)
        .ticks(10)
        .tickSize(-this.width)
        .tickFormat('');
    },
    xExtent() {
      return this.getExtent('x');
    },
    yExtent() {
      return this.getExtent('y');
    },
    line() {
      return d3.line()
        .defined(this.filterForLog)
        .x(d => this.xScale(d.x))
        .y(d => this.yScale(d.y));
    },
    isMetadata() {
      return !(typeof this.metadata === 'undefined');
    },
    metadataLength() {
      if (!this.isMetadata) {
        return 0;
      } else if (this.metadata === null) {
        return 0;
      }

      return Object.keys(this.metadata).length;
    },
  },
  mounted() {
    this.getContainerWidth(`#stitch-chart-wrapper-${this.ID}`);
    this.drawChart();
    this.setResponsive(`stitch-chart-width-change-${this.ID}`, `#stitch-chart-wrapper-${this.ID}`, `.stitch-chart-${this.ID}`);
  },
  watch: {
    chartConfigurations: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          if (this.filesSelected.length === 0) {
            this.showTabs = true;
            this.getContainerWidth(`#stitch-chart-wrapper-${this.ID}`);
            this.removeChart();
            this.drawChart();
            this.setResponsive(`stitch-chart-width-change-${this.ID}`, `#stitch-chart-wrapper-${this.ID}`, `.stitch-chart-${this.ID}`);
          } else {
            this.drawChart();
          }
        });
      },
    },
    title() {
      // maintain responsive charts when switching between plot components
      this.setResponsive(`stitch-chart-width-change-${this.ID}`, `#stitch-chart-wrapper-${this.ID}`, `.stitch-chart-${this.ID}`);
    },
  },
};

</script>

<style lang='scss'>
.axis {
  path {
    shape-rendering: optimizeQuality;
  }
  .tick text {
    font-size: 14px;
    fill: black;
  }
  .tick line {
    shape-rendering: optimizeQuality;
    stroke: black;
  }
}

.grid .tick line {
  shape-rendering: optimizeQuality;
  stroke: gainsboro;
}

iframe.width-changed {
  width: 100%;
  display: block;
  border: 0;
  height: 0;
  margin: 0;
}

.chart {
  // Extra small screen (mobile)
  @media screen and (max-width: 599px) {
    max-height: 500px / 1.77px;
    max-width: 500px;
  } // Small screen (tablet)
  @media screen and (min-width: 600px) and (max-width: 959px) {
    max-height: 800px / 1.77px;
    max-width: 800px;
  } // Medium screen (laptop)
  @media screen and (min-width: 960px) and (max-width: 1263px) {
    max-height: 1000px / 1.77px;
    max-width: 1000px;
  } // Large screen (desktop)
  @media screen and (min-width: 1264px) and (max-width: 1903px) {
    max-height: 1500px / 1.77px;
    max-width: 1500px;
  } // Extra large screen (ultrawide)
  @media screen and (min-width: 1904px) {
    max-height: 1800px / 1.77px;
    max-width: 1800px;
  }
}

/* Override MathJax positioning for rendered elements */
.MathJax_SVG {
  position: static !important;
  display: inline-block !important;
}

foreignObject {
  height: 100px;
  width: 200px;
}

.handle {
  fill: gray;
  opacity: 0.75;
}

.zoom-group {
  .brush-container .handle {
    fill: none;
  }

  .brushes .selection {
    fill: green;
    stroke: black;
    stroke-width: 1px;
    stroke-dasharray: 3px 3px;
  }

  .brushes .handle {
    fill: none;
  }

  .brushes text {
    fill: white;
    text-anchor: end;
    letter-spacing: 1px;
  }
}
</style>
