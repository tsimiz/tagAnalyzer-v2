import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isChecking: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, isChecking }) => {
  return (
    <div className="connection-status">
      <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'} ${isChecking ? 'checking' : ''}`}>
        <div className="status-light"></div>
        <span className="status-text">
          {isChecking ? 'Checking connection...' : isConnected ? 'Connected to Azure' : 'Please connect to Azure'}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
