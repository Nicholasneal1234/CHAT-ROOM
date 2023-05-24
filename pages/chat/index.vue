<template>
  <div class="page">
    <div class="page__content position-fixed-center">
      <ChatRoom
        :chat-record-arr="chatRecordArr"
        :typing-users-arr="typingUsersArr"
        :online-users="onlineUsers"
        @isTyping="sendTypingState"
        @sendMessage="sendMessage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
interface pageData {
  ws: WebSocket | null,
  chatRecordArr: Array<Object>,
  isTyping: Boolean,
  typingUsersArr: Array<Object>,
  onlineUsers: Object,
}

export default Vue.extend({
  middleware({
    store,
    redirect,
  }) {
    const userInfo = store.getters['user/getUserInfo'];
    const userValues = Object.values(userInfo);
    const isUserValuesComplete = userValues.find((item: unknown) => !!(item) === true);
    if (!isUserValuesComplete) {
      redirect(302, {
        name: 'index',
      });
    }
  },
  asyncData({
    store,
  }) {
    const userInfo = store.getters['user/getUserInfo'];
    const data = {
      userName: '',
      userId: 0,
    };

    data.userName = userInfo.userName;
    data.userId = userInfo.userId;

    return data;
  },
  data: ():pageData => ({
    ws: null,
    chatRecordArr: [],
    isTyping: false,
    typingUsersArr: [],
    onlineUsers: {},
  }),
  mounted() {
    this.initWs();
  },
  methods: {
    addUser(data: any) {
      this.chatRecordArr.push({
        userName: data.userName,
        isStateMessage: true,
        content: `# ${data.userName}已加入聊天室`,
      });
    },
    ListenMessageFromWsServer() {
      if (this.ws) {
        this.ws.onmessage = (e) => {
          const serverData = JSON.parse(e.data);
          if (!serverData.toggleEvent) return;
          const toggleEventOptions: any = {
            addUser: () => this.addUser ,
            removeUser: () => this.removeUser,
            getMessage: () => this.getMessage,
            updateTypingUsersState: () => this.updateTypingUsersState,
            updateOnlineUsers: () => this.updateOnlineUsers,
          };
  
          const toggleEventOption = toggleEventOptions[serverData.toggleEvent];
          toggleEventOption()(serverData);
        };
      }
    },
    initWs() {
      const serverHost = "192.168.1.72";
      const serverPort = "8080";
      this.ws = new WebSocket(`ws://${serverHost}:${serverPort}/`);
      const ws = this.ws;

      ws.onopen = () => {
        const dataInfo = {
          toggleEvent: "addUser",
          userName: this.userName,
          userId: this.userId,
          userState: "online",
        };
        ws.send(JSON.stringify(dataInfo));
        this.ListenMessageFromWsServer();
        window.addEventListener("beforeunload", () => {
        const dataInfo = {
          toggleEvent: "removeUser",
          userName: this.userName,
          userId: this.userId,
          isTyping: false,
        };
        ws.send(JSON.stringify(dataInfo));
      })
      };
    },
    removeUser(data: any) {
      this.chatRecordArr.push({
        userName: data.userName,
        isStateMessage: true,
        content: `# ${data.userName}已離開聊天室`,
      });
    },
    updateTypingUsersState(data: any) {
      const typingUsersArr = data.typingUsersArr.filter((item: any) => item.isTyping);
      this.typingUsersArr = typingUsersArr;
    },
    updateOnlineUsers(data: any) {
      const { onlineUsersObj } = data;
      this.onlineUsers = onlineUsersObj;
    },
    getMessage(data: any) {
      this.chatRecordArr.push({
        content: data.content,
        isMySelf: this.userId === data.userId,
        isStateMessage: false,
        userName: data.userName,
      });
    },
    sendMessage(message: string) {
      if (!message) return;
      const dataInfo = {
        toggleEvent: "getMessage",
        userName: this.userName,
        userId: this.userId,
        content: message,
      };

      this.wsSend(dataInfo);
    },
    sendTypingState(isTyping: boolean) {
      this.isTyping = isTyping;
      const dataInfo = {
        toggleEvent: "updateTypingUsersState",
        userName: this.userName,
        userId: this.userId,
        isTyping: this.isTyping,
      };

      this.wsSend(dataInfo);
    },
    wsSend(data: any) {
      if (!this.ws) return;
      this.ws.send(JSON.stringify(data));
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

.mr-center {
  margin: auto;
}
</style>
