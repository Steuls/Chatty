import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '../plugins/http';

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
        state.user != null && state.user.username != null && state.user.id !== 0
      );
    },
    loggedIn: (state, getters) => {
      return !!(getters.tokenValid && getters.userValid); // If either is not valid user cannot be verified as logged in
    }
  },
  mutations: {
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
    }
  },
  actions: {
    login({ commit, dispatch }, payload) {
      http
        .post('/auth/login', {
          username: payload.username,
          password: payload.password
        })
        .then(response => {
          commit('updateToken', response.data);
          commit('updateUser', response.data);
          commit('changeStatusbar', {
            mode: 'success',
            text: 'Login successful',
            on: true
          });
          dispatch('loadChats');
        })
        .catch(e => {
          if (e.response.status === 401) {
            commit('changeStatusbar', {
              mode: 'error',
              text: 'Incorrect username or password',
              on: true
            });
          }
        });
    },
    register({ commit }, payload) {
      http
        .post('/auth/signup', {
          userName: payload.username,
          password: payload.password,
          firstName: payload.firstName,
          lastName: payload.lastName
        })
        .then(response => {
          if (response.data === true) {
            commit('changeStatusbar', {
              mode: 'success',
              text: 'Registration successful please login',
              on: true
            });
          }
        })
        .catch(e => console.log(e));
    },
    loadChats(context) {
      // Gets the groups and their latest message for sidebar
      http
        .get('/chatApi/groups', {
          headers: {
            Authorization: `Bearer ${context.state.jwtToken.accessToken}`
          }
        })
        .then(response => {
          context.commit('setLatestMessages', response.data);
        })
        .catch(e => console.log(e.response));
    },
    loadMessages(context, payload) {
      // Gets a set amount of messages
      http
        .get('/chatApi/room', {
          params: {
            numberLoaded: payload.loaded,
            roomId: payload.roomId
          },
          headers: {
            Authorization: `Bearer ${context.state.jwtToken.accessToken}`
          }
        })
        .then(response => {
          context.commit('setAllMessages', response.data);
          context.commit('setRoom', payload.roomId);
        })
        .catch(e => {
          if (
            e.response.status === 404 &&
            e.response.data.message === 'No Messages were found'
          ) {
            this.messagesLoaded = true;
          } else {
            console.log(e.response);
          }
        });
    },
    loadAllMessages(context, payload) {
      // Gets a set amount of messages to preload some chats
      http
        .get('/chatApi/all', {
          params: {
            numberLoaded: payload.loaded
          },
          headers: {
            Authorization: `Bearer ${context.state.jwtToken.accessToken}`
          }
        })
        .then(response => {
          context.commit('setAllMessages', response.data);
        })
        .catch(e => console.log(e.response));
    },
    refreshToken(context) {
      http
        .get('/auth/refresh', {
          headers: {
            Authorization: `Bearer ${context.state.jwtToken.accessToken}`
          }
        })
        .then(response => {
          context.commit('updateToken', response.data);
        })
        .catch(e => console.log(e.response));
    }
  }
});
