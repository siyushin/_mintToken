import React, { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from 'arwes';
import Arwes from 'arwes/lib/Arwes';
import Button from 'arwes/lib/Button'
import AntennaManager from './AntennaManager'
import ContractPanel from './views/ContractPanel';
import Done from './views/Done';
import HomePage from './views/HomePage';
import ERC721Panel from './views/ERC721Panel';
import ERC721Done from './views/ERC721Done';
import LoadingBar from './views/LoadingBar';

function App() {
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
    return (<LoadingBar onCancel={() => {
      setView(generateHomePage)
    }} />)
  }

  const onSubmit = (name, symbol, decimals, supply) => {
    setView(generateLoading)

    AntennaManager.deployContract(name, symbol, decimals, supply, contractAddress => {
      if (contractAddress && contractAddress !== 'ERROR') {
        setView(<Done address={contractAddress} />)
      } else {
        setView(<ContractPanel onCancel={onCancel} onSubmit={onSubmit} />)
      }
    })
  }

  const onSubmitERC721 = (name, supply) => {
    setView(generateLoading)

    AntennaManager.deployERC721Contract(name, supply, contractAddress => {
      if (contractAddress && contractAddress !== 'ERROR') {
        setView(<ERC721Done onCancel={onCancel} address={contractAddress} />)
      } else {
        setView(<ERC721Panel onCancel={onCancel} onSubmit={onSubmitERC721} />)
      }
    })
  }

  const onCancel = () => {
    setView(generateHomePage)
  }

  const reload = () => {
    window.location.reload();
  }

  const checkWallet = (isRetry) => {
    let n = AntennaManager.getAccounts().then(account => {
      if (account) {
        setStatus('ioPay connected: ', account.address)
        setView(generateHomePage)
      } else if (!isRetry) {
        setView(<Button onClick={onClickConnectWallet}>Open ioPay (Desktop)</Button>)
      } else {
        setView(<Button onClick={reload}>Reconnect</Button>)
      }
    })
  }

  const onClickConnectWallet = () => {
    window.location.replace('iopay://')

    setTimeout(() => {
      checkWallet(true)
    }, 10000);
  }

  const [status, setStatus] = useState('initializing...')
  const [view, setView] = useState(null)
  // const [view, setView] = useState(<ERC721Done address={'test_address'} />)

  useEffect(() => {
    setStatus('Connecting wallet...')
    AntennaManager.init()

    setTimeout(() => {
      checkWallet(false)
    }, 5000);
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
