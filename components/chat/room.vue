<template>
  <div class="chatRoom">
    <div class="chatRoom__item chatRoom__item--content">
      <ul class="chatRoom__contentCntr">
        <li
          v-for="info in chatRecordArr"
          :key="info.userId"
          class="chatRoom__contentItem"
        >
          <ChatStateBox
            v-if="info.isStateMessage"
            :content="info.content"
          />
          <ChatDialogBox
            v-else
            :content="info.content"
            :isMyself="info.isMySelf"
            :imageInfo="{ src: `https://fakeimg.pl/30x30?text=${info.userName}`, }"
          />
        </li>
      </ul>
    </div>
    <div class="chatRoom__item chatRoom__item--input">
      <div class="chatRoom__inputCntr">
        <input
          v-model="message"
          class="chatRoom__input"
          type="text"
          placeholder="write something..."
          @keydown.enter="sendMessage"
        >
        <button
          class="chatRoom__inputBtn"
          title="submit message"
          :disabled="!message"
          @click="sendMessage">
          <client-only>
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="icon alt"/>
          </client-only>
        </button>
      </div>
      <ul
        v-show="typingUsersArr.length"
        class="chatRoom__typing"
      >
        <li
          v-for="(user, idx) in typingUsersArr"
          :key="idx"
          class="chatRoom__typingItem"
        >
          {{ user.userName }}{{ idx === typingUsersArr.length - 1 ? '' : ',' }}&nbsp;
        </li>
        {{ typingUsersArr.length > 1 ? 'are' : 'is' }} typing...
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
interface pageData {
  message: string,
  elObserver: Element | null,
}

export default Vue.extend({
  props: {
    chatRecordArr: {
      type: Array,
      default: () => [],
    },
    typingUsersArr: {
      type: Array,
      default: () => [],
    },
  },
  data: (): pageData => ({
    message: '',
    elObserver: null,
  }),
  computed: {
    isTyping(): Boolean {
      return this.message.length > 0 ? true : false;
    },
  },
  watch: {
    chatRecordArr: {
      handler() {
        this.$nextTick(() => {
          this.updateIntersectionObserver();
        });
      },
    },
    isTyping: {
      handler(val) {
        this.$emit('isTyping', val);
      },
    },
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.$emit('sendMessage', this.message);
        this.message = '';
      }
    },
    setIntersectionObserver(elTarget: Element) {
      const elChatCntr = document.querySelector('.chatRoom__item--content');
      const elChatContentCntr = document.querySelector('.chatRoom__contentCntr')
      const IntersectionObserverOption = {
        root: elChatCntr,
        threshold: 1,
      };

      const observer: IntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && elChatContentCntr !== null) {
            elChatContentCntr.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          }
        });
      }, IntersectionObserverOption);

      // 先註銷監聽
      if (this.elObserver) {
        observer.unobserve(this.elObserver);
      }
      // 觀察目標元素是否沒有全部都顯示在畫面裡
      observer.observe(elTarget);
      this.elObserver = elTarget
    },
    updateIntersectionObserver() {
      const elChatItemArr: Array<Element> = Array.from(document.querySelectorAll('.chatRoom__contentItem'));
      if (!elChatItemArr.length) return;
      this.setIntersectionObserver(elChatItemArr[elChatItemArr.length - 1]);
    },
  },
});
</script>

<style lang="scss">
.chatRoom {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 70vh;
  padding: 24px 24px 0;
  border-radius: 8px;
  border: 1px solid rgba($color: gray, $alpha: .5);
  background-color: #fff;

  &__item {
    &--content {
      height: 80%;
      overflow-y: auto;
  
      .chatRoom__contentCntr {
        padding: 0;
        margin: 0;
      }
  
      .chatRoom__contentItem {
        list-style: none;
        text-align: center;

        + .chatRoom__contentItem {
          margin-top: 16px;
        }
      }
    }

    &--input {
      display: flex;
      position: relative;
      margin-top: 24px;
      padding: 24px 0;
      flex-grow: 1;
      border-top: 1px solid rgba($color: gray, $alpha: .5);

      .chatRoom__inputCntr {
        position: relative;
        flex-grow: 1;

        .chatRoom__input {
          width: 100%;
          height: 100%;
          padding: 8px 16px;
          box-sizing: border-box;
          background-color: rgba($color: gray, $alpha: .1);
          border: none;
          border-radius: 100px;
          font-size: 24px;
          outline: none;
        }

        .chatRoom__inputBtn {
          position: absolute;
          right: 0;
          top: 0;
          border-radius: 50%;
          height: 100%;
          aspect-ratio: 1/1;
          border: none;
          background-color: rgba($color: gray, $alpha: .1);

          &:hover {
            cursor: pointer;
          }
        }
      }
      .chatRoom__typing {
        display: flex;
        justify-content: flex-start;
        position: absolute;
        bottom: 0;
        left: 16px;
        padding: 0;
        margin: 0;
        line-height: 2;
        font-size: 12px;

        &Item {
          list-style: none;
        }
      }
    }
  }


}
</style>