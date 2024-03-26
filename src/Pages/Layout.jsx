import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter as Router

import Home from "./Home";
import About from "./About";
import Gemini from "./Gemini";
import Interview from "./Interview";
import Check from "./Check";
import Demo from "./Demo";
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
                    <Route path="/d" element={<Demo />} />
                </Routes>
            </Router>
        </div>
    )
};

export default Layout
