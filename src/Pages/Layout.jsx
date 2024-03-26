import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter as Router

import Home from "./Home";
import About from "./About";
import Gemini from "./Gemini";
import Interview from "./Interview";
import Check from "./Check";
const Layout = () => {
    return (
        <div>
            <Router> {/* Wrap Routes and Route with Router */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/g" element={<Gemini />} />
                    <Route path="/i" element={<Interview />} />
                    <Route path="/c" element={<Check />} />
                </Routes>
            </Router>
        </div>
    )
};

export default Layout
