import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import PickingOrders from '../pages/picking/Orders';
import Drivers from '../pages/Drivers';
import Routes from '../pages/Routes';
import RoutesList from '../pages/RoutesList';
import RouteDetails from '../pages/RouteDetails';
import Users from '../pages/picking/Users';
import PickingLists from '../pages/picking/PickingLists';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function RoleRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  return user && allowedRoles.includes(user.role) ? children : <Navigate to="/dashboard" />;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Routing Admin Routes */}
        <Route
          path="orders"
          element={
            <RoleRoute allowedRoles={['ROUTING_ADMIN']}>
              <Orders />
            </RoleRoute>
          }
        />
        <Route
          path="drivers"
          element={
            <RoleRoute allowedRoles={['ROUTING_ADMIN']}>
              <Drivers />
            </RoleRoute>
          }
        />
        <Route
          path="routes"
          element={
            <RoleRoute allowedRoles={['ROUTING_ADMIN']}>
              <RoutesList />
            </RoleRoute>
          }
        />
        <Route
          path="routes/create"
          element={
            <RoleRoute allowedRoles={['ROUTING_ADMIN']}>
              <Routes />
            </RoleRoute>
          }
        />
        <Route
          path="routes/:id"
          element={
            <RoleRoute allowedRoles={['ROUTING_ADMIN']}>
              <RouteDetails />
            </RoleRoute>
          }
        />

        {/* Picking Admin Routes */}
        <Route
          path="orders"
          element={
            <RoleRoute allowedRoles={['PICKING_ADMIN']}>
              <PickingOrders />
            </RoleRoute>
          }
        />
        <Route
          path="users"
          element={
            <RoleRoute allowedRoles={['PICKING_ADMIN']}>
              <Users />
            </RoleRoute>
          }
        />
        <Route
          path="picking-lists"
          element={
            <RoleRoute allowedRoles={['PICKING_ADMIN']}>
              <PickingLists />
            </RoleRoute>
          }
        />
      </Route>
    </RouterRoutes>
  );
}