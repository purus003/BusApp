import { createSlice } from "@reduxjs/toolkit";
const saveuser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: saveuser,
  },
  reducers: {
    register: (state, action) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(action.payload);
      localStorage.setItem("users", JSON.stringify(users));
    },

    login: (state, action) => {
      const { email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const existinguser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (existinguser) {
        state.user = existinguser;
        localStorage.setItem("user", JSON.stringify(existinguser));
      } else {
        alert("Invaild credentials");
      }
    },

    editUser: (state, action) => {
      const { id, name, email, mobileNumber } = action.payload;
      if (state.user && state.user.id === id) {
        state.user = { ...state.user, name, email, mobileNumber };
      }
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, name, email, mobileNumber } : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout, register, editUser } = authSlice.actions;
export default authSlice.reducer;
