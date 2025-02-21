import React, { useEffect } from "react";
import styled from "styled-components";
import { CheckCircle, XCircle, CircleNotch } from "@phosphor-icons/react";
import {
  AlertMessages,
  AlertType,
  AlertMessageCategory,
} from "./AlertMessages";

interface AlertProps {
  type: AlertType;
  category: AlertMessageCategory;
  customMessage?: string;
  onClose?: () => void;
  autoHideDuration?: number;
}

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  z-index: 1000;
`;

const AlertContent = styled.div<{ type: AlertType }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => {
    switch (props.type) {
      case "loading":
        return props.theme.palette.fog;
      case "success":
        return props.theme.palette.sage;
      case "error":
        return props.theme.palette.berry;
    }
  }};
  border: 2px solid
    ${(props) => {
      switch (props.type) {
        case "loading":
          return props.theme.palette.dusk;
        case "success":
          return props.theme.palette.moss;
        case "error":
          return props.theme.palette.wine;
      }
    }};
  color: ${(props) => props.theme.text.primary};
  box-shadow: 0 4px 6px -1px ${(props) => `${props.theme.text.primary}1A`};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const AlertMessage = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const SpinningIcon = styled(CircleNotch)`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: spin 1s linear infinite;
`;

const Alert: React.FC<AlertProps> = ({
  type,
  category,
  customMessage,
  onClose,
  autoHideDuration = 3000,
}) => {
  useEffect(() => {
    if (onClose && (type === "success" || type === "error")) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [type, onClose, autoHideDuration]);

  const getIcon = () => {
    switch (type) {
      case "loading":
        return <SpinningIcon size={24} weight="bold" />;
      case "success":
        return <CheckCircle size={24} weight="bold" />;
      case "error":
        return <XCircle size={24} weight="bold" />;
    }
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    return AlertMessages[category][type];
  };

  return (
    <AlertContainer>
      <AlertContent type={type}>
        {getIcon()}
        <AlertMessage>{getMessage()}</AlertMessage>
      </AlertContent>
    </AlertContainer>
  );
};

export default Alert;
