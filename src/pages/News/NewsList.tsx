import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, ChevronDown, Flame } from "lucide-react";
import "./NewsList.css";

interface NewsArticle {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  trending?: boolean;
}

const NewsList: React.FC = () => {
  const { spaceId } = useParams();
  const [activeCategory, setActiveCategory] = useState("All News");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All News",
    "MFTBC News",
    "DTA News",
    "DICV News",
    "Corporate Updates",
    "CEO Messages",
    "HR Announcements",
    "Events",
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      image:
        "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "DTA News",
      date: "2024-01-15",
      title: "DTA News: Q4 Performance Update and Strategic Initiatives",
      description:
        "Quarterly performance results show strong growth across all divisions...",
      author: "Strategic Communications Team",
      likes: 45,
      comments: 12,
      shares: 8,
      trending: true,
    },
    {
      id: "2",
      image:
        "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "DICV News",
      date: "2024-01-12",
      title: "DICV News: New Manufacturing Facility Opens in Chennai",
      description:
        "Expansion of manufacturing capabilities with new state-of-the-art facility...",
      author: "DICV Communications Team",
      likes: 67,
      comments: 23,
      shares: 15,
      trending: true,
    },
    {
      id: "3",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "CEO Communications",
      date: "2024-01-10",
      title: "CEO Communications: Vision 2025",
      description:
        "Strategic vision and roadmap for FUSO’s future growth and innovation...",
      author: "Hartmut Schick, President & CEO",
      likes: 89,
      comments: 34,
      shares: 28,
    },
    {
      id: "4",
      image:
        "https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Corporate Updates",
      date: "2024-01-08",
      title: "Corporate Update: Sustainability Milestone Achieved",
      description:
        "FUSO achieves significant milestone in carbon reduction goals...",
      author: "Sustainability Team",
      likes: 52,
      comments: 18,
      shares: 11,
    },
    {
      id: "5",
      image:
        "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "HR Announcements",
      date: "2024-01-05",
      title: "HR Announcement: New Employee Wellness Program Launch",
      description:
        "Comprehensive wellness program including mental health support...",
      author: "Human Resources",
      likes: 73,
      comments: 29,
      shares: 19,
    },
    {
      id: "6",
      image:
        "https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "MFTBC News",
      date: "2024-01-03",
      title: "MFTBC News: Innovation Lab Opens in Tokyo",
      description:
        "New innovation lab focuses on next-generation vehicle technologies...",
      author: "Innovation Team",
      likes: 41,
      comments: 16,
      shares: 9,
    },
  ];

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory =
      activeCategory === "All News" || article.category === activeCategory;

    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const trendingNews = newsArticles.filter((n) => n.trending).slice(0, 3);

  return (
    <div className="page-container">
      <div className="news-list">
        {/* Hero Section */}
        <div className="news-hero">
          <h1 className="news-hero-title">FUSO News Center</h1>
          <p className="news-hero-subtitle">
            Stay updated with company news, communications, and updates from the
            FUSO organization.
          </p>
        </div>

        <div className="news-content-wrapper">
          {/* ------------------ MAIN CONTENT ------------------ */}
          <div className="news-main">
            {/* Filters */}
            <div className="news-filters">
              <div className="category-tabs">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-tab ${
                      activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="filter-controls">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="sort-dropdown">
                  <select className="sort-select">
                    <option>Latest</option>
                    <option>Most Popular</option>
                    <option>Most Commented</option>
                  </select>
                  <ChevronDown size={18} className="dropdown-icon" />
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="news-articles">
              {filteredArticles.length === 0 ? (
                <p className="no-results">No articles found.</p>
              ) : (
                filteredArticles.map((article) => (
                  <article key={article.id} className="news-article-card">
                    {article.trending && (
                      <div className="trending-badge">TRENDING</div>
                    )}

                    <div className="article-image-wrapper">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="article-image"
                      />
                    </div>

                    <div className="article-content">
                      <div className="article-header">
                        <span className="article-category">
                          {article.category}
                        </span>
                        <span className="article-date">{article.date}</span>
                      </div>

                      <h2 className="article-title">{article.title}</h2>
                      <p className="article-description">
                        {article.description}
                      </p>

                      <p className="article-author">By {article.author}</p>

                      <div className="article-footer">
                        <div className="article-stats">
                          <span className="stat-item">
                            ❤️ {article.likes}
                          </span>
                          <span className="stat-item">
                            💬 {article.comments}
                          </span>
                          <span className="stat-item">
                            🔗 {article.shares}
                          </span>
                        </div>

                        {/* Dynamic Route Link */}
                        <Link
                          to={`/space/${spaceId}/news/${article.id}`}
                          className="read-more-link"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="load-more-wrapper">
              <button className="load-more-button">Load More Articles</button>
            </div>
          </div>

          {/* ------------------ SIDEBAR ------------------ */}
          <aside className="news-sidebar">
            <div className="sidebar-section trending-section">
              <div className="sidebar-header">
                <Flame size={20} className="flame-icon" />
                <h3 className="sidebar-title">Trending News</h3>
              </div>

              <div className="trending-list">
                {trendingNews.map((t, index) => (
                  <Link
                    key={t.id}
                    to={`/space/${spaceId}/news/${t.id}`}
                    className="trending-item"
                  >
                    <div className="trending-number">{index + 1}</div>

                    <div className="trending-info">
                      <h4 className="trending-title">{t.title}</h4>
                      <p className="trending-meta">
                        {t.likes} likes · {t.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-section quick-links-section">
              <h3 className="sidebar-title">Quick Links</h3>
              <ul className="quick-links-list">
                <li className="quick-link-item">Communication Guidelines</li>
                <li className="quick-link-item">Corporate Brochure</li>
                <li className="quick-link-item">Profile Presentation</li>
                <li className="quick-link-item">DTA Strategy</li>
              </ul>
            </div>

            <div className="sidebar-section newsletter-section">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-description">
                Subscribe to our internal newsletter for updates.
              </p>
              <button className="subscribe-button">Subscribe Now</button>
            </div>
          </aside>
        </div>

        <footer className="news-footer">
          <p>© 2024 FUSO. All rights reserved.</p>
          <p className="powered-by">Powered by Readdy</p>
        </footer>
      </div>
    </div>
  );
};

export default NewsList;
