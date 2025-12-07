
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import DesignerTools from './pages/DesignerTools';
import QRCodeTool from './pages/QRCodeTool';
import ColorTool from './pages/ColorTool';
import TextTool from './pages/TextTool';
import PantoneTool from './pages/PantoneTool';
import ResizeTool from './pages/ResizeTool';
import UnitConverterTool from './pages/UnitConverterTool';
import NutritionTool from './pages/NutritionTool';
import PDFTool from './pages/PDFTool';
import SocialSizesTool from './pages/SocialSizesTool';
import LogoMakerTool from './pages/LogoMakerTool';
import CreativeStudio from './pages/CreativeStudio';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* Main Hub for Designer Tools - Now the Home Page */}
            <Route path="/" element={<DesignerTools />} />
            
            {/* Individual Tools */}
            <Route path="/qr" element={<QRCodeTool />} />
            <Route path="/color" element={<ColorTool />} />
            <Route path="/text" element={<TextTool />} />
            <Route path="/pms" element={<PantoneTool />} />
            <Route path="/resize" element={<ResizeTool />} />
            <Route path="/units" element={<UnitConverterTool />} />
            <Route path="/nutrition" element={<NutritionTool />} />
            <Route path="/pdf" element={<PDFTool />} />
            <Route path="/social-sizes" element={<SocialSizesTool />} />
            <Route path="/logo" element={<LogoMakerTool />} />
            
            {/* Creative Studio */}
            <Route path="/studio" element={<CreativeStudio />} />
            
            {/* Placeholders for sidebar items */}
            <Route path="/support" element={<div className="p-10 text-center text-slate-500">Support Center Coming Soon</div>} />
            <Route path="/settings" element={<div className="p-10 text-center text-slate-500">Settings Page Coming Soon</div>} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
