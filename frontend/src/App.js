import React from 'react';
import Storefront from './Storefront';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Storefront />
      </div>
    </CartProvider>
  );
}

export default App;