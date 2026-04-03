import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight } from "@phosphor-icons/react";
import Navbar from "../navigation/NavBar";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text.primary};
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px 60px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${(props) => props.theme.text.primary};
  margin: 0 0 8px 0;

  @media (max-width: 700px) {
    font-size: 2.2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  font-weight: 300;
  color: ${(props) => props.theme.text.secondary};
  margin: 0 0 56px 0;
  letter-spacing: 0.3px;

  @media (max-width: 700px) {
    font-size: 1rem;
    margin-bottom: 40px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 900px;
`;

const Card = styled.div`
  background: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.text.primary}18;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.text.accent}44;
    box-shadow: 0 4px 24px ${(props) => props.theme.text.primary}0A;
  }
`;

const CardIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(props) => props.theme.text.accent}18;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text.accent};
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.text.secondary};
  line-height: 1.6;
  margin: 0;
  flex: 1;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text.secondary};
  background: ${(props) => props.theme.text.primary}0C;
  border-radius: 6px;
  padding: 3px 8px;
`;

const TryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid ${(props) => props.theme.text.accent}55;
  border-radius: 8px;
  color: ${(props) => props.theme.text.accent};
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: ${(props) => props.theme.text.accent}12;
    border-color: ${(props) => props.theme.text.accent};
  }
`;

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Navbar />
      <Content>
        <PageTitle>Projects</PageTitle>
        <PageSubtitle>Things I've built and experiments I've run.</PageSubtitle>

        <Grid>
          <Card>
            <CardIcon>
              <Globe size={22} weight="duotone" />
            </CardIcon>
            <CardTitle>Earth &amp; Solar System</CardTitle>
            <CardDescription>
              A real-time 3D model of Earth with astronomically accurate sun and
              moon positions, calculated from Jean Meeus' algorithms. Drag to
              explore.
            </CardDescription>
            <TagRow>
              <Tag>Three.js</Tag>
              <Tag>GLSL</Tag>
              <Tag>Astronomy</Tag>
            </TagRow>
            <TryButton onClick={() => navigate("/projects/planet")}>
              Try me
              <ArrowRight size={14} weight="bold" />
            </TryButton>
          </Card>
        </Grid>
      </Content>
    </Container>
  );
};

export default Projects;
