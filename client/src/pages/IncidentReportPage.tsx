import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, Upload, Users, Cloud, Settings, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '../lib/queryClient';

const incidentReportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  incidentDate: z.string().min(1, 'Incident date is required'),
  location: z.string().optional(),
  affectedAssets: z.array(z.string()).optional(),
  systemData: z.object({
    operatingMode: z.string().optional(),
    recentAnomalies: z.boolean().optional(),
    anomalyDetails: z.string().optional(),
  }).optional(),
  maintenanceHistory: z.object({
    overdueForMaintenance: z.boolean().optional(),
    lastMaintenanceDate: z.string().optional(),
    lastMaintenanceActions: z.string().optional(),
    knownIssues: z.string().optional(),
  }).optional(),
  operatorFactors: z.object({
    operatorsInvolved: z.array(z.string()).optional(),
    shiftTime: z.string().optional(),
    trainingStatus: z.string().optional(),
    humanFactorNotes: z.string().optional(),
  }).optional(),
  environmentalFactors: z.object({
    weatherConditions: z.string().optional(),
    externalDisturbances: z.string().optional(),
    environmentalNotes: z.string().optional(),
  }).optional(),
  processContext: z.object({
    recentProcessChanges: z.boolean().optional(),
    processChangeDetails: z.string().optional(),
    systemDependencies: z.string().optional(),
  }).optional(),
  riskCompliance: z.object({
    isSafetyCritical: z.boolean().optional(),
    isEnvironmentCritical: z.boolean().optional(),
    isComplianceTracked: z.boolean().optional(),
    regulatoryNotes: z.string().optional(),
  }).optional(),
});

type IncidentReportForm = z.infer<typeof incidentReportSchema>;

