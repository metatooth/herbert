<template>
  <div class="tag">
    <font-awesome-icon :icon="icon" />
    &nbsp;
    <span>{{formatted}} {{units}}</span>
  </div>
</template>

<script>
export default {
  name: 'Target',
  props: {
    icon: String,
    value: Number,
    precision: Number,
    units: String
  },
  computed: {
    formatted () {
      return this.value.toFixed(this.precision)
    }
  }
}
</script>

<style>
.tag {
  width: 300px
}
<style>
