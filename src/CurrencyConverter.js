import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import CurrencySelector from './Components/CurrencySelector/CurrencySelector';

import './CurrencyConverter.css';

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      value: '',
      commonCurrencies: {},
      fromSelectedCurrency: 'USD',
      toSelectedCurrency: 'USD',
      currencyFrom: 0.00,
      currencyTo: 0.00,
      fromSymbol: '$',
      toSymbol: '$',
      error: null,
      errorFrom: null,
      errorTo: null
    };
  }

  componentDidMount() {
    axios.get('https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json')
      .then((response) => {
        this.setState({ commonCurrencies: response.data });
      })
      .catch((error) => {
        console.log('something went wrong', error);
      });
  }

  onChangeCurrency = (event) => {
    const commonCurrencies = {...this.state.commonCurrencies};
    const id = event.target.id;
    const value = event.target.value;
    const from = (id === "fromSelectedCurrency") ? value : this.state.fromSelectedCurrency;
    const to = (id === "toSelectedCurrency") ? value : this.state.toSelectedCurrency;
    const fromCurrency = (id === "currencyFrom") ? value : this.state.currencyFrom;
    const toCurrency = (id === "currencyTo") ? value : this.state.currencyTo;
    const fromSymbol = (id === "fromSelectedCurrency") ? commonCurrencies[value.toUpperCase()].symbol : this.state.fromSymbol;
    const toSymbol = (id === "toSelectedCurrency") ? commonCurrencies[value.toUpperCase()].symbol : this.state.toSymbol;
    this.setState({ [id] : value, 
                    fromSymbol: fromSymbol, 
                    toSymbol: toSymbol,
                    error: null,
                    errorFrom: null,
                    errorTo: null 
                  });    
    this.handleCurrencyConversion(from, to, fromCurrency, toCurrency);
  }

  handleCurrencyConversion = (from, to, fromCurrency, toCurrency) => {
    if(from !== "" && to !== "" && (fromCurrency !== 0 || toCurrency !== 0)) {
      axios.get(`http://data.fixer.io/api/latest?base=EUR&symbols=${from},${to}&access_key=d0f3b7da0757140a192df5c5ee3fd3cf`)
        .then((response) => {
          if(response.data.success) {
            const rates = response.data.rates;
            if(rates[from] && rates[to]) {
              if(fromCurrency !== 0) {
                const toRate = parseFloat((fromCurrency / rates[from]) * rates[to]).toFixed(2);
                this.setState({ currencyTo: toRate, 
                                error: null,
                                errorFrom: null,
                                errorTo: null 
                              });
              } else if(toCurrency !== 0) {
                const fromRate = parseFloat((toCurrency / rates[from]) * rates[to]).toFixed(2);
                this.setState({ currencyFrom: fromRate, 
                                error: null,
                                errorFrom: null,
                                errorTo: null });
              }
            } else if(!rates[from] && rates[to]) {
              this.setState({ errorFrom: "The selected currency is not available!",
                              error: null,
                              errorTo: null 
                            });
            } else if(rates[from] && !rates[to]) {
              this.setState({ errorTo: "The selected currency is not available!",
                              error: null,
                              errorFrom: null 
                            });
            } else {
              this.setState({ error: "The selected currency is not available!",
                              errorFrom: null,
                              errorTo: null 
                            });
            }
          } else {
            this.setState({ error: "The selected currency is not available!",
                            errorFrom: null,
                            errorTo: null 
                          });
          }
        })
    }
  }

  moveCaretAtEnd = (e) => {
    var temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value;
  }

  render() {
    if(Object.keys(this.state.commonCurrencies).length === 0) {
      return ('loading...');
    }
    return (
      <div className="content">
        <div className="content-title">Currency Converter</div>
        <div className="currency-converter-container">              
          {(this.state.error && this.state.error !== null) ? 
            <span className="error">{this.state.error}</span> : null 
          }
          <div className="currency-from-wrapper">             
            <CurrencySelector 
              commonCurrencies={this.state.commonCurrencies}
              id="fromSelectedCurrency"
              label="From"
              onChangeCurrency={this.onChangeCurrency}
              selectedCurrency={this.state.fromSelectedCurrency}
              error={this.state.errorFrom}
            />        
            <div className="input-group">
              <span className="input-group-addon">{this.state.fromSymbol}</span>
              <input 
                type="number"
                id="currencyFrom" 
                value={this.state.currencyFrom} 
                onChange={this.onChangeCurrency}
                autoFocus
                onFocus={this.moveCaretAtEnd}
                ref={input => { this.nameInput = input; }}
              />
              <span className="input-group-addon" id="basic-addon2">{this.state.fromSelectedCurrency}</span>
            </div>             
          </div>

          <div className="currency-to-wrapper">
            <CurrencySelector 
              commonCurrencies={this.state.commonCurrencies}
              id="toSelectedCurrency"
              label="To"
              onChangeCurrency={this.onChangeCurrency}
              selectedCurrency={this.state.toSelectedCurrency}
              error={this.state.errorTo}
            />    
            <div className="input-group">
              <span className="input-group-addon">{this.state.toSymbol}</span>
              <input 
                type="number"
                id="currencyTo" 
                value={parseFloat(this.state.currencyTo).toFixed(2)}
                autoFocus
                onFocus={this.moveCaretAtEnd}
                ref={input => { this.nameInput = input; }}
              />
              <span className="input-group-addon" id="basic-addon2">{this.state.toSelectedCurrency}</span>
            </div>             
          </div>
        </div>
      </div>
    );
  }
}

CurrencyConverter.propTypes =  {
  fromSelectedCurrency: PropTypes.string,
  toSelectedCurrency: PropTypes.string,
  currencyFrom: PropTypes.number,
  currencyTo: PropTypes.number
}

export default CurrencyConverter;