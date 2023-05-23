<template>
  <div :class="[
    'chatDialogBox',
    {
      'chatDialogBox-reverse': isMyself,
    }
  ]">
    <div class="chatDialogBox__item chatDialogBox__item--pic">
      <img
        :src="imageInfo.src"
        :width="30"
        :height="30"
      >
    </div>
    <div class="chatDialogBox__item chatDialogBox__item--content">
      {{ content }}
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
    imageInfo: {
      type: Object,
      default: () => ({ src: "https://fakeimg.pl/30x30/", }),
    },
    isMyself: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.chatDialogBox {
  display: flex;
  align-items: flex-end;

  &__item {
    &--pic {
      border-radius: 50%;
      overflow: hidden;
      img {
        vertical-align: middle;
      }
    }
    &--content {
      position: relative;
      margin: 0 16px;
      padding: 8px;
      max-width: 60%;
      word-wrap: break-word;
      border-radius: 4px;
      background-color: rgba($color: gray, $alpha: 1);

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translateX(-50%);
        border-top: 4px solid rgba($color: #fff, $alpha: 0);
        border-left: 4px solid rgba($color: #fff, $alpha: 0);
        border-right: 4px solid rgba($color: gray, $alpha: 1);
        border-bottom: 4px solid rgba($color: gray, $alpha: 1);
      }
    }
  }

  &-reverse {
    flex-direction: row-reverse;
    .chatDialogBox__item {
      &--pic {
      }
      &--content {
        background-color: rgba($color: lightgreen, $alpha: 1);

        &::after {
          content: "";
          left: 100%;
          bottom: 0;
          transform: translateX(-50%);
          border-top: 4px solid rgba($color: #fff, $alpha: 0);
          border-left: 4px solid rgba($color: lightgreen, $alpha: 1);
          border-right: 4px solid rgba($color: #fff, $alpha: 0);
          border-bottom: 4px solid rgba($color: lightgreen, $alpha: 1);
        }
      }
    }
  }
}
</style>