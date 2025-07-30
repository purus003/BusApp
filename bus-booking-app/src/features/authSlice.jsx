
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, 
};

const authSlice = createSlice(
    {
     name:'auth',
     initialState ,
     reducers:{
        register: (state ,action) =>{
            const users = JSON.parse(localStorage.getItem('users'))|| [];
            const exstingEmail = users.some((user) => user.email  === action.payload.email) ;
            if(exstingEmail){
                return alert("User already registered with this email");
            }
            const newUser = {
             id: users.length+1, 
             role: "user", 
            ...action.payload 
            };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
        },

        login: (state , action) =>{
            const{ email, password } = action.payload;
            const users = JSON.parse(localStorage.getItem('users'))|| [];

            const existinguser =  users.find(
                (u) => u.email === email  && u.password === password
            )

            if(existinguser){
                state.user=existinguser;
                localStorage.setItem("user", JSON.stringify(existinguser))
            }
            else{
                alert('Invaild credentials');
            }
        },

        logout :(state) =>{
          state.user = null;
          localStorage.removeItem("user");
        },

     editUser: (state, action) => {
    const { id, name, email, mobileNumber } = action.payload;
    if (state.user && state.user.id === id) {
        state.user = { ...state.user, name, email, mobileNumber };
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(user =>
        user.id === id ? { ...user, name, email, mobileNumber } : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
},

     },
     
});

export const { login, logout ,register,editUser} = authSlice.actions;
export default authSlice.reducer;