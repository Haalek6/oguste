import { type ReactElement } from 'react';
import { PropertyProvider } from './contexts/PropertyContext';
import { MainHeader } from './components/MainHeader';
import { OgusteView } from './components/OgusteView';

function App(): ReactElement {
  return (
    <PropertyProvider>
      <div className="min-h-screen bg-gray-50">
        <MainHeader />
        <OgusteView />
      </div>
    </PropertyProvider>
  );
}

export default App;
