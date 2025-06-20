import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { createBlog } from "../store/blogSlice";

interface BlogFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSuccess?: () => void;
  isEdit?: boolean;
  onSubmitEdit?: (title: string, content: string) => void;
  onCreated?: (id: number) => void;
  onCancel?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialTitle = "",
  initialContent = "",
  onSuccess,
  isEdit = false,
  onSubmitEdit,
  onCreated,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const { status, error } = useSelector((state: RootState) => state.blog);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && onSubmitEdit) {
      onSubmitEdit(title, content);
    } else {
      const result = await dispatch(createBlog({ title, content }));
      if (createBlog.fulfilled.match(result)) {
        setTitle("");
        setContent("");
        if (onSuccess) onSuccess();
        let blogId: number | undefined;
        if (result.payload) {
          if (Array.isArray(result.payload) && result.payload[0]?.id) {
            blogId = result.payload[0].id;
          } else if (
            typeof result.payload === "object" &&
            "id" in result.payload
          ) {
            blogId = (result.payload as { id: number }).id;
          }
        }
        if (onCreated && blogId) onCreated(blogId);
      }
      // Only log error if present
      if ("error" in result && result.error) {
        console.error("Blog creation error:", result.error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Blog" : "Create Blog"}
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px]"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isEdit
            ? "Update Blog"
            : status === "loading"
            ? "Creating..."
            : "Create Blog"}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
};

export default BlogForm;
