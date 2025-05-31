
import React, { useState } from 'react';
import { Send, Brain, MessageSquare, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const suggestedQueries = [
  "Show me a bar chart of sales by region",
  "What are the top 5 products by revenue?",
  "Create a correlation matrix for all numeric columns",
  "Generate a summary report of the dataset",
  "Identify outliers in the data",
  "Build a simple classification model"
];

export function QueryInterface({ dataset }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI data analyst. Ask me anything about your dataset and I\'ll help you explore, visualize, and understand your data.',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = {
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(query, dataset);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsProcessing(false);
    }, 2000);

    setQuery('');
  };

  const generateAIResponse = (userQuery, dataset) => {
    const lowerQuery = userQuery.toLowerCase();
    
    if (lowerQuery.includes('chart') || lowerQuery.includes('visualize')) {
      return `I can help you create visualizations! Based on your dataset "${dataset?.name || 'current dataset'}", I recommend starting with a bar chart or line chart. Your dataset has ${dataset?.data?.length || 0} rows and contains both categorical and numerical data perfect for visualization.`;
    }
    
    if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      return `Here's a summary of your dataset:\n\n📊 **Dataset Overview:**\n- Name: ${dataset?.name || 'Unknown'}\n- Rows: ${dataset?.data?.length || 0}\n- Columns: ${Object.keys(dataset?.data?.[0] || {}).length}\n- Type: ${dataset?.type || 'Unknown'}\n\nThe data appears to be well-structured and ready for analysis. What specific insights would you like me to explore?`;
    }
    
    if (lowerQuery.includes('model') || lowerQuery.includes('machine learning')) {
      return `Great question about machine learning! Based on your dataset, I can suggest several approaches:\n\n🤖 **Possible Models:**\n- Classification: If you have categorical target variables\n- Regression: For predicting numerical values\n- Clustering: To find hidden patterns in your data\n\nTo get started, could you tell me what you're trying to predict or discover in your data?`;
    }
    
    if (lowerQuery.includes('outlier') || lowerQuery.includes('anomaly')) {
      return `I'll analyze your data for outliers! Looking at the numerical columns in your dataset, I can identify data points that fall significantly outside the normal range. This is crucial for data quality and can reveal interesting insights or data entry errors.`;
    }
    
    return `That's an interesting question about your dataset! While I'm processing your request, here are some insights I can provide:\n\n✨ Your dataset "${dataset?.name || 'current dataset'}" contains ${dataset?.data?.length || 0} records with rich information for analysis.\n\nI can help you with:\n- Creating custom visualizations\n- Statistical analysis\n- Pattern recognition\n- Data quality assessment\n- Predictive modeling\n\nWhat specific aspect would you like to explore further?`;
  };

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Query Interface</h2>
        <p className="text-gray-600">Ask questions about your data in natural language</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Chat with AI Analyst
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white ml-auto'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          AI is analyzing your request...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask me anything about your data..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendQuery();
                      }
                    }}
                    className="min-h-[60px] resize-none"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSendQuery}
                    disabled={!query.trim() || isProcessing}
                    className="px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with suggestions and tools */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Suggested Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto py-2 px-3 whitespace-normal"
                  onClick={() => handleSuggestedQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Data Visualization</div>
                    <div className="text-gray-600">Generate charts and graphs from your data</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Statistical Analysis</div>
                    <div className="text-gray-600">Perform correlation, regression, and trend analysis</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Machine Learning</div>
                    <div className="text-gray-600">Build predictive models and find patterns</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Data Insights</div>
                    <div className="text-gray-600">Discover hidden insights and anomalies</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Dataset Info */}
          {dataset && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Dataset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {dataset.name}</div>
                  <div><strong>Rows:</strong> {dataset.data?.length || 0}</div>
                  <div><strong>Columns:</strong> {Object.keys(dataset.data?.[0] || {}).length}</div>
                  <div><strong>Type:</strong> {dataset.type?.toUpperCase() || 'Unknown'}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
