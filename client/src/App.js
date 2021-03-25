import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';

import {store, persistor} from './Redux/store'
import BaseComponent from './Components/BaseComponent'

function App() {
  return (
    <Provider store = {store} >
      <PersistGate loading= {null} persistor = {persistor}> 
        <BaseComponent />
      </PersistGate>
    </Provider>
  )
}

export default App

