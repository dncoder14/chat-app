import { MessageCircle, Users, Zap, Shield, Clock, TrendingUp } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        <img src="/logo.png" alt="Orango" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-3">
          Welcome to <span className="font-medium text-primary-500">Orango</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Select a contact to start your conversation
        </p>
        <div className="space-y-3 text-sm text-gray-400 dark:text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Smart Replies</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>End-to-End Encryption</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Smart Stories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;