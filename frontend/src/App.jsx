import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Packages from './pages/public/Packages';
import PackageDetail from './pages/public/PackageDetail';
import PublicLayout from './layouts/PublicLayout';
import Services from './pages/public/Services';


function App(){
    return (
        <>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/packages/:id" element={<PackageDetail />} />
                    <Route path="/services" element={<Services />} />

                </Route>
            </Routes>
        </>
    );
}

export default App;