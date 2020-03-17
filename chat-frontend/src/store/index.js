import Vue from 'vue';
import Vuex from 'vuex';
import {
  LoadAllMessages,
  LoadChats,
  LoadMessages,
  login, PermDetailGrab, Permlogin,
  RefreshToken,
  Register
} from '../plugins/http';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jwtToken: {
      accessToken: null,
      expiresIn: null
    },
    launchNotification: false,
    notification: {
      mode: 'success',
      text: 'Default',
      timeout: 5000
    },
    currentRoom: 0,
    user: {
      username: null,
      id: 0
    },
    messages: {
      latest: [],
      all: []
    },
    messagesLoaded: true
  },
  getters: {
    tokenValid: state => {
      const diff = Math.abs(
        Date.parse(state.jwtToken.expiresIn) - new Date().getTime()
      );
      // if Diff is 0 or negative means current time is later than expires at so the token is expired
      return diff > 0;
    },
    userValid: state => {
      return (
        // If user or children is null or 0 then the user is not valid
        state.user.username != null && state.user.id !== 0
      );
    },
    loggedIn: (state, getters) => {
      return !!(getters.tokenValid && getters.userValid); // If either is not valid user cannot be verified as logged in
    },
    getGroupById: state => id => {
      const index = state.messages.latest.findIndex(group => {
        return group.roomId === id;
      });
      return state.messages.latest[index];
    },
    getGroupNameById: (state, getters) => id => {
      return getters.getGroupById(id).roomName;
    },
    getRooms: state => {
      const rooms = state.messages.latest;
      rooms.forEach(room => {
        if (room.users.length === 2) {
          room.users.forEach(user => {
            if (user.username !== state.user.username) {
              room.roomName = user.username;
            }
          });
        }
      });
      return rooms;
    },
    isRoomPrivate: (state, getters) => id => {
      const group = getters.getGroupById(id);
      return group.users.length === 2; // If only 2 users its private
    }
  },
  mutations: {
    restoreState(state) {
      // Has to be done like this to remain store integrity
      state.jwtToken.accessToken = null;
      state.jwtToken.expiresIn = null;
      state.launchNotification = false;
      state.notification.mode = 'success';
      state.notification.text = 'Default';
      state.notification.timeout = 5000;
      state.currentRoom = 0;
      state.user.username = null;
      state.id = 0;
      state.messages.latest = [];
      state.messages.all = [];
      state.messagesLoaded = true;
    },
    updateToken(state, payload) {
      state.jwtToken.accessToken = payload.accessToken;
      state.jwtToken.expiresIn = payload.expiresAt;
    },
    updateUser(state, payload) {
      state.user.username = payload.userName;
      state.user.id = payload.userId;
    },
    changeStatusbar(state, payload) {
      state.notification.mode = payload.mode;
      state.notification.text = payload.text;
      state.launchNotification = payload.on;
    },
    statusbarOff(state) {
      state.launchNotification = false;
    },
    setLatestMessages(state, payload) {
      state.messages.latest = payload;
    },
    setAllMessages(state, payload) {
      state.messages.all = payload;
      state.messagesLoaded = true;
      // state.messages.all = [...state.messages.all, payload];
    },
    setMessages(state, payload) {
      state.messages.latest = payload.latest;
      state.messages.all = payload.all;
    },
    resetMessages(state) {
      state.messages.all = [];
    },
    setMessagesLoaded(state, payload) {
      state.messagesLoaded = payload;
    },
    setRoom(state, payload) {
      state.currentRoom = payload;
    },
    removeRoom(state, payload) {
      const index = state.messages.latest.findIndex(group => {
        return group.roomId === payload;
      });
      state.messages.latest.splice(index, 1);
    },
    updateLatestMessage(state, { roomId, message }) {
      const index = state.messages.latest.findIndex(room => {
        return room.roomId === roomId;
      });
      state.messages.latest[index].lastMessage = {
        content: message.content,
        sender_id: message.sender_id,
        username: message.username,
        timestamp: message.timestamp
      };
    },
    updateCurrentMessages(state, payload) {
      state.messages.all = [...state.messages.all, payload];
    },
    addRoom(state, payload) {
      state.messages.latest = [...state.messages.latest, payload];
    },
    updateGroupName(state, payload) {
      const index = state.messages.latest.findIndex(group => {
        return group.roomId === payload.groupId;
      });
      if (index === -1)
        console.error(`Group Not found with ID: ${payload.groupId}`);
      else state.messages.latest[index].roomName = payload.groupName;
    },
    accessTokenChange(state, payload) {
      state.jwtToken.accessToken = payload;
    },
    permDetailLoad(state, payload) {
      state.user.username = payload.userName;
      state.user.id = payload.userId;
      state.jwtToken.accessToken = payload.accessToken;
      state.jwtToken.expiresIn = payload.expiresAt;
    }
  },
  actions: {
    // All HTTP is done through the HTTP plugin JS file
    login({ commit, dispatch }, payload) {
      login(commit, dispatch, payload);
    },
    permLogin({ commit, dispatch, state }, payload) {
      Permlogin(commit, dispatch, payload, state, this._vm.$ls);
    },
    register({ commit }, payload) {
      Register(commit, payload);
    },
    loadChats(context) {
      // Gets the groups and their latest message for sidebar
      LoadChats(context);
    },
    loadMessages(context, payload) {
      // Gets a set amount of messages
      LoadMessages(context, payload);
    },
    loadAllMessages(context, payload) {
      // Gets a set amount of messages to preload some chats
      LoadAllMessages(context, payload);
    },
    refreshToken(context) {
      RefreshToken(context);
    },
    permDetailGrab(context, payload) {
      context.commit('accessTokenChange', payload);
      PermDetailGrab(context, this._vm.$ls);
    }
  }
});
