import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { logout } from "./store/authSlice";
import { fetchBlogs } from "./store/blogSlice";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DeleteBlog from "./pages/DeleteBlog";
import UpdateBlog from "./pages/UpdateBlog";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";

const Account: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 tracking-tight">
          Account Page
        </h2>
        <p className="text-lg mb-8 text-gray-700">
          Welcome,{" "}
          <span className="font-semibold text-blue-600">{user?.email}</span>!
        </p>
        <Link
          to="/blogs"
          className="block mb-6 text-blue-600 hover:underline font-semibold text-lg"
        >
          Go to Blogs
        </Link>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
}

const Blogs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, status } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const BLOGS_PER_PAGE = 4;

  // Add logout handler for the blogs navbar
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  React.useEffect(() => {
    if (user) dispatch(fetchBlogs());
  }, [dispatch, user]);

  // Only show user's blogs with valid IDs
  const userBlogs = blogs.filter((b) => b.user_id === user?.id && b.id);
  const totalPages = Math.ceil(userBlogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs = userBlogs.slice(
    (page - 1) * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE
  );

  return (
    <>
      {/* Custom navbar for blogs page */}
      <nav className="bg-white shadow-lg mb-12 p-6 flex items-center justify-between relative rounded-b-2xl">
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-800">
          Blog App
        </span>
        <div className="flex gap-4 ml-auto">
          <Link
            to="/account"
            className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-50 font-semibold transition"
          >
            My Account
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition font-semibold shadow"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex justify-end mb-8">
          <Link to="/blogs/create">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow">
              Create Blog
            </button>
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold mb-10 text-center text-blue-700 tracking-tight">
          My Blogs
        </h1>
        <div className="mt-8 space-y-6">
          {status === "loading" && (
            <p className="text-center text-lg text-blue-600">Loading...</p>
          )}
          {userBlogs.length === 0 && (
            <p className="text-center text-gray-500">No blogs yet.</p>
          )}
          {paginatedBlogs.map((blog, index) => (
            <div
              key={blog.id || `temp-${index}`}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-blue-800">
                  {blog.title}
                </h2>
                <div className="flex gap-2">
                  <Link to={`/blogs/update/${blog.id}`}>
                    <button className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold border border-blue-300 shadow-sm">
                      Edit
                    </button>
                  </Link>
                  <Link to={`/blogs/delete/${blog.id}`}>
                    <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300 shadow-sm">
                      Delete
                    </button>
                  </Link>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{blog.content}</p>
              <p className="text-xs text-gray-400">
                Created: {new Date(blog.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg border font-semibold ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                } hover:bg-blue-700 hover:text-white transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Router>
      <Routes>
        <Route
          key="home"
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-4xl font-bold mb-8">Blog App</h1>
                {/* Home page content for logged-in users can go here */}
              </div>
            )
          }
        />
        <Route key="register" path="/register" element={<Register />} />
        <Route key="login" path="/login" element={<Login />} />
        <Route
          key="account"
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          key="blogs"
          path="/blogs"
          element={
            <PrivateRoute>
              <Blogs />
            </PrivateRoute>
          }
        />
        <Route
          key="blog-details"
          path="/blogs/:id"
          element={
            <PrivateRoute>
              <BlogDetails />
            </PrivateRoute>
          }
        />
        <Route
          key="create-blog"
          path="/blogs/create"
          element={
            <PrivateRoute>
              <CreateBlog />
            </PrivateRoute>
          }
        />
        <Route
          key="update-blog"
          path="/blogs/update/:id"
          element={
            <PrivateRoute>
              <UpdateBlog />
            </PrivateRoute>
          }
        />
        <Route
          key="delete-blog"
          path="/blogs/delete/:id"
          element={
            <PrivateRoute>
              <DeleteBlog />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
