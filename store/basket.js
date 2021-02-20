const state = () => ({
  cart: [],
  toast: {
    text: "",
    show: false,
    type: ""
  }
});

const getters = {
  cartItems: state => state.cart,
  contain: state => model =>
    state.cart.find(p => p.model_id === model.model_id),
  length: state => state.cart.length,
  totalPrice: (state, getters) => {
    return getters.cartItems.reduce((total, item) => {
      return total + item.model.price * item.quantity;
    }, 0);
  },
  toast: state => {
    return state.toast;
  }
};

const mutations = {
  pushModelToCart(state, { model, quantity }) {
    state.cart.push({
      model: model,
      quantity: quantity
    });
  },
  incrementModelQuantity(state, { model, quantity }) {
    let cartItem = state.cart.find(
      cartItem => cartItem.model.model_id === model.model_id
    );
    cartItem.quantity = cartItem.quantity + quantity;
  },
  decrementModelQuantity(state, { model, quantity }) {
    let cartItem = state.cart.find(
      cartItem => cartItem.model.model_id === model.model_id
    );
    cartItem.quantity = cartItem.quantity - quantity;
  },
  showToast: (state, { text, type }) => {
    state.toast.show = true;
    state.toast.type = type;
    state.toast.text = text;
  },
  removeModelFromCart(state, model) {
    state.cart.forEach((item, i) => {
      if (item.model.model_id === model.model_id) {
        state.cart.splice(i, 1);
      }
    });
  },
  clear(state) {
    state.cart = [];
  }
};

const actions = {
  increaseModelQuantity({ state, commit }, { model, reqQuantity }) {
    let cartItem = state.cart.find(
      cartItem => cartItem.model.model_id === model.model_id
    );
    if (cartItem) {
      if (reqQuantity + cartItem.quantity <= model.in_stock) {
        // in_stock is enough to be in customer cart
        commit("incrementModelQuantity", {
          model: model,
          quantity: reqQuantity
        });
        commit("showToast", {
          type: "success",
          text: reqQuantity + " عدد به سبد خرید اضافه شد."
        });
      } else {
        commit("showToast", {
          type: "error",
          text: "موجودی این مدل برای افزودن به سبد خرید کافی نیست."
        });
      }
    } else {
      if (reqQuantity <= model.in_stock) {
        commit("pushModelToCart", { model: model, quantity: reqQuantity });
        commit("showToast", {
          type: "success",
          text: reqQuantity + " عدد به سبد خرید اضافه شد."
        });
      } else {
        commit("showToast", {
          type: "error",
          text: "موجودی این مدل برای افزودن به سبد خرید کافی نیست."
        });
      }
    }
  },

  decreaseModelQuantity({ state, commit, dispatch }, { model, reqQuantity }) {
    let cartItem = state.cart.find(
      cartItem => cartItem.model.model_id === model.model_id
    );
    if (cartItem) {
      if (cartItem.quantity - reqQuantity > 0) {
        // cart quantity is enough to delete from customer cart
        commit("decrementModelQuantity", {
          model: model,
          quantity: reqQuantity
        });
        commit("showToast", {
          type: "success",
          text: reqQuantity + " عدد از سبد خرید کم شد."
        });
      } else if (cartItem.quantity - reqQuantity === 0) {
        dispatch("removeModel", model);
      } else {
        commit("showToast", {
          type: "error",
          text: "برای کسر این تعداد، در سبد خرید موجود نیست."
        });
      }
    }
  },

  removeModel({ state, commit }, model) {
    let cartItem = state.cart.find(
      cartItem => cartItem.model.model_id === model.model_id
    );
    if (cartItem) {
      commit("removeModelFromCart", model);
      commit("showToast", {
        type: "success",
        text: "آیتم «" + model.title + "» از سبد خرید حذف شد."
      });
    }
  },

  fetchBasket({ state }) {
    return state.products;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