export default function IncidentReportPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<IncidentReportForm>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      title: '',
      description: '',
      incidentDate: '',
      location: '',
      affectedAssets: [],
      systemData: {
        operatingMode: '',
        recentAnomalies: false,
        anomalyDetails: '',
      },
      maintenanceHistory: {
        overdueForMaintenance: false,
        lastMaintenanceDate: '',
        lastMaintenanceActions: '',
        knownIssues: '',
      },
      operatorFactors: {
        operatorsInvolved: [],
        shiftTime: '',
        trainingStatus: '',
        humanFactorNotes: '',
      },
      environmentalFactors: {
        weatherConditions: '',
        externalDisturbances: '',
        environmentalNotes: '',
      },
      processContext: {
        recentProcessChanges: false,
        processChangeDetails: '',
        systemDependencies: '',
      },
      riskCompliance: {
        isSafetyCritical: false,
        isEnvironmentCritical: false,
        isComplianceTracked: false,
        regulatoryNotes: '',
      },
    },
  });

  const onSubmit = async (data: IncidentReportForm) => {
    setIsSubmitting(true);
    try {
      // Convert the form data to match the API schema
      const incidentData = {
        ...data,
        incidentDate: new Date(data.incidentDate).toISOString(),
        affectedAssets: data.affectedAssets || [],
        attachments: attachments.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          // In a real app, you'd upload the files and store URLs
          url: `placeholder-url-for-${file.name}`,
        })),
      };

      const response = await apiRequest('/api/incidents', {
        method: 'POST',
        body: JSON.stringify(incidentData),
      });

      toast({
        title: 'Incident Reported',
        description: 'Your incident has been successfully submitted for analysis.',
      });

      setLocation(`/incidents/${response.id}`);
    } catch (error) {
      console.error('Error submitting incident:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit incident report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🆘 Incident Report</h1>
          <p className="text-gray-300">
            Provide comprehensive information about the incident for AI-powered root cause analysis
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Incident Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Incident Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Incident Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Brief description of the incident"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="incidentDate" className="text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date & Time
                  </Label>
                  <Input
                    id="incidentDate"
                    type="datetime-local"
                    {...form.register('incidentDate')}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {form.formState.errors.incidentDate && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.incidentDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Detailed Description
                </Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  className="bg-gray-700 border-gray-600 text-white min-h-24"
                  placeholder="Describe what happened, when, where, and who was involved or affected..."
                />
                {form.formState.errors.description && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location/Equipment ID
                  </Label>
                  <Input
                    id="location"
                    {...form.register('location')}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Location or equipment identifier"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </Label>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="bg-gray-700 border-gray-600 text-white"
                    accept=".pdf,.jpg,.jpeg,.png,.csv,.json,.doc,.docx"
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="text-sm text-gray-400">
                          📎 {file.name} ({Math.round(file.size / 1024)}KB)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System & Operational Data */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                📈 System & Operational Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">System Operating Mode</Label>
                <Select onValueChange={(value) => form.setValue('systemData.operatingMode', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select operating mode at time of incident" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Operation</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="shutdown">Shutdown</SelectItem>
                    <SelectItem value="maintenance">Maintenance Mode</SelectItem>
                    <SelectItem value="emergency">Emergency Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recentAnomalies"
                  onCheckedChange={(checked) => form.setValue('systemData.recentAnomalies', !!checked)}
                />
                <Label htmlFor="recentAnomalies" className="text-gray-300">
                  Recent parameter anomalies detected?
                </Label>
              </div>

              <div>
                <Label htmlFor="anomalyDetails" className="text-gray-300">
                  Anomaly Details (if any)
                </Label>
                <Textarea
                  id="anomalyDetails"
                  {...form.register('systemData.anomalyDetails')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Describe any recent unusual readings or behaviors..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Maintenance & Technical History */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                🔧 Maintenance & Technical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overdueForMaintenance"
                  onCheckedChange={(checked) => form.setValue('maintenanceHistory.overdueForMaintenance', !!checked)}
                />
                <Label htmlFor="overdueForMaintenance" className="text-gray-300">
                  Equipment overdue for maintenance?
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastMaintenanceDate" className="text-gray-300">
                    Last Maintenance Date
                  </Label>
                  <Input
                    id="lastMaintenanceDate"
                    type="date"
                    {...form.register('maintenanceHistory.lastMaintenanceDate')}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="lastMaintenanceActions" className="text-gray-300">
                    Last Maintenance Actions
                  </Label>
                  <Input
                    id="lastMaintenanceActions"
                    {...form.register('maintenanceHistory.lastMaintenanceActions')}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="What was done during last service?"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="knownIssues" className="text-gray-300">
                  Known Past Issues
                </Label>
                <Textarea
                  id="knownIssues"
                  {...form.register('maintenanceHistory.knownIssues')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Any known recurring problems with this system..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Operator & Human Factors */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                👥 Operator & Human Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shiftTime" className="text-gray-300">
                    Shift Time
                  </Label>
                  <Select onValueChange={(value) => form.setValue('operatorFactors.shiftTime', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select shift during incident" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift (06:00-14:00)</SelectItem>
                      <SelectItem value="evening">Evening Shift (14:00-22:00)</SelectItem>
                      <SelectItem value="night">Night Shift (22:00-06:00)</SelectItem>
                      <SelectItem value="overtime">Overtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="trainingStatus" className="text-gray-300">
                    Training/Certification Status
                  </Label>
                  <Select onValueChange={(value) => form.setValue('operatorFactors.trainingStatus', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Operator qualification level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fully_qualified">Fully Qualified</SelectItem>
                      <SelectItem value="in_training">In Training</SelectItem>
                      <SelectItem value="temporary">Temporary Assignment</SelectItem>
                      <SelectItem value="refresher_needed">Refresher Training Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="humanFactorNotes" className="text-gray-300">
                  Human Factor Considerations
                </Label>
                <Textarea
                  id="humanFactorNotes"
                  {...form.register('operatorFactors.humanFactorNotes')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Notes on fatigue, stress, workload, communication issues..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Environmental Factors */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-cyan-500" />
                🌤️ Environmental & External Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weatherConditions" className="text-gray-300">
                  Weather Conditions
                </Label>
                <Input
                  id="weatherConditions"
                  {...form.register('environmentalFactors.weatherConditions')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Temperature, humidity, wind, precipitation..."
                />
              </div>

              <div>
                <Label htmlFor="externalDisturbances" className="text-gray-300">
                  External Disturbances
                </Label>
                <Textarea
                  id="externalDisturbances"
                  {...form.register('environmentalFactors.externalDisturbances')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Nearby construction, power outages, supply disruptions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Risk/Compliance */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Risk & Compliance Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isSafetyCritical"
                    onCheckedChange={(checked) => form.setValue('riskCompliance.isSafetyCritical', !!checked)}
                  />
                  <Label htmlFor="isSafetyCritical" className="text-gray-300">
                    Safety-Critical System
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isEnvironmentCritical"
                    onCheckedChange={(checked) => form.setValue('riskCompliance.isEnvironmentCritical', !!checked)}
                  />
                  <Label htmlFor="isEnvironmentCritical" className="text-gray-300">
                    Environmental Impact System
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isComplianceTracked"
                    onCheckedChange={(checked) => form.setValue('riskCompliance.isComplianceTracked', !!checked)}
                  />
                  <Label htmlFor="isComplianceTracked" className="text-gray-300">
                    Regulatory Compliance Tracked
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="regulatoryNotes" className="text-gray-300">
                  Regulatory/Compliance Notes
                </Label>
                <Textarea
                  id="regulatoryNotes"
                  {...form.register('riskCompliance.regulatoryNotes')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Relevant regulations, standards, or compliance requirements..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/dashboard')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Analysis'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}