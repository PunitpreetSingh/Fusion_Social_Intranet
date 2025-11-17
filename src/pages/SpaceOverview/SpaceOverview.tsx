import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Info } from 'lucide-react';
import './SpaceOverview.css';

interface NewsItem {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
  author: string;
}

export const SpaceOverview: React.FC = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');
  const [languageTab, setLanguageTab] = useState('dta-news');

  const tabs = [
    { id: 'news', label: 'News' },
    { id: 'entities', label: 'Entities' },
    { id: 'crossfunctions', label: 'Crossfunctions' },
    { id: 'it', label: 'IT' },
    { id: 'activity', label: 'Activity' },
    { id: 'content', label: 'Content' },
    { id: 'people', label: 'People' },
    { id: 'subspaces', label: 'Subspaces' },
    { id: 'calendar', label: 'Calendar' },
  ];

  const languageTabs = [
    { id: 'dta-news', label: 'DTA News' },
    { id: 'dta-japanese', label: 'DTA Space in Japanese' },
  ];

  const newsItems: NewsItem[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DTA News',
      date: '2024-01-15',
      title: 'Q4 2024: DTA Reaches New Milestones in Commercial Transportation',
      description: 'Quarterly performance results show strong growth across all divisions. New strategic initiatives announced for sustainable transportation solutions.',
      author: 'Strategic Communications Team',
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DTA News',
      date: '2024-01-12',
      title: 'DICV Expands Manufacturing Capabilities in Chennai',
      description: 'New state-of-the-art facility will increase production capacity by 40% and create 500 new jobs in the region.',
      author: 'DICV Communications',
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DTA News',
      date: '2024-01-10',
      title: 'CEO Vision 2025: Shaping the Future of Commercial Transportation',
      description: 'Strategic vision and roadmap focusing on electrification, autonomous driving, and sustainable logistics solutions.',
      author: 'CEO Office',
    },
  ];

  return (
    <div className="page-container">
      <div className="space-overview">
        <div className="space-banner">
          <div className="banner-logos">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mitsubishi_Fuso_Truck_and_Bus_Corporation_logo.svg/320px-Mitsubishi_Fuso_Truck_and_Bus_Corporation_logo.svg.png" alt="FUSO Logo" className="fuso-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mitsubishi_Fuso_Truck_and_Bus_Corporation_logo.svg/320px-Mitsubishi_Fuso_Truck_and_Bus_Corporation_logo.svg.png" alt="FUSO Red Logo" className="fuso-logo-red" />
          </div>
        </div>

        <div className="space-info-section">
          <div className="space-title-row">
            <h1 className="space-main-title">Daimler Truck Asia (EN)</h1>
            <button className="language-selector">
              English <span className="dropdown-arrow">▼</span>
            </button>
          </div>

          <div className="space-meta">
            <span className="space-location">
              <MapPin size={16} />
              In Location
            </span>
            <span className="space-info-link">
              <Info size={16} />
              Info
            </span>
            <span className="space-followers-count">1056 Follower</span>
          </div>

          <button className="follow-btn">+ Follow</button>
        </div>

        <nav className="tabs-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="content-area">
          <div className="language-tabs">
            {languageTabs.map((tab) => (
              <button
                key={tab.id}
                className={`language-tab ${languageTab === tab.id ? 'active' : ''}`}
                onClick={() => setLanguageTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="actions-bar">
            <button className="action-bar-btn">Actions ▼</button>
            <button className="action-bar-btn">Share</button>
          </div>

          <div className="news-content">
            {newsItems.map((item) => (
              <article key={item.id} className="news-article">
                <div className="article-image-container">
                  <img src={item.image} alt={item.title} className="article-image" />
                </div>
                <div className="article-body">
                  <div className="article-meta-info">
                    <span className="article-category">{item.category}</span>
                    <span className="article-date">{item.date}</span>
                  </div>
                  <h3 className="article-headline">
                    <Link to={`/space/${spaceId}/news/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="article-excerpt">{item.description}</p>
                  <div className="article-footer">
                    <span className="article-author">By {item.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceOverview;
