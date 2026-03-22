import React, { Suspense, useState, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../common/Theme/ThemeContext";
import { ArrowClockwise, MathOperations } from "@phosphor-icons/react";
import NowPlaying from "../spotify/NowPlaying";
import packageJson from "../../package.json";
import ConstructionScene from "./ConstructionScene";
import MathExplanation from "./MathExplanation";
import { getAstroSnapshot, formatCoord, AstroSnapshot } from "./astronomy";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #0a0a12;
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;

  @media (max-width: 700px) {
    justify-content: flex-start;
    padding-top: 25vh;
  }

  @media (max-width: 480px) {
    padding-top: 18vh;
  }
`;

const TextGroup = styled.div`
  text-align: center;
  padding: 0 20px;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #f5f2ea;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 20px rgba(10, 10, 18, 0.8);

  @media (max-width: 700px) {
    font-size: 3rem;
  }
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 1.3rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: #d5c9be;
  margin: 0;
  text-shadow: 0 1px 10px rgba(10, 10, 18, 0.8);

  @media (max-width: 700px) {
    font-size: 1.1rem;
  }
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

// --- Info Panel ---

const InfoPanel = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 100px;
  left: 30px;
  z-index: 12;
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
  animation: ${fadeIn} 1.2s ease-out;
  max-width: 320px;

  @media (max-width: 700px) {
    left: 16px;
    right: 16px;
    bottom: 50px;
    max-width: none;
  }
`;

const PanelCard = styled.div`
  background: rgba(10, 10, 18, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(213, 201, 190, 0.1);
  border-radius: 12px;
  padding: 18px 20px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const PanelTitle = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #8f8578;
`;

const RefreshButton = styled.button`
  background: none;
  border: 1px solid rgba(213, 201, 190, 0.2);
  border-radius: 6px;
  color: #8f8578;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d5c9be;
    color: #d5c9be;
  }
`;

const PanelBody = styled.div`
  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
  }
`;

const PanelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 5px 0;
  border-bottom: 1px solid rgba(213, 201, 190, 0.06);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    gap: 2px;
    padding: 4px 0;
    border-bottom: none;
  }
`;

const PanelLabel = styled.span`
  font-size: 0.75rem;
  color: #8f8578;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 0.68rem;
  }
`;

const PanelValue = styled.span`
  font-size: 0.8rem;
  color: #d5c9be;
  font-weight: 500;
  text-align: right;

  @media (max-width: 700px) {
    text-align: left;
    font-size: 0.78rem;
  }
  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

const PanelBlurb = styled.p`
  font-size: 0.72rem;
  color: #8f8578;
  line-height: 1.5;
  margin: 12px 0 0 0;
  padding-top: 10px;
  border-top: 1px solid rgba(213, 201, 190, 0.08);

  @media (max-width: 700px) {
    grid-column: 1 / -1;
    margin: 8px 0 0 0;
    padding-top: 8px;
  }
  @media (max-width: 480px) {
    display: none;
  }
`;

const PanelFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 700px) {
    grid-column: 1 / -1;
    margin-top: 8px;
  }
`;

const MathButton = styled.button`
  background: none;
  border: 1px solid rgba(213, 201, 190, 0.12);
  border-radius: 6px;
  color: #8f8578;
  cursor: pointer;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  font-size: 0.68rem;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;

  &:hover {
    border-color: #e3955a;
    color: #e3955a;
  }

  @media (max-width: 480px) {
    font-size: 0.62rem;
    padding: 5px 8px;
  }
`;

const PanelTimestamp = styled.span`
  font-size: 0.65rem;
  color: rgba(143, 133, 120, 0.6);
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

// --- Spotify & Footer ---

const SpotifyContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 80px;
  right: 30px;
  width: 100%;
  max-width: 360px;
  z-index: 11;
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
  box-sizing: border-box;

  & * {
    -webkit-user-drag: none;
    user-select: none;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const FooterRow = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 40px;
  z-index: 11;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
  pointer-events: none;
  box-sizing: border-box;

  @media (max-width: 700px) {
    padding: 10px 16px;
  }
`;

