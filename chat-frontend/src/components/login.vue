<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer />
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn @click="$emit('register')" icon large v-on="on">
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </template>
              <span>Create Account</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Login"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                v-model="details.username"
              />
              <v-text-field
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPwd ? 'text' : 'password'"
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                @click:append="showPwd = !showPwd"
                v-model="details.password"
              />
              <v-checkbox v-model="remember" label="Remember Me"></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="login" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        showPwd: false,
        details: {
          username: '',
          password: ''
        },
        remember: false
      };
    },
    methods: {
      login() {
        if (this.remember) {
          this.$store.dispatch('permLogin', this.details);
        } else {
          this.$store.dispatch('login', this.details);
        }
      },
      test() {
        this.$store.dispatch('getTest');
      }
    }
  };
</script>

<style scoped></style>
