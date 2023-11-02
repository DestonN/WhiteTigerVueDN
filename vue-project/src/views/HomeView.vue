<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for= "password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Register</button>
      <button @click.prevent="login">Login</button>
      <!-- Display registration and login error messages -->
      <p ref="errorMessage">{{ registrationMessage || loginMessage }}</p>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      registrationMessage: '',
      loginMessage: '',
    };
  },
  methods: {
    async register() {
      const auth = getAuth();
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.registrationMessage = 'Registration successful!';
        this.loginMessage = ''; // Clear any previous login message
        this.$router.push('/feed');
      } catch (error) {
        console.error('Error registering:', error);
        this.registrationMessage = this.getRegistrationErrorMessage(error);
        this.loginMessage = ''; // Clear any previous login message
      }
    },
    async login() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.loginMessage = 'Login successful!';
        this.registrationMessage = ''; // Clear any previous registration message
        this.$router.push('/feed');
      } catch (error) {
        console.error('Error logging in:', error);
        this.loginMessage = this.getErrorMessage(error);
        this.registrationMessage = ''; // Clear any previous registration message
      }
    },
    getErrorMessage(error) {
      console.log('Firebase error code:', error);
      // Check for specific Firebase Authentication error codes
      switch (error.code) {
      case 'auth/invalid-email':
        return 'Login failed. Invalid email format.';
      case 'auth/wrong-password':
        return 'Login failed. Wrong email or password.';
      case 'auth/user-disabled':
        return 'Login failed. User account is disabled.';
      default:
        return 'Login failed. Please check your email and password.';
      }
    },
    getRegistrationErrorMessage(error) {
      // Handle specific registration error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'Registration failed. Email is already in use.';
        case 'auth/invalid-email':
          return 'Registration failed. Invalid email format.';
        case 'auth/operation-not-allowed':
          return 'Registration failed. Email/password accounts are not enabled.';
        case 'auth/weak-password':
          return 'Registration failed. Password is too weak.';
        default:
          return 'Registration failed. Please check your email and password.';
      }
    },
  },
};
</script>
