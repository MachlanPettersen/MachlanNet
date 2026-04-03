import React, { Suspense, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight, Waves } from "@phosphor-icons/react";
import Navbar from "../navigation/NavBar";
import WaterwheelScene from "./WaterwheelScene";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ──────────────────────────────────────────────────────────────────

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #c5e2f0;
`;

const LoadingFallback = styled.div`
  position: absolute;
  inset: 0;
  background-color: #c5e2f0;
`;

// ─── Title overlay ────────────────────────────────────────────────────────────

const TitleOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 15;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 700px) {
    top: 60px;
  }
`;

const PageTitle = styled.h1`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #f5f2ea;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 24px rgba(30, 20, 10, 0.5);

  @media (max-width: 700px) {
    font-size: 2.6rem;
  }
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: rgba(245, 242, 234, 0.75);
  margin: 0;
  text-shadow: 0 1px 10px rgba(30, 20, 10, 0.4);

  @media (max-width: 480px) {
    font-size: 0.88rem;
  }
`;

// ─── Cards panel ─────────────────────────────────────────────────────────────

const CardsPanel = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  padding: 22px 28px 28px;
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  background: rgba(20, 12, 6, 0.48);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-top: 1px solid rgba(245, 242, 234, 0.12);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? "0" : "20px")});
  transition: opacity 0.4s ease, transform 0.4s ease;
  animation: ${slideUp} 0.9s ease-out;

  @media (max-width: 700px) {
    padding: 16px 16px 20px;
    gap: 12px;
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(245, 242, 234, 0.07);
  border: 1px solid rgba(245, 242, 234, 0.13);
  border-radius: 14px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease;
  max-width: 380px;
  width: 100%;

  &:hover {
    background: rgba(245, 242, 234, 0.13);
    border-color: rgba(245, 242, 234, 0.28);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 12px;
  }
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(245, 242, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e3955a;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #f5f2ea;
  margin: 0 0 4px 0;
`;

const CardDesc = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.78rem;
  color: rgba(213, 201, 190, 0.75);
  margin: 0 0 8px 0;
  line-height: 1.45;

  @media (max-width: 480px) {
    display: none;
  }
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(213, 201, 190, 0.6);
  background: rgba(245, 242, 234, 0.08);
  border-radius: 5px;
  padding: 2px 7px;
`;

const ArrowBtn = styled.div`
  color: rgba(227, 149, 90, 0.7);
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.2s ease;

  ${Card}:hover & {
    color: #e3955a;
    transform: translateX(3px);
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <Container>
      <Navbar />

      <Suspense fallback={<LoadingFallback />}>
        <WaterwheelScene
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </Suspense>

      <TitleOverlay $visible={!isDragging}>
        <PageTitle>Projects</PageTitle>
        <PageSubtitle>Drag to explore · click a card to open</PageSubtitle>
      </TitleOverlay>

      <CardsPanel $visible={!isDragging}>
        <Card onClick={() => navigate("/projects/planet")}>
          <CardIcon>
            <Globe size={20} weight="duotone" />
          </CardIcon>
          <CardBody>
            <CardTitle>Earth &amp; Solar System</CardTitle>
            <CardDesc>
              Real-time 3D Earth with astronomically accurate sun and moon
              positions from Jean Meeus' algorithms.
            </CardDesc>
            <TagRow>
              <Tag>Three.js</Tag>
              <Tag>GLSL</Tag>
              <Tag>Astronomy</Tag>
            </TagRow>
          </CardBody>
          <ArrowBtn>
            <ArrowRight size={16} weight="bold" />
          </ArrowBtn>
        </Card>

        <Card onClick={() => navigate("/projects/waterwheel")}>
          <CardIcon>
            <Waves size={20} weight="duotone" />
          </CardIcon>
          <CardBody>
            <CardTitle>Waterwheel Mill</CardTitle>
            <CardDesc>
              A stylized 3D mill scene with an animated river, rotating
              waterwheel, and hand-crafted geometry.
            </CardDesc>
            <TagRow>
              <Tag>Three.js</Tag>
              <Tag>GLSL</Tag>
              <Tag>3D Scene</Tag>
            </TagRow>
          </CardBody>
          <ArrowBtn>
            <ArrowRight size={16} weight="bold" />
          </ArrowBtn>
        </Card>
      </CardsPanel>
    </Container>
  );
};

export default Projects;
