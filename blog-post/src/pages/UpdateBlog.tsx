import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { supabase } from "../supabaseClient";
import type { Blog } from "../store/blogSlice";
import { useDispatch } from "react-redux";
import { updateBlog } from "../store/blogSlice";
import type { AppDispatch } from "../store/store";

const UpdateBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) setError(error.message);
      else setBlog(data);
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  const handleEdit = async (title: string, content: string) => {
    if (!id) return;
    const result = await dispatch(
      updateBlog({ id: Number(id), title, content })
    );
    if (updateBlog.fulfilled.match(result)) {
      navigate("/blogs");
    } else if (result.error) {
      setError(result.error.message || "Failed to update blog");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!blog) return <div className="text-center mt-8">Blog not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <BlogForm
        isEdit
        initialTitle={blog.title}
        initialContent={blog.content}
        onSubmitEdit={handleEdit}
        onCancel={() => navigate("/blogs")}
      />
    </div>
  );
};

export default UpdateBlog;
