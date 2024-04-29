import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/styles/Common.scss";
import Accueil from "./pages/accueil/Accueil";

const App: FC = () => {
  return (
    <Router>
      <div className="pageWrapper">
        <Routes>
          <Route path="/" element={<Accueil />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
