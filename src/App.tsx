import React, { useEffect, useState } from 'react';
import { AccessibilitySettings, ActivityCategory, AgentStep, SubscriptionTier, TripPlan, UserPreferences, UserSubscription } from './types';
import { generateAIAgentPlan, replanAIAgentPlan } from './services/agentService';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PlannerForm } from './components/PlannerForm';
import { PlanDetailView } from './components/PlanDetailView';
import { ExploreView } from './components/ExploreView';
import { SavedPlansView } from './components/SavedPlansView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AgentTelemetryDrawer } from './components/AgentTelemetryDrawer';
import { DisqusThread } from './components/DisqusThread';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'my-plans' | 'explore' | 'admin'>('home');

  // Accessibility Settings State
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    textSize: 'normal',
    contrast: 'standard',
    motion: 'normal',
    displayMode: 'light',
    seniorEasyMode: false,
  });

  // SaaS Subscription State
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'free',
    monthlyPlanLimit: 5,
    plansUsedThisMonth: 2,
    renewalDate: '2026-09-01',
    autonomousMonitoringEnabled: true,
  });

  // Plan State
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [savedPlans, setSavedPlans] = useState<TripPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isReplanning, setIsReplanning] = useState<boolean>(false);

  // Modals & Drawers
  const [showAccessibilityModal, setShowAccessibilityModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(false);
  const [professorDemoMode, setProfessorDemoMode] = useState<boolean>(true);

  // Initial Form Prefs Override
  const [plannerInitialPrefs, setPlannerInitialPrefs] = useState<Partial<UserPreferences>>({});

  // Apply Display Theme & Text Size to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (accessibilitySettings.displayMode === 'dark' || accessibilitySettings.displayMode === 'high-contrast-dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const body = document.body;
    body.classList.remove('text-size-large', 'text-size-extra-large');
    if (accessibilitySettings.textSize === 'large') body.classList.add('text-size-large');
    if (accessibilitySettings.textSize === 'extra-large') body.classList.add('text-size-extra-large');

    if (accessibilitySettings.contrast === 'high-contrast') {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
  }, [accessibilitySettings]);

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleGenerate = async (prefs: UserPreferences, customPrompt?: string) => {
    setIsGenerating(true);
    try {
      const result = await generateAIAgentPlan(
        { ...prefs, seniorGentleMode: accessibilitySettings.seniorEasyMode || prefs.seniorGentleMode },
        customPrompt
      );
      setCurrentPlan(result.plan);
      setAgentSteps(result.steps);

      // Increment subscription counter
      setSubscription((prev) => ({
        ...prev,
        plansUsedThisMonth: prev.plansUsedThisMonth + 1,
      }));

      // Switch to plan tab
      setActiveTab('plan');
      if (professorDemoMode) {
        setShowTelemetryDrawer(true);
      }
    } catch (err: any) {
      alert(`AI Agent Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReplan = async (triggerReason: 'weather_rain' | 'transport_delay' | 'user_request', customInstruction?: string) => {
    if (!currentPlan) return;
    setIsReplanning(true);
    try {
      const result = await replanAIAgentPlan(currentPlan, triggerReason, customInstruction);
      setCurrentPlan(result.plan);
      setAgentSteps((prev) => [...prev, ...result.steps]);
      if (professorDemoMode) {
        setShowTelemetryDrawer(true);
      }
    } catch (err: any) {
      alert(`Re-plan Error: ${err.message}`);
    } finally {
      setIsReplanning(false);
    }
  };

  const handleStartPlannerWithCategory = (category: ActivityCategory) => {
    setPlannerInitialPrefs({
      categories: [category],
      location: 'Bugis & Kampong Glam',
      timeAvailable: '3h',
      budgetTier: 'under_50',
    });
    setActiveTab('plan');
  };

  const handleSavePlan = (planToSave: TripPlan) => {
    if (!savedPlans.some((p) => p.id === planToSave.id)) {
      setSavedPlans([planToSave, ...savedPlans]);
    }
  };

  const handleDeletePlan = (planId: string) => {
    setSavedPlans(savedPlans.filter((p) => p.id !== planId));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accessibilitySettings={accessibilitySettings}
        onOpenAccessibility={() => setShowAccessibilityModal(true)}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
        subscriptionTier={subscription.tier}
        professorDemoMode={professorDemoMode}
        onToggleProfessorDemo={() => {
          setProfessorDemoMode(!professorDemoMode);
          setShowTelemetryDrawer(!professorDemoMode);
        }}
        onToggleSeniorGentleMode={() => {
          updateAccessibility({ seniorEasyMode: !accessibilitySettings.seniorEasyMode });
        }}
      />

      {/* Main Content View Switcher */}
      <main className="pt-4 pb-16">
        {activeTab === 'home' && (
          <HomeView
            onStartPlannerWithCategory={handleStartPlannerWithCategory}
            onOpenPlanner={() => setActiveTab('plan')}
            seniorGentleMode={accessibilitySettings.seniorEasyMode}
          />
        )}

        {activeTab === 'plan' && (
          <div>
            {currentPlan ? (
              <PlanDetailView
                plan={currentPlan}
                onTweakPlan={(instruction) => handleReplan('user_request', instruction)}
                onTriggerReplan={(reason) => handleReplan(reason)}
                onSavePlan={handleSavePlan}
                isReplanning={isReplanning}
                onOpenTelemetry={() => setShowTelemetryDrawer(true)}
              />
            ) : (
              <PlannerForm
                initialPreferences={plannerInitialPrefs}
                onSubmit={handleGenerate}
                isLoading={isGenerating}
                seniorGentleMode={accessibilitySettings.seniorEasyMode}
              />
            )}
          </div>
        )}

        {activeTab === 'my-plans' && (
          <SavedPlansView
            savedPlans={savedPlans}
            onSelectPlan={(plan) => {
              setCurrentPlan(plan);
              setActiveTab('plan');
            }}
            onDeletePlan={handleDeletePlan}
            onOpenPlanner={() => {
              setCurrentPlan(null);
              setActiveTab('plan');
            }}
          />
        )}

        {activeTab === 'explore' && <ExploreView />}

        {activeTab === 'admin' && <AdminDashboardView />}

        {/* Disqus Discussion Forum Embedded at Bottom */}
        <DisqusThread />
      </main>

      {/* Accessibility Settings Modal */}
      {showAccessibilityModal && (
        <AccessibilityPanel
          settings={accessibilitySettings}
          onUpdate={updateAccessibility}
          onClose={() => setShowAccessibilityModal(false)}
        />
      )}

      {/* Subscription SaaS Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          subscription={subscription}
          onSelectTier={(tier) => {
            setSubscription((prev) => ({ ...prev, tier }));
            setShowSubscriptionModal(false);
          }}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {/* Professor Demo Telemetry Drawer */}
      <AgentTelemetryDrawer
        steps={agentSteps}
        isOpen={showTelemetryDrawer}
        onClose={() => setShowTelemetryDrawer(false)}
      />
    </div>
  );
}
