
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DataUpload } from '@/components/DataUpload';
import { Workspace } from '@/components/Workspace';
import { QueryInterface } from '@/components/QueryInterface';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const [activeDataset, setActiveDataset] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [activeView, setActiveView] = useState('upload');

  const handleDatasetUpload = (dataset) => {
    const newDataset = {
      id: Date.now(),
      name: dataset.name,
      data: dataset.data,
      type: dataset.type,
      uploadedAt: new Date()
    };
    setDatasets(prev => [...prev, newDataset]);
    setActiveDataset(newDataset);
    setActiveView('workspace');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex w-full">
        <Sidebar 
          datasets={datasets}
          activeDataset={activeDataset}
          setActiveDataset={setActiveDataset}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  InsightAI
                </h1>
                <p className="text-gray-600 text-sm">Intelligent Data Analysis Tool</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Ready to analyze</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'upload' && (
              <DataUpload onDatasetUpload={handleDatasetUpload} />
            )}
            {activeView === 'workspace' && activeDataset && (
              <Workspace dataset={activeDataset} />
            )}
            {activeView === 'query' && (
              <QueryInterface dataset={activeDataset} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
