// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './context/RequireAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './header/header';
import { UserFiles } from './pages/UserFiles';
import { DOWNLOAD, FILES, LOGIN, NOTFOUND, TRANSFER } from './constants/Routes';
import { DownloadPage } from './pages/Download';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path={LOGIN} element={<LoginPage />} />
          <Route path={DOWNLOAD} element={<DownloadPage />} />
          <Route
            path={TRANSFER}
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route path={FILES} element={<RequireAuth><UserFiles/></RequireAuth>}/>
          <Route path={NOTFOUND} element={<div>404</div>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
