import React, { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from 'arwes';
import Arwes from 'arwes/lib/Arwes';
import Loading from 'arwes/lib/Loading'
import AntennaManager from './AntennaManager'
import ContractPanel from './views/ContractPanel';
import Done from './views/Done';
import HomePage from './views/HomePage';
import ERC721Panel from './views/ERC721Panel';

function App() {
  const [status, setStatus] = useState('initializing...')
  const [view, setView] = useState(null)

  const onClickERC20 = () => {
    setView(<ContractPanel onCancel={onCancel} onSubmit={onSubmit} />)
  }

  const onClickERC721 = () => {
    setView(<ERC721Panel onCancel={onCancel} onSubmit={onSubmitERC721} />)
  }

  const generateHomePage = () => {
    return (<HomePage
      onClickERC20={onClickERC20}
      onClickERC721={onClickERC721} />)
  }

  const generateLoading = () => {
    return (<Loading animate full />)
  }

  const onSubmit = (name, symbol, decimals, supply) => {
    setView(generateLoading)

    AntennaManager.deployContract(name, symbol, decimals, supply, contractAddress => {
      if (contractAddress) {
        setView(<Done address={contractAddress} />)
      }
    })
  }

  const onSubmitERC721 = (name, supply) => {
    setView(generateLoading)

    AntennaManager.deployERC721Contract(name, supply, contractAddress => {
      if (contractAddress) {
        setView(<Done address={contractAddress} />)
      }
    })
  }

  const onCancel = () => {
    setView(generateHomePage)
  }

  useEffect(() => {
    setStatus('Connecting wallet...')
    AntennaManager.init()

    setTimeout(() => {
      setStatus('ioPay connected.')
      // AntennaManager.getAccounts()
      setView(generateHomePage)
    }, 3000);
  }, [])

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
