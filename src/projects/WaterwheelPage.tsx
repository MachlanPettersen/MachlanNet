import React, { Suspense, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { Sun, Moon } from "@phosphor-icons/react";
import WaterwheelScene from "./WaterwheelScene";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #7bbde0;
`;

const LoadingFallback = styled.div`
  position: absolute;
  inset: 0;
  background-color: #7bbde0;
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const TextGroup = styled.div`
  text-align: center;
  padding: 0 20px;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 3.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #f5f2ea;
  margin: 0 0 14px 0;
  text-shadow: 0 2px 24px rgba(20, 10, 4, 0.5);
  @media (max-width: 700px) { font-size: 2.8rem; }
  @media (max-width: 480px) { font-size: 2.1rem; }
`;

const Subtitle = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: rgba(245, 242, 234, 0.78);
  margin: 0;
  text-shadow: 0 1px 12px rgba(20, 10, 4, 0.4);
  @media (max-width: 700px) { font-size: 1rem; }
`;

const ToggleButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(10, 6, 2, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 242, 234, 0.18);
  border-radius: 10px;
  color: #f5f2ea;
  cursor: pointer;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  padding: 8px 14px;
  transition: background 0.2s ease, border-color 0.2s ease, opacity 0.4s ease;
  opacity: ${(p) => (p.$visible ? 1 : 0)};

  &:hover {
    background: rgba(10, 6, 2, 0.65);
    border-color: rgba(245, 242, 234, 0.35);
  }

  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
    font-size: 0.72rem;
    padding: 6px 10px;
  }
`;

const FooterRow = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 0; left: 0; width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 40px;
  z-index: 11;
  pointer-events: none;
  box-sizing: border-box;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const FooterLabel = styled.span`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.78rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: rgba(245, 242, 234, 0.5);
`;

const WaterwheelPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDaytime, setIsDaytime]   = useState(true);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd   = useCallback(() => setIsDragging(false), []);

  return (
    <Container>
      <Suspense fallback={<LoadingFallback />}>
        <WaterwheelScene
          isDaytime={isDaytime}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </Suspense>

      <ToggleButton $visible={!isDragging} onClick={() => setIsDaytime((d) => !d)}>
        {isDaytime
          ? <><Moon size={14} weight="fill" /> Night</>
          : <><Sun  size={14} weight="fill" /> Day</>}
      </ToggleButton>

      <Overlay $visible={!isDragging}>
        <TextGroup>
          <Title>Waterwheel Mill</Title>
          <Subtitle>A stylized 3D scene — drag to explore.</Subtitle>
        </TextGroup>
      </Overlay>

      <FooterRow $visible={!isDragging}>
        <FooterLabel>Made with Three.js</FooterLabel>
      </FooterRow>
    </Container>
  );
};

export default WaterwheelPage;
