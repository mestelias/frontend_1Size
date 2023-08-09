import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {image:'',username:'',token:'', genre:''},
};

export const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
   addUserToStore: (state, action) => {
     state.value = action.payload;
   },
   emptyStore: (state) => {
    state.value = {image:'',username:'',token:''}
   },
   updateUser: (state,action) => {
    Object.keys(action.payload).forEach(key => {
    state.value[key] = action.payload[key];
    })
   },
 },
});

export const { addUserToStore, emptyStore, updateUser } = userSlice.actions;
export default userSlice.reducer;