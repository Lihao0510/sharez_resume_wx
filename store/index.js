import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);


const vuexStore = new Vuex.Store({
	state: {
    userInfo: {}
	},
  getters: {
  	userInfoComp: state => state.userInfo
  },
	mutations: {
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		}
	},
	actions: {
		userInfo({ state, commit }, force) {
      // 进行更新mutations的操作
		}
	}
});

export default vuexStore;
