import React, { useState } from 'react';

import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Download, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import SectionCard from '../ui-elements/Section-card';
import ToggleOption from '../ui-elements/Toggle-option';

const PrivacyControls: React.FC = () => {
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(true);
  
  const handleExportData = () => {
    // In a real app, this would trigger a data export process
    toast.message("export the data")
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would initiate account deletion
    toast.message("delete account")
  };

  return (
    <SectionCard 
      title="Privacy Controls" 
      description="Manage your data sharing and privacy settings"
      tag="Privacy"
    >
      <div className="space-y-1 mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Data Sharing Preferences
        </h4>
        <div className="bg-secondary/50 rounded-md p-4 space-y-4">
          <ToggleOption
            label="Marketing emails"
            description="Receive emails about new features, products, and offers"
            checked={marketingEmails}
            onCheckedChange={setMarketingEmails}
          />
          
          <ToggleOption
            label="Share analytics"
            description="Help us improve by sharing anonymous usage data"
            checked={shareAnalytics}
            onCheckedChange={setShareAnalytics}
          />
          
          <ToggleOption
            label="Personalized advertising"
            description="Allow us to show you relevant ads based on your interests"
            checked={personalizedAds}
            onCheckedChange={setPersonalizedAds}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium mb-2">Your Data</h4>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleExportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Your Data
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your account and all associated data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">
          We comply with GDPR and CCPA. You have the right to access, export, or delete your personal data at any time.
        </p>
      </div>
    </SectionCard>
  );
};

export default PrivacyControls;
