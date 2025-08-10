import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  Target,
  Users,
  Clock,
  TrendingUp,
  FileText,
  Download,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RootCause {
  id: string;
  description: string;
  confidence: string;
  evidenceIndicators: string[];
}

interface TimelineEvent {
  time: string;
  event: string;
  type: 'trigger' | 'failure' | 'cascade' | 'outcome';
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  responsibleTeam: string;
  suggestedDeadline: string;
  category: string;
  status?: string;
}

interface RCAResult {
  id: string;
  incidentId: string;
  primaryRootCauses: RootCause[];
  causalChain: {
    timeline: TimelineEvent[];
    pathway: string;
  };
  recommendedActions: ActionItem[];
  supportingDocuments: Array<{
    name: string;
    type: string;
  }>;
  riskInsights: {
    similarIncidents: Array<{
      date: string;
      description: string;
      correlation: number;
    }>;
    trends: string[];
  };
  confidenceRating: number;
  actionItems: ActionItem[];
}

interface Incident {
  id: string;
  title: string;
  description: string;
  incidentDate: string;
  location: string;
  status: string;
}

export default function RCAResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incident, isLoading: incidentLoading } = useQuery<Incident>({
    queryKey: ['/api/incidents', id],
    enabled: !!id,
  });

  const { data: rcaResult, isLoading: rcaLoading } = useQuery<RCAResult>({
    queryKey: ['/api/incidents', id, 'rca'],
    enabled: !!id,
  });

  const updateActionItemMutation = useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: string }) => {
      return apiRequest(`/api/action-items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents', id, 'rca'] });
      toast({
        title: 'Action Item Updated',
        description: 'Status has been updated successfully.',
      });
    },
  });

  const handleActionItemStatusChange = (itemId: string, status: string) => {
    updateActionItemMutation.mutate({ itemId, status });
  };

  const getTimelineEventColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-yellow-500';
      case 'failure': return 'bg-red-500';
      case 'cascade': return 'bg-orange-500';
      case 'outcome': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (incidentLoading || rcaLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-48 bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!incident || !rcaResult) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">RCA Results Not Found</h1>
          <p className="text-gray-400 mb-6">
            The incident may not have completed analysis yet or the results are not available.
          </p>
          <Button onClick={() => setLocation('/dashboard')} className="bg-purple-600 hover:bg-purple-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completedActions = rcaResult.actionItems?.filter(item => item.status === 'completed').length || 0;
  const totalActions = rcaResult.actionItems?.length || 0;
  const actionProgress = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Incident Summary */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white text-xl mb-2">{incident.title}</CardTitle>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(incident.incidentDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {incident.location || 'No location specified'}
                  </span>
                  <Badge className={`${incident.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {incident.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">{rcaResult.confidenceRating}%</div>
                <div className="text-gray-400 text-sm">AI Confidence</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{incident.description}</p>
          </CardContent>
        </Card>

        {/* Action Progress Overview */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Action Items Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300">
                {completedActions} of {totalActions} actions completed
              </span>
              <span className="text-white font-semibold">{Math.round(actionProgress)}%</span>
            </div>
            <Progress value={actionProgress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="root-causes" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="root-causes" className="data-[state=active]:bg-gray-700">
              Root Causes
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-700">
              Causal Chain
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-gray-700">
              Action Items
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gray-700">
              Risk Insights
            </TabsTrigger>
          </TabsList>

          {/* Root Causes Tab */}
          <TabsContent value="root-causes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rcaResult.primaryRootCauses.map((cause, index) => (
                <Card key={cause.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Root Cause #{index + 1}
                      <Badge className={`ml-auto ${
                        cause.confidence === 'High' ? 'bg-red-600' :
                        cause.confidence === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {cause.confidence} Confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{cause.description}</p>
                    <div>
                      <h4 className="text-white font-medium mb-2">Supporting Evidence:</h4>
                      <ul className="space-y-1">
                        {cause.evidenceIndicators.map((evidence, idx) => (
                          <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📊 Causal Chain Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Pathway Summary:</h3>
                  <p className="text-gray-300 bg-gray-700 p-3 rounded">
                    {rcaResult.causalChain.pathway}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Detailed Timeline:</h3>
                  {rcaResult.causalChain.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${getTimelineEventColor(event.type)}`}></div>
                        {index < rcaResult.causalChain.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-600 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{event.time}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-gray-300">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions">
            <div className="space-y-4">
              {rcaResult.actionItems.map((action) => (
                <Card key={action.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-medium">{action.title}</h3>
                          <Badge className={getPriorityColor(action.priority)}>
                            {action.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-3">{action.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {action.responsibleTeam}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {action.suggestedDeadline}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Select
                          value={action.status || 'pending'}
                          onValueChange={(value) => handleActionItemStatusChange(action.id, value)}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Risk Insights Tab */}
          <TabsContent value="insights">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Similar Incidents */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Similar Historical Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rcaResult.riskInsights.similarIncidents.length > 0 ? (
                    <div className="space-y-3">
                      {rcaResult.riskInsights.similarIncidents.map((incident, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{incident.date}</span>
                            <Badge className="bg-blue-600">
                              {Math.round(incident.correlation * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm">{incident.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No similar incidents found in historical data.</p>
                  )}
                </CardContent>
              </Card>

              {/* Trends & Recommendations */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    Risk Trends & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rcaResult.riskInsights.trends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <p className="text-gray-300 text-sm">{trend}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Supporting Documents */}
              <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Supporting Documents Analyzed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rcaResult.supportingDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{doc.name}</p>
                          <p className="text-gray-400 text-xs capitalize">{doc.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}