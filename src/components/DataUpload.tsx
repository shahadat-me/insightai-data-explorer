import React, { useState, useCallback } from 'react';
import { Upload, FileText, Database, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export function DataUpload({ onDatasetUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { toast } = useToast();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = async (files) => {
    const file = files[0];
    const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/html'];
    
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]) || file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.html'))) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, Excel, JSON, or HTML file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Failed to read file as text');
        }
        
        const content = result;
        let data = [];
        let type = 'unknown';

        // Simple parsing - in a real app, you'd use proper libraries
        if (file.name.endsWith('.csv')) {
          type = 'csv';
          const lines = content.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            const headers = lines[0].split(',').map(h => h.trim());
            data = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const row = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              return row;
            });
          }
        } else if (file.name.endsWith('.json')) {
          type = 'json';
          try {
            const parsed = JSON.parse(content);
            data = Array.isArray(parsed) ? parsed : [parsed];
          } catch (err) {
            throw new Error('Invalid JSON format');
          }
        }

        onDatasetUpload({
          name: file.name,
          data: data,
          type: type,
          size: file.size
        });

        toast({
          title: "Dataset uploaded successfully!",
          description: `${file.name} has been processed and is ready for analysis.`
        });
      };

      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to process the file.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlScraping = async () => {
    if (!urlInput.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL to scrape data from.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate web scraping - in a real app, this would call a backend service
    setTimeout(() => {
      const mockData = [
        { Product: 'Widget A', Sales: 1500, Region: 'North' },
        { Product: 'Widget B', Sales: 2300, Region: 'South' },
        { Product: 'Widget C', Sales: 1800, Region: 'East' },
        { Product: 'Widget D', Sales: 2100, Region: 'West' }
      ];

      onDatasetUpload({
        name: `Scraped Data - ${new URL(urlInput).hostname}`,
        data: mockData,
        type: 'scraped',
        url: urlInput
      });

      toast({
        title: "Data scraped successfully!",
        description: "Web data has been extracted and is ready for analysis."
      });

      setUrlInput('');
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Data</h2>
        <p className="text-lg text-gray-600">
          Start your analysis by uploading datasets or scraping web data
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="scrape" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Web Scraping
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-8">
              <div
                className={`relative rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'bg-blue-50 border-2 border-blue-400 border-dashed' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple={false}
                  accept=".csv,.json,.xlsx,.xls,.html"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {uploading ? 'Processing...' : 'Drop your files here'}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    Or click to browse and select files
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
                    <span className="bg-white px-2 py-1 rounded border">CSV</span>
                    <span className="bg-white px-2 py-1 rounded border">Excel</span>
                    <span className="bg-white px-2 py-1 rounded border">JSON</span>
                    <span className="bg-white px-2 py-1 rounded border">HTML</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrape">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Data Extraction</h3>
                  <p className="text-gray-600">Enter a URL to automatically extract and analyze table data</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/data-page"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <Button 
                  onClick={handleUrlScraping}
                  disabled={uploading || !urlInput.trim()}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Extracting Data...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Extract Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <div className="text-blue-600 font-semibold text-lg">Smart Processing</div>
          <div className="text-gray-600 text-sm">Automatic data cleaning and preprocessing</div>
        </div>
        <div className="p-4">
          <div className="text-green-600 font-semibold text-lg">AI-Powered Insights</div>
          <div className="text-gray-600 text-sm">Natural language queries and analysis</div>
        </div>
        <div className="p-4">
          <div className="text-purple-600 font-semibold text-lg">Multiple Formats</div>
          <div className="text-gray-600 text-sm">Support for CSV, Excel, JSON, and web data</div>
        </div>
      </div>
    </div>
  );
}
