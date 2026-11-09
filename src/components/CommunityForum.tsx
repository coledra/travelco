import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  Search,
  MapPin,
  Tag,
  ShieldAlert,
  Sparkles,
  Send,
  Share2,
  Check,
} from 'lucide-react';
import { ForumPost } from '../types/travel';

interface CommunityForumProps {
  posts: ForumPost[];
  onAddPost: (post: ForumPost) => void;
  onUpvotePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string, author: string) => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  posts,
  onAddPost,
  onUpvotePost,
  onAddComment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [sharedAlert, setSharedAlert] = useState<string>('');

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newState, setNewState] = useState('Rajasthan');
  const [newCategory, setNewCategory] = useState<any>('Hidden Gems');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Hidden Gem, Local Tip');
  const [newAuthor, setNewAuthor] = useState('Traveler');

  const categories = ['All', 'Hidden Gems', 'Solo Travel Tips', 'Scam Alerts & Safety', 'Foodie Trails', 'Itinerary Review'];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const post: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Explorer',
      avatarSeed: `user-${Date.now()}`,
      date: 'Just now',
      state: newState,
      category: newCategory,
      content: newContent.trim(),
      upvotes: 1,
      hasUserUpvoted: true,
      tags: tagsArray.length > 0 ? tagsArray : ['Travel Tip'],
      commentsCount: 0,
      comments: [],
    };

    onAddPost(post);
    setShowNewPostModal(false);
    setNewTitle('');
    setNewContent('');
    setSharedAlert('Your story was published to the traveler forum!');
    setTimeout(() => setSharedAlert(''), 3000);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    onAddComment(postId, text, 'You');
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>Traveler Community</span>
              <span aria-hidden="true">·</span>
              <span>Reviews & Hidden Gems</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              India Travel Community Forum
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Real traveler advice, scam warnings, offbeat trails, and verified dining gems shared by explorers across India.
            </p>
          </div>

          <button
            onClick={() => setShowNewPostModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Share a Gem or Tip</span>
          </button>
        </div>
      </div>

      {sharedAlert && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{sharedAlert}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions, scam alerts, hidden viewpoints, or states..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = expandedCommentsPostId === post.id;

          return (
            <div
              key={post.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-3 shadow-xs"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{post.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                      <MapPin className="w-3 h-3" />
                      {post.state}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {post.title}
                  </h3>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                    post.category === 'Scam Alerts & Safety'
                      ? 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800'
                      : post.category === 'Hidden Gems'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                      : 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                  }`}
                >
                  {post.category}
                </span>
              </div>

              {/* Post Content */}
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Bottom Footer & Engagement Controls */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpvotePost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                      post.hasUserUpvoted
                        ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 font-bold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUserUpvoted ? 'fill-current' : ''}`} />
                    <span className="font-mono tabular-nums">{post.upvotes}</span>
                    <span className="hidden sm:inline">Upvotes</span>
                  </button>

                  <button
                    onClick={() => setExpandedCommentsPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.comments.length}</span>
                    <span>Comments</span>
                  </button>
                </div>
              </div>

              {/* Comments Accordion */}
              {isExpanded && (
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3 bg-neutral-50/50 dark:bg-neutral-800/20 p-3 rounded-lg">
                  {post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="text-xs p-2 rounded bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                          <div className="flex items-center justify-between text-[11px] text-neutral-400">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{comm.author}</span>
                            <span>{comm.date}</span>
                          </div>
                          <p className="mt-1 text-neutral-700 dark:text-neutral-300">{comm.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Add your travel insight or comment..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Share Travel Review or Hidden Gem
            </h3>

            <form onSubmit={handleCreatePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best secluded cafe in Fort Kochi overlooking fishermen..."
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="Hidden Gems">Hidden Gems</option>
                    <option value="Solo Travel Tips">Solo Travel Tips</option>
                    <option value="Scam Alerts & Safety">Scam Alerts & Safety</option>
                    <option value="Foodie Trails">Foodie Trails</option>
                    <option value="Itinerary Review">Itinerary Review</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="e.g. Kerala, Ladakh, Rajasthan"
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Advice / Story *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your authentic experience, exact timings, negotiations, or advice for fellow travelers..."
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Kerala, Seafood, Sunset"
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Sarah J."
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
