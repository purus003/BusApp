import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  busList: JSON.parse(localStorage.getItem('busList') || '[]'),
  filteredBuses: JSON.parse(localStorage.getItem('filterBuses') || '[]'),
  fromAndTo: JSON.parse(localStorage.getItem('fromAndTo') || '[]'),
  selectedBus: JSON.parse(localStorage.getItem('selectedBus') || 'null'),

};
const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    addbus: (state, action) => {
      const newbus = {
        id: state.busList.length + 1,
        ...action.payload,
      };
      state.busList.push(newbus);
      localStorage.setItem('busList', JSON.stringify(state.busList));
    },

    removeBus: (state, action) => {
      const updatedList = state.busList.filter(bus => bus.id !== action.payload);
      state.busList = updatedList;
      state.filteredBuses = updatedList;
      localStorage.setItem('busList', JSON.stringify(updatedList));
    },

    editBus: (state, action) => {
      const index = state.busList.findIndex(bus => bus.id === action.payload.id);
      if (index !== -1) {
        state.busList[index] = action.payload;
        localStorage.setItem('busList', JSON.stringify(state.busList));
      }
    },

    filterBusesByNumber: (state, action) => {
      const query = action.payload.toUpperCase();
      state.filteredBuses = state.busList.filter((bus) =>
        bus.busNumber.toUpperCase().includes(query) || bus.busName.toUpperCase().includes(query)
      );
    },

    resetFilter: (state) => {
      state.filteredBuses = state.busList;
    },

    fromAndTo: (state, action) => {
      const { from, to, date } = action.payload;

      const filtered = state.busList.filter((bus) =>
        bus.from?.toLowerCase() === from.toLowerCase() &&
        bus.to?.toLowerCase() === to.toLowerCase() &&
        bus.journeyDate?.toLowerCase() === date.toLowerCase()
      );

      state.fromAndTo = filtered;
      localStorage.setItem('fromAndTo', JSON.stringify(filtered));
      console.log("Filtered Buses (FromAndTo):", filtered);
    },

     setSelectedBus: (state, action) => {
     state.selectedBus = action.payload;
    localStorage.setItem('selectedBus', JSON.stringify(action.payload));
    },
  },
});

export const {
  addbus,
  removeBus,
  editBus,
  filterBusesByNumber,
  resetFilter,
  fromAndTo,
  setSelectedBus,
} = busSlice.actions;

export default busSlice.reducer;
