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
import Utilities from './Utilities';

function App() {
  const onClickERC20 = () => {
    setView(<ContractPanel onCancel={onCancel} onSubmit={onSubmit} />)
  }

  const onClickERC721 = () => {
    setView(<ERC721Panel onCancel={onCancel} onSubmit={onSubmitERC721} />)
  }

  const generateHomePage = () => {
    return (<HomePage
      jumpTo={jumpTo}
      jumpTo721={jumpTo721}
      onClickERC20={onClickERC20}
      onClickERC721={onClickERC721} />)
  }

  const jumpTo = deployedContract => {
    setView(<Done tokenName={deployedContract.tokenName} deployedAddress={deployedContract.address} />)
  }

  const jumpTo721 = deployedContract => {
    setView(<ERC721Done onCancel={onCancel} tokenName={deployedContract.tokenName} deployedAddress={deployedContract.address} />)
  }

  const onSubmit = (name, symbol, decimals, supply) => {
    AntennaManager.deployContract(name, symbol, decimals, supply, hxid => {
      if (hxid && hxid !== 'ERROR') {
        setView(<Done tokenName={name} hxid={hxid} />)
      } else {
        setView(<ContractPanel onCancel={onCancel} onSubmit={onSubmit} />)
      }
    })
  }

  const onSubmitERC721 = (name, supply) => {
    AntennaManager.deployERC721Contract(name, supply, contractAddress => {
      if (contractAddress && contractAddress !== 'ERROR') {
        setView(<ERC721Done tokenName={name} onCancel={onCancel} hxid={contractAddress} />)
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
    AntennaManager.getAccounts().then(account => {
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

  useEffect(() => {
    setStatus('Connecting wallet...')
    AntennaManager.init()

    if (Utilities.isIoPayMobile()) {
      AntennaManager.getAccounts().then(res => {
        if (res) {
          setStatus('ioPay connected: ', res.address)
        }

        setView(generateHomePage)
        // setView(<Done tokenName="tokenName" deployedAddress="io156w885vnls6f7zt7kad40z3ln75uum4ltt92tt" />)
        // setView(<ERC721Done tokenName="AAAAAAAA" deployedAddress="io1vysscvelmy2e5kl44lzs9ntn02xgnul9v5lp7s" />)
      })
    } else {
      setTimeout(() => {
        checkWallet(false)
        // setView(<Done tokenName="tokenName" deployedAddress="io156w885vnls6f7zt7kad40z3ln75uum4ltt92tt" />)
        // setView(<ERC721Done tokenName="AAAAAAAA" deployedAddress="io1vysscvelmy2e5kl44lzs9ntn02xgnul9v5lp7s" />)
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
