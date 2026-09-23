import { useState } from 'react'
import { translations } from './data/solarData'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FeatureCards } from './components/FeatureCards'
import { RecentTimeline } from './components/RecentTimeline'
import { QuickCalculator } from './components/QuickCalculator'
import { SearchByState } from './components/SearchByState'
import { MissedSubsidyClaim } from './components/MissedSubsidyClaim'
import { PolicyComparisonModal } from './components/PolicyComparisonModal'
import { AIAssistantModal } from './components/AIAssistantModal'
import { GreenBanner } from './components/GreenBanner'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  const [currentLang, setCurrentLang] = useState('English')
  const [selectedState, setSelectedState] = useState('Maharashtra')
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false)
  const [comparisonModalTab, setComparisonModalTab] = useState('compare')
  const [aiChatOpen, setAiChatOpen] = useState(false)

  const currentT = translations[currentLang] || translations.English

  const scrollTo = (elementId) => {
    const el = document.getElementById(elementId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openModalWithTab = (tab) => {
    setComparisonModalTab(tab)
    setComparisonModalOpen(true)
  }

  return (
    <div className="app-root">
      
      {/* 1. Global Navigation Bar */}
      <Header 
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        translations={currentT}
        onNavigate={(target) => scrollTo(target)}
        onOpenGrievance={() => scrollTo('unclaimed-subsidy')}
      />

      {/* Main Content Body */}
      <main className="main-content">
        
        {/* 2. Hero Section (Dual Cards: Main Banner + Latest Updates) */}
        <Hero 
          translations={currentT}
          onCheckSubsidy={() => scrollTo('calculator')}
          onCheckRulesByDate={() => openModalWithTab('rules')}
          onViewLatestScheme={() => scrollTo('schemes')}
          onViewWhatChanged={() => openModalWithTab('compare')}
        />

        {/* 3. 5 Quick Action Feature Cards */}
        <FeatureCards 
          translations={currentT}
          onExploreTimeline={() => scrollTo('timeline')}
          onViewComparison={() => openModalWithTab('compare')}
          onCalculateNow={() => scrollTo('calculator')}
          onSearchByState={() => scrollTo('schemes')}
          onChatNow={() => setAiChatOpen(true)}
        />

        {/* 4. Interactive Dashboard Triad */}
        <section className="dashboard-triad-section" aria-label="Interactive Dashboard">
          <div className="dashboard-triad-grid">
            
            {/* 4a. Recent Policy Timeline */}
            <RecentTimeline 
              translations={currentT}
              onOpenTimelineModal={() => openModalWithTab('compare')}
            />

            {/* 4b. Quick Subsidy Calculator */}
            <QuickCalculator 
              translations={currentT}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />

            {/* 4c. Search by State & India Map Visualizer */}
            <SearchByState 
              translations={currentT}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              onViewStateDetails={() => openModalWithTab('rules')}
            />

          </div>
        </section>

        {/* 5. [NEW FEATURE] Missed / Delayed Subsidy Recovery & Grievance Portal */}
        <MissedSubsidyClaim 
          translations={currentT}
          defaultState={selectedState}
        />

      </main>

      {/* 6. Supporting a Greener Tomorrow Strip & Floating AI Button */}
      <GreenBanner 
        translations={currentT}
        onOpenAIChat={() => setAiChatOpen(true)}
      />

      {/* 7. Footer */}
      <Footer 
        translations={currentT}
        onNavigate={(target) => scrollTo(target)}
        onOpenGrievance={() => scrollTo('unclaimed-subsidy')}
      />

      {/* Popups & Modals */}
      <PolicyComparisonModal 
        isOpen={comparisonModalOpen}
        initialTab={comparisonModalTab}
        defaultState={selectedState}
        onClose={() => setComparisonModalOpen(false)}
      />

      <AIAssistantModal 
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />

    </div>
  )
}

export default App