
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  cities: [],
  filteredCities: [],
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setCities: (state, action) => {
      state.cities = action.payload;
      state.filteredCities = action.payload; 
    },
    filterCities: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredCities = state.cities.filter((city) =>
        city.toLowerCase().includes(query)
      );
    },
  },
});

export const { setCities, filterCities } = citySlice.actions;

export default citySlice.reducer;
