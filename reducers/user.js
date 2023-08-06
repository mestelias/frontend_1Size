import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {image:'',username:'',token:''},
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
   updatePicture: (state,action) => {
    state.value.image = action.payload  
   }
 },
});

export const { addUserToStore, emptyStore, updatePicture } = userSlice.actions;
export default userSlice.reducer;