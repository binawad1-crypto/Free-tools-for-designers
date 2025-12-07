
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import QRCodeTool from './pages/QRCodeTool';
import ColorTool from './pages/ColorTool';
import TextTool from './pages/TextTool';
import PantoneTool from './pages/PantoneTool';
import ResizeTool from './pages/ResizeTool';
import UnitConverterTool from './pages/UnitConverterTool';
import NutritionTool from './pages/NutritionTool';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qr" element={<QRCodeTool />} />
            <Route path="/color" element={<ColorTool />} />
            <Route path="/text" element={<TextTool />} />
            <Route path="/pms" element={<PantoneTool />} />
            <Route path="/resize" element={<ResizeTool />} />
            <Route path="/units" element={<UnitConverterTool />} />
            <Route path="/nutrition" element={<NutritionTool />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;