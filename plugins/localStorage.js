import createPersistedState from "vuex-persistedstate";

// state remains on refresh
export default ({ store }) => {
  createPersistedState({
    paths: ["basket"]
  })(store);
};
