import React, { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from 'arwes';
import Arwes from 'arwes/lib/Arwes';
import Button from 'arwes/lib/Button';
import Loading from 'arwes/lib/Loading'
import AntennaManager from './AntennaManager'
import ContractPanel from './views/ContractPanel';
import Done from './views/Done';

function App() {
  const [status, setStatus] = useState('initializing...')
  const [view, setView] = useState(null)

  useEffect(() => {
    setStatus('Connecting wallet...')
    AntennaManager.init()

    setTimeout(() => {
      setStatus('ioPay connected.')
      setView(<ContractPanel onSubmit={onSubmit} />)
      setTimeout(() => {
        setStatus('')
      }, 3000);
    }, 3000);
  }, [])

  const generateLoading = () => {
    return (<Loading animate full />)
  }

  const onClickConnectWallet = () => {
    AntennaManager.getAccounts()
  }

  const onSubmit = (name, symbol, decimals, supply) => {
    setView(generateLoading)

    AntennaManager.deployContract(name, symbol, decimals, supply, contractAddress => {
      if (contractAddress) {
        setView(<Done address={contractAddress} />)
      }
    })
  }

  return (
    <ThemeProvider theme={createTheme()}>
      <Arwes animate show className="App">
        <div className="title">
          <h1>MINTTOKEN</h1>
        </div>
        <div className="status">{status}</div>
        <div className="mainView">
          {view}
        </div>
      </Arwes>
    </ThemeProvider>
  );
}

export default App;
