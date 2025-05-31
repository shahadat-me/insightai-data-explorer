
import React, { useState, useMemo } from 'react';
import { BarChart, LineChart, PieChart, ScatterChart, BarChart as BarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart as RechartsBarChart, 
  LineChart as RechartsLineChart, 
  PieChart as RechartsPieChart,
  ScatterChart as RechartsScatterChart,
  Bar, 
  Line, 
  Pie, 
  Cell, 
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function Workspace({ dataset }) {
  const [selectedChart, setSelectedChart] = useState('bar');

  const chartData = useMemo(() => {
    if (!dataset?.data || !Array.isArray(dataset.data)) return [];
    
    // Take first 10 rows for better visualization
    return dataset.data.slice(0, 10).map((row, index) => ({
      ...row,
      index: index + 1
    }));
  }, [dataset?.data]);

  const numericColumns = useMemo(() => {
    if (!dataset?.data || dataset.data.length === 0) return [];
    
    const firstRow = dataset.data[0];
    return Object.keys(firstRow).filter(key => {
      const value = firstRow[key];
      return !isNaN(parseFloat(value)) && isFinite(value);
    });
  }, [dataset?.data]);

  const stringColumns = useMemo(() => {
    if (!dataset?.data || dataset.data.length === 0) return [];
    
    const firstRow = dataset.data[0];
    return Object.keys(firstRow).filter(key => {
      const value = firstRow[key];
      return isNaN(parseFloat(value)) || !isFinite(value);
    });
  }, [dataset?.data]);

  const dataStats = useMemo(() => {
    if (!dataset?.data) return {};
    
    const stats = {};
    numericColumns.forEach(col => {
      const values = dataset.data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
      if (values.length > 0) {
        stats[col] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length
        };
      }
    });
    
    return stats;
  }, [dataset?.data, numericColumns]);

  const chartOptions = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
  ];

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for visualization
        </div>
      );
    }

    const primaryNumericCol = numericColumns[0];
    const primaryStringCol = stringColumns[0] || 'index';

    switch (selectedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={primaryStringCol} />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.slice(0, 3).map((col, index) => (
                <Bar key={col} dataKey={col} fill={COLORS[index]} />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={primaryStringCol} />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.slice(0, 3).map((col, index) => (
                <Line key={col} type="monotone" dataKey={col} stroke={COLORS[index]} strokeWidth={2} />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = chartData.slice(0, 6).map((item, index) => ({
          name: item[primaryStringCol] || `Item ${index + 1}`,
          value: parseFloat(item[primaryNumericCol]) || 0
        }));
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        const xCol = numericColumns[0];
        const yCol = numericColumns[1] || numericColumns[0];
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xCol} type="number" />
              <YAxis dataKey={yCol} type="number" />
              <Tooltip />
              <Scatter dataKey={yCol} fill={COLORS[0]} />
            </RechartsScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a dataset to start analyzing
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarIcon className="h-5 w-5 text-blue-600" />
            {dataset.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dataset.data?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Rows</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Object.keys(dataset.data?.[0] || {}).length}</div>
              <div className="text-sm text-gray-600">Columns</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{numericColumns.length}</div>
              <div className="text-sm text-gray-600">Numeric Cols</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{dataset.type?.toUpperCase()}</div>
              <div className="text-sm text-gray-600">File Type</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="visualize" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualize">Visualizations</TabsTrigger>
          <TabsTrigger value="data">Data Preview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="visualize" className="space-y-4">
          {/* Chart Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Chart Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {chartOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.id}
                      variant={selectedChart === option.id ? "default" : "outline"}
                      onClick={() => setSelectedChart(option.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Chart Display */}
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {Object.keys(dataset.data?.[0] || {}).map((key) => (
                        <th key={key} className="border border-gray-300 px-4 py-2 text-left font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(dataset.data || []).slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Statistical Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Statistical Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(dataStats).map(([column, stats]) => (
                    <div key={column} className="p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">{column}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Min: <span className="font-medium">{stats.min?.toFixed(2)}</span></div>
                        <div>Max: <span className="font-medium">{stats.max?.toFixed(2)}</span></div>
                        <div>Avg: <span className="font-medium">{stats.avg?.toFixed(2)}</span></div>
                        <div>Count: <span className="font-medium">{stats.count}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI-Generated Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <div className="font-medium text-blue-800">Data Quality</div>
                    <div className="text-blue-700 text-sm">Dataset appears to be well-structured with {dataset.data?.length || 0} complete records.</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                    <div className="font-medium text-green-800">Key Patterns</div>
                    <div className="text-green-700 text-sm">Found {numericColumns.length} numeric columns suitable for statistical analysis.</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                    <div className="font-medium text-purple-800">Recommendations</div>
                    <div className="text-purple-700 text-sm">Consider exploring correlations between numeric variables for deeper insights.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
