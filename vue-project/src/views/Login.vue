<template>
  <div class="max-w-full h-full grid grid-cols-1 grid-rows-3">
  <Header Sign="Register"/>
  <div class="auth-container">
    <h2 class="text-3xl f-text">Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" class="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Login</button>
      <!-- Display registration and login error messages -->
      <p ref="errorMessage" class="error-message">{{ registrationMessage || loginMessage }}</p>
    </form>
    <p>Don't have an account? <router-link to="/register">Register</router-link></p>
  </div>
  <Footer />
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
        this.$router.push('/Dashboard');
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
        this.$router.push('/Dashboard');
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

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* button {
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
} */

.error-message {
  color: red;
}
</style>