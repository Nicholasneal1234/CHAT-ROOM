<template>
  <div class="page">
    <div class="page__content position-fixed-center">
      <ChatRoom
        :chat-record-arr="chatRecordArr"
        :typing-users-arr="typingUsersArr"
        @isTyping="sendTypingState"
        @sendMessage="sendMessage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
interface pageData {
  userName: string | null,
  userId: number,
  ws: WebSocket | null,
  chatRecordArr: Array<Object>,
  isTyping: Boolean,
  typingUsersArr: Array<Object>,
}

export default Vue.extend({
  name: 'IndexPage',
  data: ():pageData => ({
    userName: '',
    userId: 0,
    ws: null,
    chatRecordArr: [],
    isTyping: false,
    typingUsersArr: [],
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
          };
  
          const toggleEventOption = toggleEventOptions[serverData.toggleEvent];
          toggleEventOption()(serverData);
        };
      }
    },
    initWs() {
      this.userName = prompt('輸入名稱' || 'GUEST');
      this.userId = Math.random();
      const serverHost = "192.168.1.72";
      const serverPort = "8080";
      this.ws = new WebSocket(`ws://${serverHost}:${serverPort}/`);
      const ws = this.ws;

      ws.onopen = () => {
        const dataInfo = {
          toggleEvent: "addUser",
          userName: this.userName,
          userId: this.userId,
        };
        ws.send(JSON.stringify(dataInfo));
        this.ListenMessageFromWsServer();
        window.addEventListener("beforeunload", () => {
        const dataInfo = {
          toggleEvent: "removeUser",
          userName: this.userName,
          userId: this.userId,
          isTyping: this.isTyping,
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
