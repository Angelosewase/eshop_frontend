import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import ToggleOption from "../ui-elements/Toggle-option";
import SectionCard from "../ui-elements/Section-card";

const CommunicationPreferences = () => {
  const [newsletterFrequency, setNewsletterFrequency] = useState("weekly");
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [accountAlerts, setAccountAlerts] = useState(true);

  const handleFrequencyChange = (value: string) => {
    setNewsletterFrequency(value);
    toast.message("hello");
  };
  return (
    <SectionCard
      title="Communication Preferences"
      description="Manage how and when we contact you"
      tag="Notifications"
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Newsletter Frequency</h4>
          <RadioGroup
            value={newsletterFrequency}
            onValueChange={handleFrequencyChange}
            className="bg-secondary/50 rounded-md p-4 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="font-normal">
                Daily
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="font-normal">
                Weekly
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal">
                Monthly
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never" className="font-normal">
                Never (Opt out)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notification Settings
          </h4>
          <div className="bg-secondary/50 rounded-md p-4 space-y-4">
            <ToggleOption
              label="Order Updates"
              description="Receive notifications about your orders and deliveries"
              checked={orderUpdates}
              onCheckedChange={setOrderUpdates}
            />

            <ToggleOption
              label="Promotions & Offers"
              description="Be the first to know about sales and special offers"
              checked={promotions}
              onCheckedChange={setPromotions}
            />

            <ToggleOption
              label="Account Alerts"
              description="Important notifications about your account security and payments"
              checked={accountAlerts}
              onCheckedChange={setAccountAlerts}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You will always receive essential service notifications such as
            purchase confirmations and security alerts.
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

export default CommunicationPreferences;
