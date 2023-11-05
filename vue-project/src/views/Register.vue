<template>
  <div class="max-w-full h-full grid grid-cols-1 grid-rows-3">
    <Header Sign="Login" />
    <div class="auth-container">
      <h2 class="text-3xl f-text">Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button class="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]" type="submit">Register</button>
        <!-- Display registration error message -->
        <p ref="errorMessage" class="error-message">{{ registrationMessage }}</p>
      </form>
      <p>Already have an account? <router-link to="/">Login</router-link></p>
    </div>
    <Footer />
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      registrationMessage: '',
    };
  },
  methods: {
    async register() {
      const auth = getAuth();
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.registrationMessage = 'Registration successful!';
        // Clear any previous error message
      } catch (error) {
        console.error('Error registering:', error);
        this.registrationMessage = this.getRegistrationErrorMessage(error);
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

.error-message {
  color: red;
}
</style>
