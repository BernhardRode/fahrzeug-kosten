import { createSlice } from '@reduxjs/toolkit';

// Load state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('leasingState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Get current date for default values
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const initialState = loadState() || {
  leasingDuration: 36,
  oneTimePayment: 5000,
  monthlyCost: 432,
  includedKm: 15000,
  extraKmCost: 0.0824,
  officeKm: 88,
  officeDays: 110, // Actual driving days per year
  taxOfficeDays: 220, // Tax-declared office days per year
  fixedKmPerYear: 10000, // Additional fixed kilometers per year (not for tax)
  taxReturn: 0.30,
  energyConsumption: 22.0, // kWh per 100km (WLTP)
  energyCost: 0.38, // € per kWh
  insuranceCostPerYear: 790, // Insurance costs per year
  startMonth: 5, // Start month (1-12)
  startYear: currentYear, // Start year
};

export const leasingSlice = createSlice({
  name: 'leasing',
  initialState,
  reducers: {
    updateLeasingDuration: (state, action) => {
      state.leasingDuration = action.payload;
    },
    updateOneTimePayment: (state, action) => {
      state.oneTimePayment = action.payload;
    },
    updateMonthlyCost: (state, action) => {
      state.monthlyCost = action.payload;
    },
    updateIncludedKm: (state, action) => {
      state.includedKm = action.payload;
    },
    updateExtraKmCost: (state, action) => {
      state.extraKmCost = action.payload;
    },
    updateOfficeKm: (state, action) => {
      state.officeKm = action.payload;
    },
    updateOfficeDays: (state, action) => {
      state.officeDays = action.payload;
    },
    updateTaxOfficeDays: (state, action) => {
      state.taxOfficeDays = action.payload;
    },
    updateFixedKmPerYear: (state, action) => {
      state.fixedKmPerYear = action.payload;
    },
    updateTaxReturn: (state, action) => {
      state.taxReturn = action.payload;
    },
    updateEnergyConsumption: (state, action) => {
      state.energyConsumption = action.payload;
    },
    updateEnergyCost: (state, action) => {
      state.energyCost = action.payload;
    },
    updateInsuranceCostPerYear: (state, action) => {
      state.insuranceCostPerYear = action.payload;
    },
    updateStartMonth: (state, action) => {
      state.startMonth = action.payload;
    },
    updateStartYear: (state, action) => {
      state.startYear = action.payload;
    },
  },
});

// Save state to localStorage whenever it changes
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('leasingState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const { 
  updateLeasingDuration,
  updateOneTimePayment,
  updateMonthlyCost,
  updateIncludedKm,
  updateExtraKmCost,
  updateOfficeKm,
  updateOfficeDays,
  updateTaxOfficeDays,
  updateFixedKmPerYear,
  updateTaxReturn,
  updateEnergyConsumption,
  updateEnergyCost,
  updateInsuranceCostPerYear,
  updateStartMonth,
  updateStartYear
} = leasingSlice.actions;

export default leasingSlice.reducer;