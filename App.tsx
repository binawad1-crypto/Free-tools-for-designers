import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Page Imports
import Home from './pages/Home'; // Or DesignerTools if that's the main page
import DesignerTools from './pages/DesignerTools';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Support from './pages/Support';
import TemplatesGallery from './pages/TemplatesGallery';
import CreativeStudio from './pages/CreativeStudio';
import SpecialToolsHub from './pages/SpecialToolsHub';

// Standard Tools
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

// Special/Smart Tools
import ScreenshotToCodeTool from './pages/smart/ScreenshotToCodeTool';
import IconGeneratorTool from './pages/smart/IconGeneratorTool';
import PromptEnhancerTool from './pages/smart/PromptEnhancerTool';
import FontPairerTool from './pages/smart/FontPairerTool';
import DesignCritiqueTool from './pages/smart/DesignCritiqueTool';
import TweetMakerTool from './pages/smart/TweetMakerTool';
import SmartChatTool from './pages/special/SmartChatTool';
import VisionTool from './pages/special/VisionTool';
import AudioTool from './pages/special/AudioTool';
import LiveTool from './pages/special/LiveTool';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Layout><ProtectedRoute><DesignerTools /></ProtectedRoute></Layout>} />
            <Route path="/studio" element={<Layout><ProtectedRoute><CreativeStudio /></ProtectedRoute></Layout>} />
            <Route path="/templates" element={<Layout><ProtectedRoute><TemplatesGallery /></ProtectedRoute></Layout>} />
            <Route path="/special" element={<Layout><ProtectedRoute><SpecialToolsHub /></ProtectedRoute></Layout>} />
            <Route path="/support" element={<Layout><ProtectedRoute><Support /></ProtectedRoute></Layout>} />
            <Route path="/settings" element={<Layout><ProtectedRoute><Settings /></ProtectedRoute></Layout>} />

            {/* Standard Tools Routes */}
            <Route path="/tools/qr" element={<Layout><ProtectedRoute><QRCodeTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/color" element={<Layout><ProtectedRoute><ColorTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/text" element={<Layout><ProtectedRoute><TextTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/pms" element={<Layout><ProtectedRoute><PantoneTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/resize" element={<Layout><ProtectedRoute><ResizeTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/units" element={<Layout><ProtectedRoute><UnitConverterTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/nutrition" element={<Layout><ProtectedRoute><NutritionTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/pdf" element={<Layout><ProtectedRoute><PDFTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/social" element={<Layout><ProtectedRoute><SocialSizesTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/logo" element={<Layout><ProtectedRoute><LogoMakerTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/marketing" element={<Layout><ProtectedRoute><MarketingTool /></ProtectedRoute></Layout>} />
            <Route path="/tools/competitor" element={<Layout><ProtectedRoute><CompetitorTool /></ProtectedRoute></Layout>} />

            {/* Special/Smart Tools Routes */}
            <Route path="/smart/img2code" element={<Layout><ProtectedRoute><ScreenshotToCodeTool /></ProtectedRoute></Layout>} />
            <Route path="/smart/icons" element={<Layout><ProtectedRoute><IconGeneratorTool /></ProtectedRoute></Layout>} />
            <Route path="/smart/prompt" element={<Layout><ProtectedRoute><PromptEnhancerTool /></ProtectedRoute></Layout>} />
            <Route path="/smart/fonts" element={<Layout><ProtectedRoute><FontPairerTool /></ProtectedRoute></Layout>} />
            <Route path="/smart/critique" element={<Layout><ProtectedRoute><DesignCritiqueTool /></ProtectedRoute></Layout>} />
            <Route path="/smart/tweets" element={<Layout><ProtectedRoute><TweetMakerTool /></ProtectedRoute></Layout>} />
            
            <Route path="/special/chat" element={<Layout><ProtectedRoute><SmartChatTool /></ProtectedRoute></Layout>} />
            <Route path="/special/vision" element={<Layout><ProtectedRoute><VisionTool /></ProtectedRoute></Layout>} />
            <Route path="/special/audio" element={<Layout><ProtectedRoute><AudioTool /></ProtectedRoute></Layout>} />
            <Route path="/special/live" element={<Layout><ProtectedRoute><LiveTool /></ProtectedRoute></Layout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </AppProvider>
  );
};

export default App;
