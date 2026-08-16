import { MessageCircle, Image as ImageIcon, Clock } from "lucide-react";
import AppLogo from "./ui/AppLogo";

const NoChatSelected = () => {
  return (
    <div className="flex-1 bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <AppLogo size="lg" showName={false} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to <span className="text-primary">Orango</span>
        </h1>
        <p className="text-muted mb-8 text-sm">
          Select a contact to start your conversation
        </p>
        <div className="flex flex-col items-center gap-2.5 text-sm text-muted">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Real-time messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Photo sharing</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>24-hour stories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
