import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { supabase } from "../supabaseClient";
import type { Blog } from "../store/blogSlice";

const UpdateBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        onSubmitEdit={() => navigate("/blogs")}
        onCancel={() => navigate("/blogs")}
      />
    </div>
  );
};

export default UpdateBlog;