const Version = styled.span`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.9rem;
  color: #d5c9be;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ThreeBadge = styled.span`
  position: absolute;
  right: 40px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: #8f8578;

  @media (max-width: 480px) {
    right: 16px;
    font-size: 0.65rem;
  }
`;

const LoadingFallback = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a0a12;
`;

// --- Helper ---

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function buildBlurb(snap: AstroSnapshot): string {
  const sub = snap.subsolarPoint;
  const latStr = formatCoord(sub.lat, "N", "S");
  const lonStr = formatCoord(sub.lon, "E", "W");
  return `The sun is currently highest over ${latStr}, ${lonStr} \u2014 near ${snap.middayRegion}. The moon is a ${snap.moonPhaseName.toLowerCase()} at ${snap.moonIllumination}% illumination.`;
}

// --- Component ---

const Projects: React.FC = () => {
  const { isDark } = useTheme();
  const version = packageJson.version;
  const [isDragging, setIsDragging] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [astro, setAstro] = useState<AstroSnapshot>(() =>
    getAstroSnapshot(new Date())
  );

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);
  const handleRefresh = useCallback(() => {
    setAstro(getAstroSnapshot(new Date()));
  }, []);

  const blurb = useMemo(() => buildBlurb(astro), [astro]);
  const sub = astro.subsolarPoint;

  return (
    <Container>
      <Suspense fallback={<LoadingFallback />}>
        <ConstructionScene
          astro={astro}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </Suspense>

      <Overlay $visible={!isDragging}>
        <TextGroup>
          <Title>Under Construction</Title>
          <Subtitle>Working tirelessly to bring you this page.</Subtitle>
        </TextGroup>
      </Overlay>

      <InfoPanel $visible={!isDragging}>
        <PanelCard>
          <PanelHeader>
            <PanelTitle>Solar System</PanelTitle>
            <RefreshButton onClick={handleRefresh}>
              <ArrowClockwise size={12} weight="bold" />
              Now
            </RefreshButton>
          </PanelHeader>

          <PanelBody>
            <PanelRow>
              <PanelLabel>Midday over</PanelLabel>
              <PanelValue>{astro.middayRegion}</PanelValue>
            </PanelRow>
            <PanelRow>
              <PanelLabel>Subsolar point</PanelLabel>
              <PanelValue>
                {formatCoord(sub.lat, "N", "S")},{" "}
                {formatCoord(sub.lon, "E", "W")}
              </PanelValue>
            </PanelRow>
            <PanelRow>
              <PanelLabel>Solar declination</PanelLabel>
              <PanelValue>
                {astro.solarDeclination >= 0 ? "+" : ""}
                {astro.solarDeclination.toFixed(2)}&deg;
              </PanelValue>
            </PanelRow>
            <PanelRow>
              <PanelLabel>Moon phase</PanelLabel>
              <PanelValue>
                {astro.moonPhaseEmoji} {astro.moonPhaseName}
              </PanelValue>
            </PanelRow>
            <PanelRow>
              <PanelLabel>Moon illumination</PanelLabel>
              <PanelValue>{astro.moonIllumination}%</PanelValue>
            </PanelRow>

            <PanelBlurb>{blurb}</PanelBlurb>

            <PanelFooter>
              <MathButton onClick={() => setShowMath(true)}>
                <MathOperations size={14} weight="bold" />
                See how this was calculated
              </MathButton>
              <PanelTimestamp>{formatTime(astro.date)}</PanelTimestamp>
            </PanelFooter>
          </PanelBody>
        </PanelCard>
      </InfoPanel>

      {showMath && (
        <MathExplanation astro={astro} onClose={() => setShowMath(false)} />
      )}

      <SpotifyContainer $visible={!isDragging}>
        <NowPlaying />
      </SpotifyContainer>

      <FooterRow $visible={!isDragging}>
        <Version>Version {version}</Version>
        <ThreeBadge>Made with Three.js</ThreeBadge>
      </FooterRow>
    </Container>
  );
};

export default Projects;
