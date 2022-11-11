import { defineStore } from 'pinia';
import {User} from 'src/models/user';
import {apiRequest} from 'src/services/apiRequest';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    userProfile: {} as User,
  }),
  getters: {
  },
  actions: {
    setAccessToken(token: string) {
      localStorage.setItem('token', token);
      this.isAuthenticated = true;
    },
    async checkAuth() {
      try{
        const res = await apiRequest('api/auth/info', 'get');
        if(res.status === 200) {
          const data = res.data as User;
          this.isAuthenticated = true;
          this.setUserProfile(data);
        } else {
          this.logout();
        }
      } catch(err) {
        this.logout();
      }
    },
    logout() {
      if(!localStorage.getItem('token')) return;
      localStorage.removeItem('token');
      this.isAuthenticated = false;
    },
    getAccessToken() {
      if(!localStorage.getItem('token')) return;
      return localStorage.getItem('token');
    },
    setUserProfile(data: User) {
      this.userProfile = data;
    },
    updateUserProfile(data: object) {
      this.userProfile = {...this.userProfile, ...data};
    },
    resetUserProfile() {
      this.userProfile = {} as User;
    }
  },
});
