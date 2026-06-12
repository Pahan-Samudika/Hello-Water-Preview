"use client";

import React, { useState } from "react";
import { type DBBlogPost } from "@/lib/db-queries";
import { type BlogParagraph } from "@/constants/blogs";
import { createBlogAction, updateBlogAction, deleteBlogAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Trash,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";

interface BlogsClientProps {
  initialBlogs: DBBlogPost[];
}

interface BlogSource {
  name: string;
  url: string;
}

export function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const [blogs, setBlogs] = useState<DBBlogPost[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<DBBlogPost | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [deletingBlog, setDeletingBlog] = useState<DBBlogPost | null>(null);
  const [manualSlug, setManualSlug] = useState(false);

  // CMS state for content blocks and sources
  const [contentBlocks, setContentBlocks] = useState<BlogParagraph[]>([]);
  const [blogSources, setBlogSources] = useState<BlogSource[]>([]);

  // Filter blogs by title or author
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editingBlog || manualSlug) return;
    const slugInput = document.getElementById("form-slug") as HTMLInputElement;
    if (slugInput) {
      slugInput.value = slugify(e.target.value);
    }
  }

  function openCreateForm() {
    setEditingBlog(null);
    setFormError(null);
    setFormSuccess(null);
    setManualSlug(false);
    setContentBlocks([{ type: "text", text: "" }]);
    setBlogSources([]);
    setIsFormOpen(true);
  }

  function openEditForm(blog: DBBlogPost) {
    setEditingBlog(blog);
    setFormError(null);
    setFormSuccess(null);
    setManualSlug(true);
    // Deep copy current content & sources
    setContentBlocks(blog.content.map(b => ({ ...b })));
    setBlogSources(blog.sources ? blog.sources.map(s => ({ ...s })) : []);
    setIsFormOpen(true);
  }

  // --- Content Block Handlers ---
  function addContentBlock(type: BlogParagraph["type"]) {
    const newBlock: BlogParagraph = type === "list" ? { type, items: [""] } : { type, text: "" };
    setContentBlocks([...contentBlocks, newBlock]);
  }

  function removeContentBlock(index: number) {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  }

  function moveContentBlock(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contentBlocks.length) return;
    const updated = [...contentBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setContentBlocks(updated);
  }

  function handleBlockTextChange(index: number, value: string) {
    const updated = [...contentBlocks];
    updated[index].text = value;
    setContentBlocks(updated);
  }

  function handleBlockListChange(index: number, value: string) {
    const updated = [...contentBlocks];
    updated[index].items = value.split("\n").map(l => l.trim()).filter(Boolean);
    setContentBlocks(updated);
  }

  // --- Source Handlers ---
  function addSource() {
    setBlogSources([...blogSources, { name: "", url: "" }]);
  }

  function removeSource(index: number) {
    setBlogSources(blogSources.filter((_, i) => i !== index));
  }

  function handleSourceChange(index: number, field: keyof BlogSource, value: string) {
    const updated = [...blogSources];
    updated[index][field] = value;
    setBlogSources(updated);
  }

  // --- Form Submit ---
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    // Filter out invalid blocks
    const validBlocks = contentBlocks.filter(
      (b) => (b.text && b.text.trim() !== "") || (b.items && b.items.length > 0)
    );

    if (validBlocks.length === 0) {
      setFormError("You must write at least one content paragraph block.");
      setLoading(false);
      return;
    }

    const validSources = blogSources.filter((s) => s.name.trim() !== "" && s.url.trim() !== "");

    const formData = new FormData(event.currentTarget);
    formData.append("contentJson", JSON.stringify(validBlocks));
    formData.append("sourcesJson", JSON.stringify(validSources));

    try {
      let result;
      if (editingBlog) {
        result = await updateBlogAction(editingBlog.slug, null, formData);
      } else {
        result = await createBlogAction(null, formData);
      }

      if (result.success) {
        setFormSuccess(
          editingBlog
            ? "Blog post updated successfully!"
            : "Blog post published successfully!"
        );

        // Fetch values to update local state
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const subtitle = formData.get("subtitle") as string;
        const excerpt = formData.get("excerpt") as string;
        const coverImage = formData.get("coverImage") as string;
        const publishedAt = formData.get("publishedAt") as string;
        const readTime = formData.get("readTime") as string;
        const authorName = formData.get("authorName") as string;
        const authorRole = formData.get("authorRole") as string;
        const authorAvatar = formData.get("authorAvatar") as string;

        const updatedBlog: DBBlogPost = {
          slug,
          title,
          subtitle: subtitle || undefined,
          excerpt,
          coverImage,
          publishedAt,
          readTime,
          author: {
            name: authorName,
            role: authorRole,
            avatar: authorAvatar,
          },
          content: validBlocks,
          sources: validSources.length > 0 ? validSources : undefined,
        };

        if (editingBlog) {
          setUsers(
            blogs.map((b) => (b.slug === editingBlog.slug ? updatedBlog : b))
          );
        } else {
          setUsers([updatedBlog, ...blogs]);
        }

        // Helper trigger to map users locally
        function setUsers(newBlogs: DBBlogPost[]) {
          setBlogs(newBlogs);
        }

        setTimeout(() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }, 1000);
      } else {
        setFormError(result.error || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    setLoading(true);
    try {
      const result = await deleteBlogAction(slug);
      if (result.success) {
        setBlogs(blogs.filter((b) => b.slug !== slug));
        setDeletingBlog(null);
      } else {
        alert(result.error || "Failed to delete blog post");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // Format today's date for placeholder (e.g. "June 11, 2026")
  const defaultDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            Blogs Management
          </h1>
          <p className="text-xs text-slate-500">
            Write articles, reference sources, and manage posts on your website
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          {/* Filter search */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Filter blogs by title or author..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
            />
          </div>

          <button
            onClick={openCreateForm}
            className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Write Post</span>
          </button>
        </div>
      </div>

      {/* Blogs list table */}
      <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Blog Article</th>
              <th className="py-4 px-6">Publish Date</th>
              <th className="py-4 px-6">Reading Time</th>
              <th className="py-4 px-6">Author</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {paginatedBlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No blog posts registered in the database.
                </td>
              </tr>
            ) : (
              paginatedBlogs.map((post) => (
                <tr key={post.slug} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 aspect-video rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shrink-0">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                            <ImageIcon className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate max-w-xs md:max-w-md">
                          {post.title}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          Slug: {post.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{post.publishedAt}</td>
                  <td className="py-4 px-6 text-slate-300">{post.readTime}</td>
                  <td className="py-4 px-6 text-slate-300">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{post.author.name}</span>
                      <span className="text-[10px] text-slate-500">{post.author.role}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                        title="View public page"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                      <button
                        onClick={() => openEditForm(post)}
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Edit post"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingBlog(post)}
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all"
                        title="Delete post"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          totalItems={filteredBlogs.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Slide-out Sidebar Form (CMS Drawer) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setIsFormOpen(false)} />

          <div className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 md:p-8 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  {editingBlog ? "Edit Blog Article" : "Compose New Article"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {editingBlog ? `Drafting: ${editingBlog.title}` : "Authoring dynamic contents and lists"}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="size-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
              {formError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive-foreground flex gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                  <span className="font-semibold text-rose-300">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300 flex gap-2">
                  <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="font-semibold">{formSuccess}</span>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-title">
                    Article Title
                  </label>
                  <input
                    id="form-title"
                    name="title"
                    type="text"
                    required
                    defaultValue={editingBlog?.title || ""}
                    onChange={handleTitleChange}
                    placeholder="Australia's $2 Billion PFAS Lawsuit: Why Aussies Are Suddenly Questioning Water"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-slug">
                    URL Slug
                  </label>
                  <input
                    id="form-slug"
                    name="slug"
                    type="text"
                    required
                    defaultValue={editingBlog?.slug || ""}
                    onChange={() => setManualSlug(true)}
                    placeholder="pfas-lawsuit-australia"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-subtitle">
                    Subtitle (Optional)
                  </label>
                  <input
                    id="form-subtitle"
                    name="subtitle"
                    type="text"
                    defaultValue={editingBlog?.subtitle || ""}
                    placeholder="Toxic chemicals are making headlines again..."
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-excerpt">
                    Summary Excerpt (Card text & SEO)
                  </label>
                  <textarea
                    id="form-excerpt"
                    name="excerpt"
                    required
                    defaultValue={editingBlog?.excerpt || ""}
                    placeholder="Summarize the core theme of this article..."
                    rows={2}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-cover">
                    Cloudinary / Cover Image URL
                  </label>
                  <input
                    id="form-cover"
                    name="coverImage"
                    type="text"
                    required
                    defaultValue={editingBlog?.coverImage || ""}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Publish Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-date">
                    Publish Date text
                  </label>
                  <input
                    id="form-date"
                    name="publishedAt"
                    type="text"
                    required
                    defaultValue={editingBlog?.publishedAt || defaultDate}
                    placeholder="e.g. June 1, 2026"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Reading Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-readtime">
                    Reading Time
                  </label>
                  <input
                    id="form-readtime"
                    name="readTime"
                    type="text"
                    required
                    defaultValue={editingBlog?.readTime || "4 min read"}
                    placeholder="e.g. 4 min read"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Author Info */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 sm:col-span-2 grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Author Information
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Name</label>
                    <input
                      name="authorName"
                      type="text"
                      required
                      defaultValue={editingBlog?.author.name || "Hello Water Filtration"}
                      className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Role</label>
                    <input
                      name="authorRole"
                      type="text"
                      required
                      defaultValue={editingBlog?.author.role || "Water Quality Experts"}
                      className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Avatar path</label>
                    <input
                      name="authorAvatar"
                      type="text"
                      required
                      defaultValue={editingBlog?.author.avatar || "/images/logo-icon.png"}
                      className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Article Block Editor (CMS Core) */}
                <div className="sm:col-span-2 border-t border-slate-800 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Article Content Blocks
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Build headings, quotes, lists, and paragraph texts
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => addContentBlock("text")}
                        className="h-8 inline-flex items-center gap-1 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white text-[10px] font-bold text-slate-400 transition-all"
                      >
                        <PlusCircle className="size-3 text-sky-400" />
                        <span>Paragraph</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addContentBlock("heading")}
                        className="h-8 inline-flex items-center gap-1 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white text-[10px] font-bold text-slate-400 transition-all"
                      >
                        <PlusCircle className="size-3 text-purple-400" />
                        <span>Heading</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addContentBlock("list")}
                        className="h-8 inline-flex items-center gap-1 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white text-[10px] font-bold text-slate-400 transition-all"
                      >
                        <PlusCircle className="size-3 text-blue-400" />
                        <span>Bullet List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addContentBlock("quote")}
                        className="h-8 inline-flex items-center gap-1 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white text-[10px] font-bold text-slate-400 transition-all"
                      >
                        <PlusCircle className="size-3 text-emerald-400" />
                        <span>Quote Block</span>
                      </button>
                    </div>
                  </div>

                  {/* Render content blocks */}
                  <div className="space-y-4 pt-2">
                    {contentBlocks.map((block, index) => {
                      const isList = block.type === "list";
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border ${
                            block.type === "heading"
                              ? "border-purple-500/20 bg-purple-500/2"
                              : block.type === "quote"
                              ? "border-emerald-500/20 bg-emerald-500/2 italic"
                              : block.type === "list"
                              ? "border-blue-500/20 bg-blue-500/2"
                              : "border-slate-800 bg-slate-950/20"
                          } flex gap-4`}
                        >
                          {/* Side re-ordering actions */}
                          <div className="flex flex-col gap-1.5 shrink-0 justify-center">
                            <button
                              type="button"
                              onClick={() => moveContentBlock(index, "up")}
                              disabled={index === 0}
                              className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
                            >
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveContentBlock(index, "down")}
                              disabled={index === contentBlocks.length - 1}
                              className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
                            >
                              <ArrowDown className="size-3.5" />
                            </button>
                          </div>

                          {/* Block input field */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                                Block #{index + 1} — {block.type}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeContentBlock(index)}
                                className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </div>

                            {isList ? (
                              <textarea
                                value={block.items?.join("\n") || ""}
                                onChange={(e) => handleBlockListChange(index, e.target.value)}
                                placeholder="Bullet point 1&#10;Bullet point 2&#10;Bullet point 3 (one per line)"
                                rows={3}
                                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-primary transition-all resize-y"
                              />
                            ) : (
                              <textarea
                                value={block.text || ""}
                                onChange={(e) => handleBlockTextChange(index, e.target.value)}
                                placeholder={
                                  block.type === "heading"
                                    ? "Heading text"
                                    : block.type === "quote"
                                    ? "Quote content..."
                                    : "Write your paragraph text here..."
                                }
                                rows={block.type === "heading" ? 1 : 3}
                                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-primary transition-all resize-y"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sources Citation Builder */}
                <div className="sm:col-span-2 border-t border-slate-800 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Sources & References (Optional)
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Cite external media reports, guidelines, or research
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addSource}
                      className="h-8 inline-flex items-center gap-1 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white text-[10px] font-bold text-slate-400 transition-all"
                    >
                      <PlusCircle className="size-3 text-sky-400" />
                      <span>Add Citation</span>
                    </button>
                  </div>

                  {/* Render list of sources */}
                  <div className="space-y-3 pt-2">
                    {blogSources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/20"
                      >
                        <div className="grid gap-2 grid-cols-2 flex-1">
                          <input
                            type="text"
                            placeholder="Source Name (e.g. ABC News Australia)"
                            value={source.name}
                            onChange={(e) => handleSourceChange(index, "name", e.target.value)}
                            className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-primary transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Source URL link"
                            value={source.url}
                            onChange={(e) => handleSourceChange(index, "url", e.target.value)}
                            className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSource(index)}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all shrink-0"
                        >
                          <Trash className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-11 px-6 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center min-w-28"
                >
                  {loading ? (
                    <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : editingBlog ? (
                    "Save Changes"
                  ) : (
                    "Publish Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-white">Delete Blog Post?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the blog post{" "}
              <span className="font-bold text-white">{deletingBlog.title}</span>? It will no longer be visible on the public website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingBlog(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingBlog.slug)}
                className="h-10 px-4 rounded-xl bg-rose-500 text-xs font-bold text-white hover:bg-rose-600 transition-all flex items-center justify-center min-w-20"
              >
                {loading ? (
                  <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
