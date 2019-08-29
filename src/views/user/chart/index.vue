<!--
    Created by WYX
    Time 2019/8/14
-->
<template>
  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>
</template>

<script>
export default {
    name: 'UserChartIndex',
    components: {
        Chart: () => {
            return import('@/components/Charts/Keyboard')
        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
