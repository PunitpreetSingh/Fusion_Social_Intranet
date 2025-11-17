import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Globe,
  Bell,
} from "lucide-react";
import "./NewsDetail.css";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

const NewsDetail: React.FC = () => {
  const { spaceId, newsId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState("");

  // --------------------- FAKE SAMPLE DATA ----------------------
  const article = {
    id: newsId,
    title: "DTA News: Q4 Performance Update and Strategic Initiatives",
    category: "DTA News",
    date: "2024-01-15",
    author: "Strategic Communications Team",
    readTime: "5 min read",
    image:
      "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
    likes: 45,
    comments: 12,
    shares: 8,
    content: `
      <p>We are pleased to share our Q4 performance results...</p>
      <h2>Key Performance Highlights</h2>
      <p>The fourth quarter has been exceptional...</p>
      <ul>
        <li>Record vehicle deliveries</li>
        <li>15% improvement in manufacturing</li>
        <li>Launch of new EV models</li>
      </ul>
      <h2>Looking Forward</h2>
      <p>As we enter 2025...</p>
    `,
  };

  const comments: Comment[] = [
    {
      id: "1",
      author: "Michael Chen",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=100",
      content: "Great results!",
      timestamp: "2 hours ago",
      likes: 8,
    },
    {
      id: "2",
      author: "Sarah Johnson",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=100",
      content: "Looking forward to the new portal.",
      timestamp: "4 hours ago",
      likes: 5,
    },
  ];

  const relatedArticles = [
    {
      id: "2",
      title: "DICV News: New Facility Opens in Chennai",
      category: "DICV News",
      date: "2024-01-12",
    },
    {
      id: "3",
      title: "CEO Communications: Vision 2025",
      category: "CEO Communications",
      date: "2024-01-10",
    },
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    console.log("Comment Submitted:", commentText);
    setCommentText("");
  };

  // --------------------- UI RENDER ----------------------
  return (
    <div className="page-container">
      <div className="news-detail">
        {/* Back Button */}
        <div className="detail-header">
          <Link to={`/space/${spaceId}/news`} className="back-link">
            <ArrowLeft size={20} />
            Back to News
          </Link>
        </div>

        <div className="detail-content-wrapper">
          {/* --------------------- MAIN ARTICLE ---------------------- */}
          <article className="detail-main">
            <div className="article-meta-header">
              <span className="article-category-badge">{article.category}</span>
              <span className="article-read-time">{article.readTime}</span>
            </div>

            <h1 className="article-main-title">{article.title}</h1>

            <div className="article-author-info">
              <div className="author-details">
                <span className="author-name">By {article.author}</span>
                <span className="article-publish-date">{article.date}</span>
              </div>
            </div>

            <div className="article-image-container">
              <img
                src={article.image}
                alt={article.title}
                className="article-main-image"
              />
            </div>

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Likes / Comments / Share */}
            <div className="article-engagement">
              <div className="engagement-stats">
                <button
                  className={`engagement-button ${isLiked ? "active" : ""}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    size={20}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  <span>{article.likes + (isLiked ? 1 : 0)}</span>
                </button>

                <button className="engagement-button">
                  <MessageCircle size={20} />
                  <span>{article.comments}</span>
                </button>

                <button className="engagement-button">
                  <Share2 size={20} />
                  <span>{article.shares}</span>
                </button>
              </div>
            </div>

            {/* --------------------- COMMENTS ---------------------- */}
            <div className="comments-section">
              <h3 className="comments-title">
                Comments ({comments.length})
              </h3>

              <form
                className="comment-form"
                onSubmit={handleCommentSubmit}
              >
                <textarea
                  className="comment-textarea"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />

                <button type="submit" className="comment-submit-button">
                  <Send size={18} />
                  Post Comment
                </button>
              </form>

              {/* Comment List */}
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="comment-avatar"
                    />

                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.author}
                        </span>
                        <span className="comment-timestamp">
                          {comment.timestamp}
                        </span>
                      </div>

                      <p className="comment-text">{comment.content}</p>

                      <div className="comment-actions">
                        <button className="comment-like-button">
                          <Heart size={14} />
                          {comment.likes}
                        </button>
                        <button className="comment-reply-button">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* --------------------- SIDEBAR ---------------------- */}
          <aside className="detail-sidebar">
            <div className="sidebar-actions">
              <button className="sidebar-action-button">
                <Share2 size={20} />
                <span>Share</span>
              </button>

              <button className="sidebar-action-button">
                <Globe size={20} />
                <span>Translate</span>
              </button>

              <button
                className={`sidebar-action-button ${
                  isFollowing ? "active" : ""
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <Bell
                  size={20}
                  fill={isFollowing ? "currentColor" : "none"}
                />
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </button>

              <button
                className={`sidebar-action-button ${
                  isSaved ? "active" : ""
                }`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark
                  size={20}
                  fill={isSaved ? "currentColor" : "none"}
                />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>

            {/* Related Articles */}
            <div className="sidebar-card">
              <h4 className="sidebar-card-title">Related Articles</h4>

              <div className="related-articles-list">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/space/${spaceId}/news/${related.id}`}
                    className="related-article-item"
                  >
                    <span className="related-category">
                      {related.category}
                    </span>
                    <h5 className="related-title">{related.title}</h5>
                    <span className="related-date">
                      {related.date}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="sidebar-card newsletter-card">
              <h4 className="sidebar-card-title">Stay Updated</h4>
              <p className="newsletter-text">
                Get the latest news and updates delivered to your inbox.
              </p>
              <button className="newsletter-subscribe-button">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
