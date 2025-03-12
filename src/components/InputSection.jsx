import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
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
} from '../redux/leasingSlice';

const InputSection = () => {
  const leasing = useSelector((state) => state.leasing);
  const dispatch = useDispatch();

  const handleInputChange = (e, actionCreator) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    dispatch(actionCreator(value));
  };

  // Generate month options
  const monthOptions = [
    { value: 1, label: 'Januar' },
    { value: 2, label: 'Februar' },
    { value: 3, label: 'März' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Dezember' }
  ];

  // Generate year options (current year and next 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Leasing</h2>
      
      <div className="space-y-4">
        {/* Leasing Duration and Start Date */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="leasingDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Leasingdauer (Monate):
            </label>
            <input 
              type="number" 
              id="leasingDuration" 
              min="1" 
              value={leasing.leasingDuration}
              onChange={(e) => handleInputChange(e, updateLeasingDuration)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="startMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Startmonat:
            </label>
            <select
              id="startMonth"
              value={leasing.startMonth}
              onChange={(e) => handleInputChange(e, updateStartMonth)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Startjahr:
            </label>
            <select
              id="startYear"
              value={leasing.startYear}
              onChange={(e) => handleInputChange(e, updateStartYear)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="oneTimePayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Einmalige Anzahlung (€):
            </label>
            <input 
              type="number" 
              id="oneTimePayment" 
              min="0" 
              step="100" 
              value={leasing.oneTimePayment}
              onChange={(e) => handleInputChange(e, updateOneTimePayment)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="monthlyCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monatliche Rate (€):
            </label>
            <input 
              type="number" 
              id="monthlyCost" 
              min="0" 
              step="10" 
              value={leasing.monthlyCost}
              onChange={(e) => handleInputChange(e, updateMonthlyCost)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Kilometer</h2>
      
      <div className="space-y-4">
        {/* Kilometer Allowance */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="includedKm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inkl. Kilometer pro Jahr:
            </label>
            <input 
              type="number" 
              id="includedKm" 
              min="0" 
              step="1000" 
              value={leasing.includedKm}
              onChange={(e) => handleInputChange(e, updateIncludedKm)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="extraKmCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kosten pro Extra-Kilometer (€):
            </label>
            <input 
              type="number" 
              id="extraKmCost" 
              min="0" 
              step="0.01" 
              value={leasing.extraKmCost}
              onChange={(e) => handleInputChange(e, updateExtraKmCost)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        
        {/* Office Commute */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="officeKm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entfernung zum Büro (km):
            </label>
            <input 
              type="number" 
              id="officeKm" 
              min="0" 
              step="0.1" 
              value={leasing.officeKm}
              onChange={(e) => handleInputChange(e, updateOfficeKm)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="officeDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bürotage pro Jahr:
            </label>
            <input 
              type="number" 
              id="officeDays" 
              min="0" 
              max="365" 
              value={leasing.officeDays}
              onChange={(e) => handleInputChange(e, updateOfficeDays)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="taxOfficeDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Steuerliche Bürotage:
            </label>
            <input 
              type="number" 
              id="taxOfficeDays" 
              min="0" 
              max="365" 
              value={leasing.taxOfficeDays}
              onChange={(e) => handleInputChange(e, updateTaxOfficeDays)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        
        {/* Private Usage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fixedKmPerYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Private Nutzung (km pro Jahr):
            </label>
            <input 
              type="number" 
              id="fixedKmPerYear" 
              min="0" 
              step="1000" 
              value={leasing.fixedKmPerYear}
              onChange={(e) => handleInputChange(e, updateFixedKmPerYear)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="taxReturn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Steuerrückerstattung pro km (€):
            </label>
            <input 
              type="number" 
              id="taxReturn" 
              min="0" 
              step="0.01" 
              value={leasing.taxReturn}
              onChange={(e) => handleInputChange(e, updateTaxReturn)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Weitere Kosten</h2>
      
      <div className="space-y-4">
        {/* Energy Costs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="energyConsumption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Energieverbrauch (kWh/100km):
            </label>
            <input 
              type="number" 
              id="energyConsumption" 
              min="0" 
              step="0.1" 
              value={leasing.energyConsumption}
              onChange={(e) => handleInputChange(e, updateEnergyConsumption)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="energyCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Energiekosten (€/kWh):
            </label>
            <input 
              type="number" 
              id="energyCost" 
              min="0" 
              step="0.01" 
              value={leasing.energyCost}
              onChange={(e) => handleInputChange(e, updateEnergyCost)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        
        {/* Insurance */}
        <div>
          <label htmlFor="insuranceCostPerYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Versicherungskosten pro Jahr (€):
          </label>
          <input 
            type="number" 
            id="insuranceCostPerYear" 
            min="0" 
            step="10" 
            value={leasing.insuranceCostPerYear}
            onChange={(e) => handleInputChange(e, updateInsuranceCostPerYear)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default InputSection;