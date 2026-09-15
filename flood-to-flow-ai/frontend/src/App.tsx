import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar, NavSection } from './components/Layout/Sidebar';
import { MetricsGrid } from './components/Dashboard/MetricsGrid';
import { HardwareBanner } from './components/Dashboard/HardwareBanner';
import { RecentIncidents } from './components/Dashboard/RecentIncidents';
import { IncidentMap } from './components/Map/IncidentMap';
import { IncidentQueueView } from './components/Queue/IncidentQueueView';
import { IncidentDetailView } from './components/IncidentDetail/IncidentDetailView';
import { CreateIncidentModal } from './components/IncidentCreation/CreateIncidentModal';
import { HardwareAccelerationView } from './components/Hardware/HardwareAccelerationView';
import { AIAnalysisView } from './components/Analysis/AIAnalysisView';
import { ReportsView } from './components/Reports/ReportsView';
import { DemoWalkthroughModal } from './components/Demo/DemoWalkthroughModal';

import { Incident, DashboardStats, HardwareStatus } from './types/incident';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hardware, setHardware] = useState<HardwareStatus | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false); // Offline-first default!

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [statsData, incidentsData, hwData] = await Promise.all([
        api.getDashboardStats(),
        api.getIncidents(),
        api.getHardwareStatus(),
      ]);
      setStats(statsData);
      setIncidents(incidentsData);
      setHardware(hwData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadPdf = (incidentId: string) => {
    const url = api.getPdfUrl(incidentId);
    window.open(url, '_blank');
  };

  const handleUpdateStatus = async (incidentId: string, status: any) => {
    try {
      const updated = await api.updateIncident(incidentId, { status });
      setIncidents((prev) => prev.map((i) => (i.id === incidentId ? updated : i)));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updated);
      }
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteIncident = async (incidentId: string) => {
    try {
      await api.deleteIncident(incidentId);
      setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(null);
      }
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleIncidentCreated = (newIncident: Incident) => {
    setShowCreateModal(false);
    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        hardware={hardware}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        onOpenCreate={() => setShowCreateModal(true)}
        onTriggerDemo={() => setShowDemoModal(true)}
      />

      {/* Main Body with Sidebar + View Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => {
            if (sec === 'create') {
              setShowCreateModal(true);
            } else {
              setCurrentSection(sec);
            }
          }}
          incidentCount={incidents.length}
          highPriorityCount={stats?.high_priority_count || 0}
        />

        {/* View Canvas */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Initializing Flood-to-Flow AI Disaster Intelligence Core...
            </div>
          ) : (
            <>
              {/* SECTION: OVERVIEW */}
              {currentSection === 'overview' && (
                <div className="space-y-6">
                  {/* Priority Metrics Cards */}
                  <MetricsGrid
                    stats={stats}
                    onFilterPriority={(p) => {
                      setCurrentSection('queue');
                    }}
                  />

                  {/* Snapdragon Hardware Status Card */}
                  <HardwareBanner
                    hardware={hardware}
                    onOpenHardwareView={() => setCurrentSection('hardware')}
                  />

                  {/* Active Incident Queue Preview */}
                  <RecentIncidents
                    incidents={incidents}
                    onSelectIncident={(inc) => setSelectedIncident(inc)}
                    onDownloadPdf={handleDownloadPdf}
                    onViewAllQueue={() => setCurrentSection('queue')}
                  />
                </div>
              )}

              {/* SECTION: INCIDENT MAP */}
              {currentSection === 'map' && (
                <IncidentMap
                  incidents={incidents}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  onDownloadPdf={handleDownloadPdf}
                />
              )}

              {/* SECTION: QUEUE */}
              {currentSection === 'queue' && (
                <IncidentQueueView
                  incidents={incidents}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  onDownloadPdf={handleDownloadPdf}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteIncident={handleDeleteIncident}
                />
              )}

              {/* SECTION: AI ANALYSIS */}
              {currentSection === 'analysis' && (
                <AIAnalysisView
                  hardware={hardware}
                  incidents={incidents}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                />
              )}

              {/* SECTION: REPORTS */}
              {currentSection === 'reports' && (
                <ReportsView
                  incidents={incidents}
                  onDownloadPdf={handleDownloadPdf}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                />
              )}

              {/* SECTION: HARDWARE */}
              {currentSection === 'hardware' && (
                <HardwareAccelerationView
                  hardware={hardware}
                  onRefreshHardware={loadData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Incident Detail Drawer / Modal */}
      {selectedIncident && (
        <IncidentDetailView
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onDownloadPdf={handleDownloadPdf}
        />
      )}

      {/* Create Incident Modal */}
      {showCreateModal && (
        <CreateIncidentModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleIncidentCreated}
          onCreateApi={api.createIncident}
        />
      )}

      {/* 90-Second Demo Walkthrough Modal */}
      {showDemoModal && (
        <DemoWalkthroughModal
          onClose={() => setShowDemoModal(false)}
          onViewIncident={(inc) => {
            setShowDemoModal(false);
            setSelectedIncident(inc);
          }}
          onDownloadPdf={handleDownloadPdf}
        />
      )}
    </div>
  );
};

export default App;
