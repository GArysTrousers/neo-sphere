import { toasts } from 'svelte-toasts';
import { pb } from './stores';

export async function login(username: string, password: string) {
  try {
    await pb.collection('users').authWithPassword(username, password);
  } catch (error) {
    toasts.error("Incorrect Username or Password")
  }
}

export async function signUp(username: string, password: string) {
  try {
    const data = {
      username,
      password,
      passwordConfirm: password
    };
    const createdUser = await pb.collection('users').create(data);
    await login(username, password);
  } catch (error) {
    toasts.error("Error creating account :(")
  }
}

export function logout() {
  pb.authStore.clear();
}