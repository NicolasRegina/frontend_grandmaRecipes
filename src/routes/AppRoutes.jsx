import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Recipes from "../pages/Recipes";
import RecipeForm from "../pages/RecipeForm";
import Groups from "../pages/Groups";
import GroupForm from "../pages/GroupForm";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AdminUsers from "../pages/AdminUsers";
import AdminGroups from "../pages/AdminGroups";
import AdminRecipes from "../pages/AdminRecipes";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../context/ProtectedRoute";
import EditRecipeForm from "../pages/EditRecipeForm";
import EditGroupForm from "../pages/EditGroupForm";
import RecipeDetail from "../pages/RecipeDetail";
import GroupDetail from "../pages/GroupDetail";
import ModerationGroups from "../pages/ModerationGroups";
import ModerationRecipes from "../pages/ModerationRecipes";

const AppRoutes = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas de administración */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/groups"
        element={
          <ProtectedRoute>
            <AdminGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recipes"
        element={
          <ProtectedRoute>
            <AdminRecipes />
          </ProtectedRoute>
        }
      />

      {/* Rutas de moderación */}
      <Route
        path="/moderation/groups"
        element={
          <ProtectedRoute>
            <ModerationGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moderation/recipes"
        element={
          <ProtectedRoute>
            <ModerationRecipes />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas */}
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes/new"
        element={
          <ProtectedRoute>
            <RecipeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes/:id"
        element={
          <ProtectedRoute>
            <RecipeDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes/:id/edit"
        element={
          <ProtectedRoute>
            <EditRecipeForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/new"
        element={
          <ProtectedRoute>
            <GroupForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <GroupDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id/edit"
        element={
          <ProtectedRoute>
            <EditGroupForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
