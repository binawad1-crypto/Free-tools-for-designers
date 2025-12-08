

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import MarketingTool from './pages/MarketingTool';
import CompetitorTool from './pages/CompetitorTool';
import CreativeStudio from './pages/CreativeStudio';
import SpecialToolsHub from './pages/SpecialToolsHub';
import SmartChatTool from './pages/special/SmartChatTool';
import VisionTool from './pages/special/VisionTool';
import AudioTool from './pages/special/AudioTool';
import LiveTool from './pages/special/LiveTool';
import ScreenshotToCodeTool from './pages/smart/ScreenshotToCodeTool';
import IconGeneratorTool from './pages/smart/IconGeneratorTool';
import PromptEnhancerTool from './pages/smart/PromptEnhancerTool';
import FontPairerTool from './pages/smart/FontPairerTool';
import DesignCritiqueTool from './pages/smart/DesignCritiqueTool';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Wrapper to protect routes
const ProtectedRoute = ({ children }: React.PropsWithChildren<{}>) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 dark:border-slate-800 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Routes>
              {/* Login Route (Public) */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes - All other routes require login */}
              <Route path="/" element={<ProtectedRoute><DesignerTools /></ProtectedRoute>} />
              
              <Route path="/qr" element={<ProtectedRoute><QRCodeTool /></ProtectedRoute>} />
              <Route path="/color" element={<ProtectedRoute><ColorTool /></ProtectedRoute>} />
              <Route path="/text" element={<ProtectedRoute><TextTool /></ProtectedRoute>} />
              <Route path="/pms" element={<ProtectedRoute><PantoneTool /></ProtectedRoute>} />
              <Route path="/resize" element={<ProtectedRoute><ResizeTool /></ProtectedRoute>} />
              <Route path="/units" element={<ProtectedRoute><UnitConverterTool /></ProtectedRoute>} />
              <Route path="/nutrition" element={<ProtectedRoute><NutritionTool /></ProtectedRoute>} />
              <Route path="/pdf" element={<ProtectedRoute><PDFTool /></ProtectedRoute>} />
              <Route path="/social-sizes" element={<ProtectedRoute><SocialSizesTool /></ProtectedRoute>} />
              <Route path="/logo" element={<ProtectedRoute><LogoMakerTool /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute><MarketingTool /></ProtectedRoute>} />
              <Route path="/competitor" element={<ProtectedRoute><CompetitorTool /></ProtectedRoute>} />
              
              <Route path="/studio" element={<ProtectedRoute><CreativeStudio /></ProtectedRoute>} />

              <Route path="/special" element={<ProtectedRoute><SpecialToolsHub /></ProtectedRoute>} />
              <Route path="/special/chat" element={<ProtectedRoute><SmartChatTool /></ProtectedRoute>} />
              <Route path="/special/vision" element={<ProtectedRoute><VisionTool /></ProtectedRoute>} />
              <Route path="/special/audio" element={<ProtectedRoute><AudioTool /></ProtectedRoute>} />
              <Route path="/special/live" element={<ProtectedRoute><LiveTool /></ProtectedRoute>} />

              {/* NEW SMART TOOLS ROUTES */}
              <Route path="/smart/img2code" element={<ProtectedRoute><ScreenshotToCodeTool /></ProtectedRoute>} />
              <Route path="/smart/icons" element={<ProtectedRoute><IconGeneratorTool /></ProtectedRoute>} />
              <Route path="/smart/prompt" element={<ProtectedRoute><PromptEnhancerTool /></ProtectedRoute>} />
              <Route path="/smart/fonts" element={<ProtectedRoute><FontPairerTool /></ProtectedRoute>} />
              <Route path="/smart/critique" element={<ProtectedRoute><DesignCritiqueTool /></ProtectedRoute>} />
              
              <Route path="/support" element={<ProtectedRoute><div className="p-10 text-center text-slate-500">Support Center Coming Soon</div></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </AppProvider>
  );
};

export default App;