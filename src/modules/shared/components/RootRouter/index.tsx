import { Route, Routes } from "react-router-dom";
import routes from "../../routes";

const RootRouter = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route path={route.url} key={route.url} element={route.onRender} />
      ))}
    </Routes>
  );
};

export default RootRouter;
