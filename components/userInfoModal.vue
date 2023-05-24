<template>
  <div class="userInfoModal">
    <div class="userInfoModal__item">
      <label
        for="userName"
        class="userInfoModal__label"
      >
        userName
        <input
          v-model="userName"
          id="userName"
          class="userInfoModal__input"
          placeholder="userName"
        >
      </label>
      <label
        for="userId"
        class="userInfoModal__label"
      >
        userId
        <input
          v-model="userId"
          id="userId"
          class="userInfoModal__input"
          placeholder="userId"
          disabled
        >
      </label>
      <button
        class="userInfoModal__input"
        @click="handleClick"
        :disabled="!userName"
      >
        confirm
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    userName: 'Guest',
    userId: Math.floor(Math.random() * 1E20),
  }),
  methods: {
    handleClick() {
      const userInfo = {
        userName: this.userName,
        userId: this.userId,
      };

      this.$store.dispatch('user/setUserInfo', userInfo);
      this.$emit('setUserInfoCompleted');
    },
  },
})
</script>

<style lang="scss">
.userInfoModal {
  width: 600px;
  height: 70vh;
  padding: 24px 24px 0;
  border-radius: 8px;
  border: 1px solid rgba($color: gray, $alpha: .5);
  background-color: #fff;

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__label {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-bottom: 32px;
  }

  &__input {
    padding: 16px;
    text-align: center;
  }
}
</style>