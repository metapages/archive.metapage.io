import { Navigate, Route, Routes } from "react-router-dom";
import { RouteHome } from "./routes/home";
import { RouteDocs } from "./routes/docs";

export const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RouteHome />} />
        <Route path="/docs/*" element={<RouteDocs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
