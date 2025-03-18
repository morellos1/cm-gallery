import styles from '../page.module.css';

type TabProps = {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onHomeClick: () => void;
};

const tabs = [
  { id: 'outfit1', label: 'STYLE 1' },
  { id: 'outfit2', label: 'STYLE 2' },
  { id: 'outfit3', label: 'STYLE 3' },
  { id: 'other', label: 'OTHER STYLES' },
];

export default function GalleryTabs({ selectedTab, onTabChange, onHomeClick }: TabProps) {
  return (
    <div className={styles.tabContainer}>
      <button
        className={`${styles.tab} ${styles.homeTab}`}
        onClick={onHomeClick}
      >
        HOME
      </button>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${selectedTab === tab.id ? styles.activeTab : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 