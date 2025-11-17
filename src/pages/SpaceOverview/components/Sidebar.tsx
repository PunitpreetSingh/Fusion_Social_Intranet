import React, { useState } from 'react';
import {
  Newspaper,
  Users,
  UserCheck,
  Link as LinkIcon,
  Flame,
  ChevronDown,
  ChevronRight,
  Bell,
  Bookmark,
  Share2,
  Menu,
  X,
  Home,
  Briefcase,
  Calendar,
  MessageSquare,
  FileText,
  Building,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarLink {
  id: string;
  title: string;
  url: string;
  icon?: React.ReactNode;
}

interface TrendingItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  category: string;
  url: string;
}

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  links: SidebarLink[];
  hasActions?: boolean;
}

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['news', 'trending']);
  const [followedSections, setFollowedSections] = useState<string[]>([]);
  const [savedSections, setSavedSections] = useState<string[]>([]);

  const sections: SidebarSection[] = [
    {
      id: 'news',
      title: 'News',
      icon: <Newspaper size={20} />,
      hasActions: true,
      links: [
        { id: 'all-news', title: 'All News', url: '/space/1/news', icon: <Home size={16} /> },
        { id: 'dta', title: 'DTA News', url: '/space/1/news?category=dta', icon: <Building size={16} /> },
        { id: 'dicv', title: 'DICV News', url: '/space/1/news?category=dicv', icon: <Building size={16} /> },
        { id: 'mftbc', title: 'MFTBC News', url: '/space/1/news?category=mftbc', icon: <Building size={16} /> },
        { id: 'ceo', title: 'CEO Messages', url: '/space/1/news?category=ceo', icon: <Briefcase size={16} /> },
        { id: 'events', title: 'Events', url: '/space/1/news?category=events', icon: <Calendar size={16} /> },
      ],
    },
    {
      id: 'hr',
      title: 'HR',
      icon: <Users size={20} />,
      hasActions: true,
      links: [
        { id: 'hr-home', title: 'HR Home', url: '/hr', icon: <Home size={16} /> },
        { id: 'benefits', title: 'Benefits & Policies', url: '/hr/benefits', icon: <FileText size={16} /> },
        { id: 'wellness', title: 'Employee Wellness', url: '/hr/wellness', icon: <Users size={16} /> },
        { id: 'training', title: 'Training Programs', url: '/hr/training', icon: <Briefcase size={16} /> },
        { id: 'announcements', title: 'HR Announcements', url: '/hr/announcements', icon: <Newspaper size={16} /> },
      ],
    },
    {
      id: 'people',
      title: 'People',
      icon: <UserCheck size={20} />,
      hasActions: true,
      links: [
        { id: 'directory', title: 'Employee Directory', url: '/people', icon: <Users size={16} /> },
        { id: 'teams', title: 'Teams & Departments', url: '/people/teams', icon: <Building size={16} /> },
        { id: 'new-hires', title: 'New Hires', url: '/people/new-hires', icon: <UserCheck size={16} /> },
        { id: 'birthdays', title: 'Birthdays', url: '/people/birthdays', icon: <Calendar size={16} /> },
      ],
    },
    {
      id: 'quick-links',
      title: 'Quick Links',
      icon: <LinkIcon size={20} />,
      hasActions: false,
      links: [
        { id: 'guidelines', title: 'Communication Guidelines', url: '/resources/guidelines', icon: <FileText size={16} /> },
        { id: 'brochure', title: 'Corporate Brochure', url: '/resources/brochure', icon: <FileText size={16} /> },
        { id: 'profile', title: 'Profile Presentation', url: '/resources/profile', icon: <Briefcase size={16} /> },
        { id: 'strategy', title: 'DTA Strategy', url: '/resources/strategy', icon: <FileText size={16} /> },
        { id: 'support', title: 'IT Support', url: '/support', icon: <MessageSquare size={16} /> },
      ],
    },
  ];

  const trendingItems: TrendingItem[] = [
    {
      id: '1',
      title: 'DTA News: Q4 Performance Update',
      views: 1245,
      likes: 89,
      category: 'DTA News',
      url: '/space/1/news/1',
    },
    {
      id: '2',
      title: 'DICV News: New Manufacturing Facility',
      views: 987,
      likes: 67,
      category: 'DICV News',
      url: '/space/1/news/2',
    },
    {
      id: '3',
      title: 'CEO Communications: Vision 2025',
      views: 856,
      likes: 102,
      category: 'CEO Communications',
      url: '/space/1/news/3',
    },
    {
      id: '4',
      title: 'HR: New Employee Wellness Program',
      views: 734,
      likes: 73,
      category: 'HR Announcements',
      url: '/space/1/news/5',
    },
    {
      id: '5',
      title: 'Innovation Lab Opens in Tokyo',
      views: 612,
      likes: 41,
      category: 'MFTBC News',
      url: '/space/1/news/6',
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleFollow = (sectionId: string) => {
    setFollowedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleSave = (sectionId: string) => {
    setSavedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleShare = (sectionId: string, sectionTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${sectionTitle} - FUSO Social Intranet`,
        url: window.location.href,
      });
    } else {
      console.log(`Share ${sectionTitle}`);
    }
  };

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Navigation</h2>
          <button className="sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {sections.map((section) => (
            <div key={section.id} className="sidebar-section">
              <div className="section-header">
                <button
                  className="section-toggle"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={expandedSections.includes(section.id)}
                >
                  <span className="section-icon">{section.icon}</span>
                  <span className="section-title">{section.title}</span>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown size={18} className="chevron-icon" />
                  ) : (
                    <ChevronRight size={18} className="chevron-icon" />
                  )}
                </button>

                {section.hasActions && (
                  <div className="section-actions">
                    <button
                      className={`action-btn ${followedSections.includes(section.id) ? 'active' : ''}`}
                      onClick={() => toggleFollow(section.id)}
                      title="Follow"
                      aria-label={`Follow ${section.title}`}
                    >
                      <Bell size={16} fill={followedSections.includes(section.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      className={`action-btn ${savedSections.includes(section.id) ? 'active' : ''}`}
                      onClick={() => toggleSave(section.id)}
                      title="Save"
                      aria-label={`Save ${section.title}`}
                    >
                      <Bookmark size={16} fill={savedSections.includes(section.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleShare(section.id, section.title)}
                      title="Share"
                      aria-label={`Share ${section.title}`}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {expandedSections.includes(section.id) && (
                <ul className="section-links">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <a href={link.url} className="section-link">
                        {link.icon && <span className="link-icon">{link.icon}</span>}
                        <span className="link-text">{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="sidebar-section trending-section">
            <div className="section-header">
              <button
                className="section-toggle"
                onClick={() => toggleSection('trending')}
                aria-expanded={expandedSections.includes('trending')}
              >
                <span className="section-icon trending-icon">
                  <Flame size={20} />
                </span>
                <span className="section-title">Trending</span>
                {expandedSections.includes('trending') ? (
                  <ChevronDown size={18} className="chevron-icon" />
                ) : (
                  <ChevronRight size={18} className="chevron-icon" />
                )}
              </button>
            </div>

            {expandedSections.includes('trending') && (
              <ul className="trending-list">
                {trendingItems.map((item, index) => (
                  <li key={item.id} className="trending-item">
                    <a href={item.url} className="trending-link">
                      <span className="trending-rank">{index + 1}</span>
                      <div className="trending-content">
                        <h4 className="trending-title">{item.title}</h4>
                        <div className="trending-meta">
                          <span className="trending-category">{item.category}</span>
                          <span className="trending-stats">
                            {item.likes} likes · {item.views} views
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};
