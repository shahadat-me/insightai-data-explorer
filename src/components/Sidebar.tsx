
import React from 'react';
import { 
  Upload, 
  Database, 
  Search, 
  BarChart, 
  Settings,
  FileText,
  Brain
} from 'lucide-react';
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navigationItems = [
  { id: 'upload', label: 'Upload Data', icon: Upload, color: 'text-blue-600' },
  { id: 'workspace', label: 'Workspace', icon: BarChart, color: 'text-green-600' },
  { id: 'query', label: 'AI Query', icon: Search, color: 'text-purple-600' },
  { id: 'models', label: 'ML Models', icon: Brain, color: 'text-orange-600' },
  { id: 'reports', label: 'Reports', icon: FileText, color: 'text-indigo-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
];

export function Sidebar({ datasets, activeDataset, setActiveDataset, activeView, setActiveView }) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <UISidebar className={cn("border-r border-gray-200 bg-white/95 backdrop-blur-sm", collapsed ? "w-16" : "w-64")}>
      <div className="p-4">
        <SidebarTrigger className="mb-4" />
      </div>

      <SidebarContent className="px-4">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = activeView === item.id;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        "w-full justify-start transition-all duration-200 hover:bg-gray-100",
                        isActive && "bg-gradient-to-r from-blue-50 to-indigo-50 border-r-2 border-blue-500 text-blue-700"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : item.color)} />
                      {!collapsed && (
                        <span className={cn("ml-3 text-sm font-medium", isActive && "text-blue-700")}>
                          {item.label}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Datasets */}
        {!collapsed && datasets.length > 0 && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Datasets ({datasets.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {datasets.map((dataset) => {
                  const isActive = activeDataset?.id === dataset.id;
                  
                  return (
                    <SidebarMenuItem key={dataset.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveDataset(dataset);
                          setActiveView('workspace');
                        }}
                        className={cn(
                          "w-full justify-start transition-all duration-200 hover:bg-gray-100",
                          isActive && "bg-gradient-to-r from-green-50 to-emerald-50 border-r-2 border-green-500"
                        )}
                      >
                        <Database className={cn("h-4 w-4", isActive ? "text-green-600" : "text-gray-500")} />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", isActive ? "text-green-700" : "text-gray-700")}>
                            {dataset.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dataset.type?.toUpperCase() || 'Unknown'}
                          </p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </UISidebar>
  );
}
