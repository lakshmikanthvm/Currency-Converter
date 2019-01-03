import React from 'react';

const CurrencySelector = (props) => {
  return (
    <div className="currency-selector-wrapper">
      {(props.error && props.error !== null) ? 
        <span className="error">{props.error}</span> : null 
      }
      <label>{props.label}</label>
      <select 
        className="currency-selector" 
        onChange={props.onChangeCurrency}
        id={props.id}
        value={props.selectedCurrency}
      >
        {Object.keys(props.commonCurrencies).map((currency) => {
          const currencyObj = props.commonCurrencies[currency];
          return <option key={props.label + currencyObj.code} value={currencyObj.code}>{currencyObj.name}</option>
        })}
        
      </select>
    </div>
  )
}

export default CurrencySelector;