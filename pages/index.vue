<template>
  <div class="page">
    <div class="page__content position-fixed-center">
      <UserInfoModal
        @setUserInfoCompleted="setUserInfoCompleted"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  middleware({
    store,
    redirect,
  }) {
    const userInfo = store.getters['user/getUserInfo'];
    const userValues = Object.values(userInfo);
    const isUserValuesComplete = userValues.find((item: unknown) => !!(item) === true);
    if (isUserValuesComplete) {
      redirect(302, {
        name: 'chat',
      });
    }
  },
  methods: {
    // redirect to chat room after set userInfo completed
    setUserInfoCompleted() {
      this.$router.push({
        name: 'chat',
      });
    },
  },
})
</script>

<style lang="scss">
.position-fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>