import React from "react";
import styled from "styled-components";
import Navbar from "../navigation/NavBar";
import NowPlaying from "../spotify/NowPlaying";
import packageJson from "../../package.json";
import HardhatIcon from "../assets/SVG HARDHAT.svg";

const Container = styled.div`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text.primary};
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroSection = styled.main`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
  z-index: 2;
`;

const StyledIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  filter: ${(props) => (props.theme.isDark ? "invert(1)" : "none")};
  transition: filter 0.3s ease;

  @media (max-width: 700px) {
    width: 60px;
    height: 60px;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  margin: 0;
  color: ${(props) => props.theme.text.primary};
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 2px 2px 4px ${(props) => `${props.theme.text.primary}1A`};
  margin-bottom: 20px;

  @media (max-width: 700px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.4rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
  margin-bottom: 2rem;

  @media (max-width: 700px) {
    font-size: 1.2rem;
  }
`;

const SpotifyContainer = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  padding: 0 20px;
  z-index: 3;
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  font-size: 0.9rem;
  color: ${(props) => props.theme.text.secondary};
  z-index: 3;
`;

const UnderConstruction: React.FC = () => {
  const version = packageJson.version;

  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        <HeroSection>
          <StyledIcon src={HardhatIcon} alt="Construction Icon" />
          <Title>Under Construction</Title>
          <Subtitle>Working tirelessly to bring you this page.</Subtitle>
        </HeroSection>
        <SpotifyContainer>
          <NowPlaying />
        </SpotifyContainer>
        <Footer>Version {version}</Footer>
      </ContentWrapper>
    </Container>
  );
};

export default UnderConstruction;
