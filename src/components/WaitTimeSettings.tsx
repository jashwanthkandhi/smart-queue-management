import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import apiService from '@/lib/api';

interface WaitTimeSettingsProps {
  serviceId: string;
}

export function WaitTimeSettings({ serviceId }: WaitTimeSettingsProps) {
  const [overallWaitTime, setOverallWaitTime] = useState(30);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWaitTime();
  }, [serviceId]);

  const fetchWaitTime = async () => {
    try {
      const data = await apiService.getEstimatedWaitTime(serviceId);
      setOverallWaitTime(data.overallWaitTime);
    } catch (error) {
      console.error('Failed to fetch wait time:', error);
    }
  };

  const handleSave = async () => {
    if (overallWaitTime < 1) {
      setMessage('Time must be at least 1 minute');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await apiService.setEstimatedWaitTime(serviceId, overallWaitTime);
      setMessage('✅ Overall wait time updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating wait time:', error);
      setMessage(`❌ Failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setOverallWaitTime(30);
    setSaving(true);
    try {
      await apiService.setEstimatedWaitTime(serviceId, 30);
      setMessage('✅ Reset to default (30 minutes)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error resetting wait time:', error);
      setMessage(`❌ Failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Overall Wait Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Set estimated wait time for this service</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="240"
              value={overallWaitTime}
              onChange={(e) => setOverallWaitTime(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={saving}
            />
            <span className="text-sm text-gray-600 font-medium">min</span>
          </div>
          <p className="text-xs text-gray-500">
            All customers will see this as the estimated wait time regardless of queue position
          </p>
        </div>

        {message && (
          <div className={`p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            onClick={handleReset}
            disabled={saving}
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
