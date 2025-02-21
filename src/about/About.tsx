import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Code,
  Coffee,
  Guitar,
  Lightbulb,
  Mountains,
  RocketLaunch,
} from "@phosphor-icons/react";
import { useInView } from "react-intersection-observer";
import BackButton from "../common/BackButton";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text.primary};
  padding: 6rem 2rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Section = styled.section<{ delay: number }>`
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const Hero = styled(Section)`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.text.primary};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 1rem 0 0 0;
  font-weight: 300;
`;

const QuoteBlock = styled.blockquote`
  font-size: 1.25rem;
  font-style: italic;
  color: ${(props) => props.theme.text.accent};
  margin: 2rem 0;
  padding: 0 2rem;
  border-left: 4px solid ${(props) => props.theme.accent.green.main};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const Card = styled.div<{ inView: boolean }>`
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.text.primary}20;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.inView ? 1 : 0)};
  transform: translateY(${(props) => (props.inView ? "0" : "20px")});

  &:hover {
    border-color: ${(props) => props.theme.text.accent};
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: ${(props) => props.theme.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardContent = styled.p`
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  line-height: 1.6;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${(props) => props.theme.text.secondary};
  margin: 0 0 1.5rem 0;
`;

interface PassionCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const PassionCard: React.FC<PassionCardProps> = ({ title, icon, content }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <Card ref={ref} inView={inView}>
      <CardTitle>
        {icon}
        {title}
      </CardTitle>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

const About: React.FC = () => {
  return (
    <Container>
      <BackButton />
      <ContentWrapper>
        <Hero delay={0}>
          <Title>Hey, I'm Machlan</Title>
          <Subtitle>
            Software engineer, musician, and perpetual learner
          </Subtitle>
          <QuoteBlock>
            "The only way to do great work is to love what you do." - Steve Jobs
          </QuoteBlock>
        </Hero>

        <Section delay={0.2}>
          <Paragraph>
            I'm a software engineer with a passion for building things that make
            a difference. Currently crafting digital experiences and solving
            interesting problems in the tech world. When I'm not coding, you'll
            find me playing guitar, hiking trails, or diving into a new side
            project.
          </Paragraph>
          <Paragraph>
            My journey in tech started with curiosity about how things work,
            leading me through various roles and projects that have shaped my
            perspective on building software that matters. I believe in writing
            clean code, creating intuitive user experiences, and always learning
            from those around me.
          </Paragraph>
        </Section>

        <Section delay={0.4}>
          <h2>What Drives Me</h2>
          <Grid>
            <PassionCard
              icon={<Code size={24} />}
              title="Clean Code"
              content="I believe in writing maintainable, efficient code that solves real problems. Every line should have a purpose."
            />
            <PassionCard
              icon={<Lightbulb size={24} />}
              title="Innovation"
              content="Always exploring new technologies and approaches to build better solutions."
            />
            <PassionCard
              icon={<Guitar size={24} />}
              title="Creativity"
              content="Whether it's music or code, I'm passionate about creating things that resonate with people."
            />
            <PassionCard
              icon={<Mountains size={24} />}
              title="Growth"
              content="Every challenge is an opportunity to learn and improve. The journey never ends."
            />
            <PassionCard
              icon={<Coffee size={24} />}
              title="Community"
              content="Building connections and sharing knowledge with fellow developers and creators."
            />
            <PassionCard
              icon={<RocketLaunch size={24} />}
              title="Impact"
              content="Focused on creating technology that makes a positive difference in people's lives."
            />
          </Grid>
        </Section>

        <Section delay={0.6}>
          <h2>Beyond the Code</h2>
          <Paragraph>
            When I'm not immersed in code, I'm probably working on music,
            exploring nature, or tinkering with a new project. I believe that
            these diverse interests make me a better developer - they bring
            fresh perspectives and creative approaches to problem-solving.
          </Paragraph>
          <Paragraph>
            I'm always open to connecting with fellow developers, creators, and
            anyone passionate about technology and its potential to create
            positive change. Feel free to reach out through any of the channels
            in the contact section!
          </Paragraph>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default About;
