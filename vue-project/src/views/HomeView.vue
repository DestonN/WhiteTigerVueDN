<template>
  <div>
    <h2>Register</h2>
    <form @submit="register">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
const router = useRouter()

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
  const auth = getAuth();
  try {
    await createUserWithEmailAndPassword(auth, this.email, this.password);
    alert('Registration successful!');
    // Check the console to see if this message is logged when successful
    console.log('Redirecting to /feed');
    router.push('/feed');
  } catch (error) {
    console.error('Error registering:', error);
    alert('Registration failed. Please check your email and password.');
  }
    },
  },
};
</script>

