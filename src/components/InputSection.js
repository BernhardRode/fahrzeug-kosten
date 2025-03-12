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
  updateInsuranceCostPerYear
} from '../redux/leasingSlice';

const InputSection = () => {
  const leasing = useSelector((state) => state.leasing);
  const dispatch = useDispatch();

  const handleInputChange = (e, actionCreator) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    dispatch(actionCreator(value));
  };

  return (
    <div className="input-section">
      <h2>Leasing-Details</h2>
      
      <div className="input-group">
        <label htmlFor="leasingDuration">Leasingdauer (Monate):</label>
        <input 
          type="number" 
          id="leasingDuration" 
          min="1" 
          value={leasing.leasingDuration}
          onChange={(e) => handleInputChange(e, updateLeasingDuration)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="oneTimePayment">Einmalige Anzahlung (€):</label>
        <input 
          type="number" 
          id="oneTimePayment" 
          min="0" 
          step="0.01" 
          value={leasing.oneTimePayment}
          onChange={(e) => handleInputChange(e, updateOneTimePayment)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="monthlyCost">Monatliche Kosten (€):</label>
        <input 
          type="number" 
          id="monthlyCost" 
          min="0" 
          step="0.01" 
          value={leasing.monthlyCost}
          onChange={(e) => handleInputChange(e, updateMonthlyCost)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="includedKm">Inkl. Kilometer pro Jahr:</label>
        <input 
          type="number" 
          id="includedKm" 
          min="0" 
          value={leasing.includedKm}
          onChange={(e) => handleInputChange(e, updateIncludedKm)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="extraKmCost">Kosten pro Extra-Kilometer (€):</label>
        <input 
          type="number" 
          id="extraKmCost" 
          min="0" 
          step="0.01" 
          value={leasing.extraKmCost}
          onChange={(e) => handleInputChange(e, updateExtraKmCost)}
        />
      </div>
      
      <h3>Versicherung</h3>
      
      <div className="input-group">
        <label htmlFor="insuranceCostPerYear">Versicherungskosten pro Jahr (€):</label>
        <input 
          type="number" 
          id="insuranceCostPerYear" 
          min="0" 
          step="0.01" 
          value={leasing.insuranceCostPerYear}
          onChange={(e) => handleInputChange(e, updateInsuranceCostPerYear)}
        />
        <div className="info-text">Jährliche Kosten für Kfz-Versicherung</div>
      </div>
      
      <h3>Nutzung</h3>
      
      <div className="input-group">
        <label htmlFor="fixedKmPerYear">Private Kilometer pro Jahr (nicht Steuerrelevant):</label>
        <input 
          type="number" 
          id="fixedKmPerYear" 
          min="0" 
          value={leasing.fixedKmPerYear}
          onChange={(e) => handleInputChange(e, updateFixedKmPerYear)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="officeKm">Entfernung zum Büro (km, einfache Strecke):</label>
        <input 
          type="number" 
          id="officeKm" 
          min="0" 
          step="0.1" 
          value={leasing.officeKm}
          onChange={(e) => handleInputChange(e, updateOfficeKm)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="officeDays">Bürotage pro Jahr (tatsächlich gefahren):</label>
        <input 
          type="number" 
          id="officeDays" 
          min="0" 
          max="365" 
          value={leasing.officeDays}
          onChange={(e) => handleInputChange(e, updateOfficeDays)}
        />
        <div className="info-text">Tage, an denen Sie tatsächlich zum Büro fahren</div>
      </div>
      
      <div className="input-group">
        <label htmlFor="taxOfficeDays">Bürotage pro Jahr (für Steuer):</label>
        <input 
          type="number" 
          id="taxOfficeDays" 
          min="0" 
          max="365" 
          value={leasing.taxOfficeDays}
          onChange={(e) => handleInputChange(e, updateTaxOfficeDays)}
        />
        <div className="info-text">Tage, die Sie steuerlich geltend machen</div>
      </div>
      
      <div className="input-group">
        <label htmlFor="taxReturn">Steuerrückerstattung pro Kilometer (€):</label>
        <input 
          type="number" 
          id="taxReturn" 
          min="0" 
          step="0.01" 
          value={leasing.taxReturn}
          onChange={(e) => handleInputChange(e, updateTaxReturn)}
        />
        <div className="info-text">Standardwert in Deutschland: 0,30€</div>
      </div>
      
      <h3>Energiekosten</h3>
      
      <div className="input-group">
        <label htmlFor="energyConsumption">Energieverbrauch (kWh/100km):</label>
        <input 
          type="number" 
          id="energyConsumption" 
          min="0" 
          step="0.1" 
          value={leasing.energyConsumption}
          onChange={(e) => handleInputChange(e, updateEnergyConsumption)}
        />
        <div className="info-text">WLTP-Wert des Fahrzeugs</div>
      </div>
      
      <div className="input-group">
        <label htmlFor="energyCost">Stromkosten (€/kWh):</label>
        <input 
          type="number" 
          id="energyCost" 
          min="0" 
          step="0.01" 
          value={leasing.energyCost}
          onChange={(e) => handleInputChange(e, updateEnergyCost)}
        />
        <div className="info-text">Durchschnittlicher Preis pro kWh</div>
      </div>
    </div>
  );
};

export default InputSection;