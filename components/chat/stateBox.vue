<template>
  <div class="stateBox">
    <div class="stateBox__item">
      <p class="stateBox__text">{{ content }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    content: {
      type: String,
      default: "",
    },
  },
})
</script>

<style lang="scss">
.stateBox {
  display: inline-block;
  text-align: center;
  padding: 0 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: rgba($color: gray, $alpha: .5);
  &__item{}
  &__text {
    margin: 8px 0;
  }
}
</style>