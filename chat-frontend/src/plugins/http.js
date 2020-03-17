import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://10.236.131.152:3000'
});

export const header = context => {
  return { Authorization: `Bearer ${context.state.jwtToken.accessToken}` };
};

export const popUp = (commit, mode, text) => {
  commit('changeStatusbar', { mode, text, on: true });
};

export const login = (commit, dispatch, payload) => {
  http
    .post('/auth/login', {
      username: payload.username,
      password: payload.password
    })
    .then(response => {
      commit('updateToken', response.data);
      commit('updateUser', response.data);
      popUp(commit, 'success', 'Login Successful');
      dispatch('loadChats');
    })
    .catch(e => {
      if (e.response.status === 401) {
        popUp(commit, 'error', 'Incorrect Username or Password');
      }
      console.log(e.response);
    });
};

export const PermDetailGrab = (context, ls) => {
  http
    .get('/auth/permDetailGrab', {
      headers: header(context)
    })
    .then(response => {
      context.commit('permDetailLoad', response.data);
      ls.set('token', context.state.jwtToken.accessToken);
      context.dispatch('loadChats');
    })
    .catch(e => {
      if (e.response.status === 401) {
        popUp(
          context.commit,
          'error',
          'No login in past 7 days please login again'
        );
        ls.clear();
        context.commit('accessTokenChange', null);
      }
    });
};

export const Permlogin = (commit, dispatch, payload, state, ls) => {
  http
    .post('/auth/permLogin', {
      username: payload.username,
      password: payload.password
    })
    .then(response => {
      commit('updateToken', response.data);
      commit('updateUser', response.data);
      popUp(commit, 'success', 'Login Successful');
      ls.set('token', state.jwtToken.accessToken);
      dispatch('loadChats');
    })
    .catch(e => {
      if (e.response.status === 401) {
        popUp(commit, 'error', 'Incorrect Username or Password');
      } else {
        console.log(e.response);
      }
    });
};

export const Register = (commit, payload) => {
  http
    .post('/auth/signup', {
      userName: payload.username,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName
    })
    .then(response => {
      if (response.data === true) {
        popUp(commit, 'success', 'Registration successful please login');
      }
    })
    .catch(e => console.log(e));
};

export const LoadChats = context => {
  http
    .get('/chatApi/groups', {
      headers: header(context)
    })
    .then(response => {
      context.commit('setLatestMessages', response.data);
    })
    .catch(e => console.log(e.response));
};

export const LoadMessages = (context, payload) => {
  http
    .get('/chatApi/room', {
      params: {
        numberLoaded: payload.loaded,
        roomId: payload.roomId
      },
      headers: header(context)
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
        context.commit('setMessagesLoaded', true);
      } else {
        console.log(e.response);
      }
    });
};

export const LoadAllMessages = (context, payload) => {
  http
    .get('/chatApi/all', {
      params: {
        numberLoaded: payload.loaded
      },
      headers: header(context)
    })
    .then(response => {
      context.commit('setAllMessages', response.data);
    })
    .catch(e => console.log(e.response));
};

export const RefreshToken = context => {
  http
    .get('/auth/refresh', {
      headers: header(context)
    })
    .then(response => {
      context.commit('updateToken', response.data);
    })
    .catch(e => console.log(e.response));
};
