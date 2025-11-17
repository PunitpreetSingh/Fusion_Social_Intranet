import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Users, UserCheck, MessageSquare } from "lucide-react";
import "./SpaceOverview.css";

interface QuickAccessItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
}

interface NewsItem {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
}

export const SpaceOverview: React.FC = () => {
  const { spaceId } = useParams();

  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: <Users size={24} />,
      title: "HR Connect",
      description: "Access HR policies, benefits, and employee services",
      linkText: "Open →",
    },
    {
      icon: <UserCheck size={24} />,
      title: "People Connect",
      description: "Find and connect with colleagues across departments",
      linkText: "View →",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Communities",
      description: "Join department groups and discussion forums",
      linkText: "Join →",
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: "1",
      image:
        "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "DTA News",
      date: "2024-01-15",
      title: "DTA News: Q4 Performance Update",
      description:
        "Quarterly performance results and strategic initiatives for the upcoming year.",
    },
    {
      id: "2",
      image:
        "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "DICV News",
      date: "2024-01-12",
      title: "DICV News: New Manufacturing Facility",
      description:
        "Expansion of manufacturing capabilities with new state-of-the-art facility.",
    },
    {
      id: "3",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "CEO Communications",
      date: "2024-01-10",
      title: "CEO Communications: Vision 2025",
      description:
        "Strategic vision and roadmap for FUSO's future growth and innovation.",
    },
  ];

  return (
    <div className="page-container">
      <div className="space-overview">
        {/* Header */}
        <div className="space-header">
          <div className="space-header-content">
            <div className="space-info">
              <h1 className="space-title">FUSO Social Intranet</h1>
              <p className="space-followers">12,450 followers</p>
            </div>
            <button className="follow-button">+ Follow</button>
          </div>
        </div>

        {/* Quick Access Section */}
        <section className="quick-access-section">
          <h2 className="section-title">Quick Access</h2>
          <div className="quick-access-grid">
            {quickAccessItems.map((item, index) => (
              <div key={index} className="quick-access-card">
                <div className="card-content">
                  <div className="card-icon">{item.icon}</div>
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                  </div>
                </div>
                <a href="#" className="card-link">
                  {item.linkText}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="latest-news-section">
          <div className="section-header">
            <h2 className="section-title">Latest News</h2>
            <button className="view-all-button">View All</button>
          </div>
          <div className="news-grid">
            {newsItems.map((item) => (
              <article key={item.id} className="news-card">
                <div className="news-image-wrapper">
                  <img src={item.image} alt={item.title} className="news-image" />
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-category">{item.category}</span>
                    <span className="news-date">{item.date}</span>
                  </div>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-description">{item.description}</p>
                  <div className="news-actions">
                    <div className="action-buttons">
                      <button className="action-button">Like</button>
                      <button className="action-button">Share</button>
                      <button className="action-button">Save</button>
                    </div>
                    <a href={`/space/${spaceId}/news/${item.id}`} className="view-link">
                      View
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="space-footer">
          <p>© 2025 FUSO. Part of Daimler Truck. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default SpaceOverview;
