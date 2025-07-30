import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    from: '',
    to: '',
    date:''
  },
  reducers: {
    setFrom: (state, action) => {
      state.from = action.payload;
    },
    setTo: (state, action) => {
      state.to = action.payload;
    },
    togglePlaces: (state) => {
      const temp = state.from;
      state.from = state.to;
      state.to = temp;
    },
  },

});
 export const fromAndTo = (state) => ({
  from: state.bus.from,
  to: state.bus.to,
  date :state.bus.to,
});
export const { setFrom, setTo, togglePlaces } = searchSlice.actions;
export default searchSlice.reducer;
