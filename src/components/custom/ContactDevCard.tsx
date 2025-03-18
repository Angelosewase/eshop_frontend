import { MessageSquare, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

function ContactDevCard() {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 shadow-md border border-gray-700">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-500/20 rounded-full flex-shrink-0">
          <MessageSquare className="h-4 w-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-xs">Need Help?</h3>
          <a 
            href="mailto:support@eshop.com" 
            className="inline-flex items-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Contact Support
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactDevCard;
