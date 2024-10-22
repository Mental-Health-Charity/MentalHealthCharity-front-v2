import { Route } from "react-router-dom";
import { Roles } from "../../users/constants";

interface Props {
  children: React.ReactNode;
  path: string;
  permissions?: Roles[];
  requiresAuth?: boolean;
}

const RouteGuard = ({ children, path }: Props) => {
  // TODO: Implement route guard

  return <Route path={path} element={children} />;
};

export default RouteGuard;
