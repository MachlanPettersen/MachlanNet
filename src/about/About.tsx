import React from "react";
import styled, { keyframes } from "styled-components";
import { Code, Laptop, Leaf, Coffee } from "@phosphor-icons/react";
import { useInView } from "react-intersection-observer";
import BackButton from "../common/BackButton";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text.primary};
  padding: 6rem 2rem;
  overflow: auto;
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

const StyledLink = styled.a`
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
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
      <ContentWrapper>
        <Hero delay={0}>
          <Title>What I'm up to</Title>
          <Subtitle>And why I'm doing it</Subtitle>
        </Hero>

        <Section delay={0.2}>
          <Paragraph>
            I'm a software engineer specializing in mobile and web development.
            My work primarily focuses on building applications with React.js and
            SwiftUI, from refactoring legacy codebases to architecting new
            solutions from the ground up. I've been working at{" "}
            <StyledLink
              href="https://everlightsolar.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Everlight Solar
            </StyledLink>{" "}
            since April of 2024.
          </Paragraph>
          <Paragraph>
            My B.S. in mechanical engineering from the University of Vermont
            lends me a solid foundation in problem-solving and technical
            communication. As a self-taught programmer I lean on my engineering
            background, eye for detail, and open mind to solve intricate
            problems and design enterprise-scale systems.
          </Paragraph>
        </Section>

        <Section delay={0.4}>
          <h2>Professional Focus</h2>
          <Grid>
            <PassionCard
              icon={<Code size={24} />}
              title="Development"
              content="As a web and mobile developer, I specialize in React.js, Swift, and React Native. I focus on building clean, efficient, and scalable applications that always prioritize the end user"
            />
            <PassionCard
              icon={<Leaf size={24} />}
              title="Renewable Energy"
              content="My sole inspiration to become an engineer in the first place. I strongly believe that dedication is the difference between being good and being great, and I've found my passion for engineering in renewables."
            />

            <PassionCard
              icon={<Laptop size={24} />}
              title="Elegant Architecture"
              content="Software should be as intuitive to maintain as it is to use. I aim for architecture that is clean, efficient, and thoughtfully designed for long-term success."
            />

            <PassionCard
              icon={<Coffee size={24} />}
              title="Collaboration"
              content="Great software isn't built in isolation. Working closely with leadership, designers, and backend engineers, I help shape products that truly reflect collective creativity and expertise."
            />
          </Grid>
        </Section>
        <Section delay={0.8}>
          <h2>Background</h2>
          <Paragraph>
            I grew up in Vermont- surrounded by mountains, forests, and the best
            rivers on the face of the earth. That kind of setting makes you
            appreciate the planet early on, and paired with the wisdom of some
            people that I look up to, it sparked a passion for renewable energy
            and environmental protection.
          </Paragraph>
          <Paragraph>
            <Paragraph>
              My path into software development started at UVM during a co-op
              program, where I built an iOS app to track energy usage for{" "}
              <StyledLink
                href="https://qor360.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                QOR360
              </StyledLink>
              . Along the way, I’ve learned from a couple great mentors who've
              helped me bridge the gap between mechanical engineering and
              strong, maintainable software systems. Now, I'm doing work that I
              love for a cause and company that I believe in.
            </Paragraph>
          </Paragraph>
          <Paragraph>
            When I'm not in VSCode, I'm usually experimenting in the kitchen,
            playing guitar, shooting a round of disc golf, or spending time with
            the people I love. Maybe I'm even listening to some music! Return to
            the home page to see if I have anything playing on Spotify at the
            moment.
          </Paragraph>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default About;
