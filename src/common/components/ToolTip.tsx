import React, { useState } from "react";
import styled from "styled-components";

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ isVisible: boolean }>`
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background-color: ${(props) => props.theme.text.primary};
  color: ${(props) => props.theme.background};
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: ${(props) => props.theme.text.primary} transparent transparent
      transparent;
  }
`;

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <TooltipContent isVisible={isVisible}>{content}</TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
