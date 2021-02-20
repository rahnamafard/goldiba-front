export const state = () => ({
  pageTitle: "در حال بارگذاری..."
});

export const mutations = {
  SET_PAGE_TITLE(state, title) {
    state.pageTitle = title;
  }
};

export const getters = {
  loggedInUser: state => state.auth.user,
  isAuthenticated: state => state.auth.loggedIn,
  isUserStaff: state => state.auth.user.is_staff,
  permissions: state => state.auth.user.permissions
  // isUserAdmin: state => state.auth.is_superuser
};
