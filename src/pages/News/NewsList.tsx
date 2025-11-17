import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ChevronDown, Flame } from 'lucide-react';
import './NewsList.css';

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

export const NewsList: React.FC = () => {
  const { spaceId } = useParams();
  const [activeCategory, setActiveCategory] = useState('All News');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All News',
    'MFTBC News',
    'DTA News',
    'DICV News',
    'Corporate Updates',
    'CEO Messages',
    'HR Announcements',
    'Events',
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DTA News',
      date: '2024-01-15',
      title: 'DTA News: Q4 Performance Update and Strategic Initiatives',
      description:
        'Quarterly performance results show strong growth across all divisions. New strategic initiatives announced for sustainable transportation solutions and digital transformation.',
      author: 'Strategic Communications Team',
      likes: 45,
      comments: 12,
      shares: 8,
      trending: true,
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DICV News',
      date: '2024-01-12',
      title: 'DICV News: New Manufacturing Facility Opens in Chennai',
      description:
        'Expansion of manufacturing capabilities with new state-of-the-art facility will increase production capacity by 40% and create 500 new jobs.',
      author: 'DICV Communications Team',
      likes: 67,
      comments: 23,
      shares: 15,
      trending: true,
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'CEO Communications',
      date: '2024-01-10',
      title: 'CEO Communications: Vision 2025 - Shaping the Future of Commercial Transportation',
      description:
        'Strategic vision and roadmap for FUSO\'s future growth and innovation. Focus on electrification, autonomous driving, and sustainable logistics solutions.',
      author: 'Hartmut Schick, President & CEO',
      likes: 89,
      comments: 34,
      shares: 28,
    },
    {
      id: '4',
      image: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Corporate Updates',
      date: '2024-01-08',
      title: 'Corporate Update: Sustainability Milestone Achieved',
      description:
        'FUSO achieves significant milestone in carbon reduction goals. 30% reduction in manufacturing emissions and launch of new electric vehicle lineup.',
      author: 'Sustainability Team',
      likes: 52,
      comments: 18,
      shares: 11,
    },
    {
      id: '5',
      image: 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'HR Announcements',
      date: '2024-01-05',
      title: 'HR Announcement: New Employee Wellness Program Launch',
      description:
        'Comprehensive wellness program including mental health support, fitness facilities, and work-life balance initiatives for all FUSO employees.',
      author: 'Human Resources',
      likes: 73,
      comments: 29,
      shares: 19,
    },
    {
      id: '6',
      image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'MFTBC News',
      date: '2024-01-03',
      title: 'MFTBC News: Innovation Lab Opens in Tokyo',
      description:
        'New innovation lab focuses on next-generation commercial vehicle technologies including AI, IoT, and advanced driver assistance systems.',
      author: 'Innovation Team',
      likes: 41,
      comments: 16,
      shares: 9,
    },
  ];

  const trendingNews = newsArticles.filter((article) => article.trending).slice(0, 3);

  return (
    <div className="page-container">
      <div className="news-list">
        <div className="news-hero">
          <h1 className="news-hero-title">FUSO News Center</h1>
          <p className="news-hero-subtitle">
            Stay updated with company news, communications, and internal updates from across the
            FUSO organization.
          </p>
        </div>

        <div className="news-content-wrapper">
          <div className="news-main">
            <div className="news-filters">
              <div className="category-tabs">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-tab ${activeCategory === category ? 'active' : ''}`}
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

            <div className="news-articles">
              {newsArticles.map((article) => (
                <article key={article.id} className="news-article-card">
                  {article.trending && (
                    <div className="trending-badge">
                      <span>TRENDING</span>
                    </div>
                  )}
                  <div className="article-image-wrapper">
                    <img src={article.image} alt={article.title} className="article-image" />
                  </div>
                  <div className="article-content">
                    <div className="article-header">
                      <span className="article-category">{article.category}</span>
                      <span className="article-date">{article.date}</span>
                    </div>
                    <h2 className="article-title">{article.title}</h2>
                    <p className="article-description">{article.description}</p>
                    <p className="article-author">By {article.author}</p>
                    <div className="article-footer">
                      <div className="article-stats">
                        <span className="stat-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          {article.likes}
                        </span>
                        <span className="stat-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          {article.comments}
                        </span>
                        <span className="stat-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                          {article.shares}
                        </span>
                      </div>
                      <Link to={`/space/${spaceId}/news/${article.id}`} className="read-more-link">
                        Read More
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="load-more-wrapper">
              <button className="load-more-button">Load More Articles</button>
            </div>
          </div>

          <aside className="news-sidebar">
            <div className="sidebar-section trending-section">
              <div className="sidebar-header">
                <Flame size={20} className="flame-icon" />
                <h3 className="sidebar-title">Trending News</h3>
              </div>
              <div className="trending-list">
                {trendingNews.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/space/${spaceId}/news/${article.id}`}
                    className="trending-item"
                  >
                    <div className="trending-number">{index + 1}</div>
                    <div className="trending-info">
                      <h4 className="trending-title">{article.title}</h4>
                      <p className="trending-meta">
                        {article.likes} likes · {article.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-section quick-links-section">
              <h3 className="sidebar-title">Quick Links</h3>
              <ul className="quick-links-list">
                <li className="quick-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <a href="#">Communication Guidelines</a>
                </li>
                <li className="quick-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <a href="#">Corporate Brochure</a>
                </li>
                <li className="quick-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <a href="#">Profile Presentation</a>
                </li>
                <li className="quick-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <a href="#">DTA Strategy</a>
                </li>
              </ul>
            </div>

            <div className="sidebar-section newsletter-section">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-description">
                Subscribe to our internal newsletter for the latest updates.
              </p>
              <button className="subscribe-button">Subscribe Now</button>
            </div>
          </aside>
        </div>

        <footer className="news-footer">
          <p>© 2024 FUSO. Part of Daimler Truck. All rights reserved.</p>
          <p className="powered-by">Powered by Readdy</p>
        </footer>
      </div>
    </div>
  );
};

export default NewsList;
