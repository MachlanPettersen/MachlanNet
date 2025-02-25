import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  LinkedinLogo,
  GithubLogo,
  EnvelopeSimple,
  Copy,
  Check,
} from "@phosphor-icons/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  height: 100vh-48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem 2rem;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text.primary};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Section = styled.div<{ delay: number }>`
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${(props) => props.delay}s;
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
  font-size: 1.25rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
`;

const ContactMethods = styled.div<{ delay: number }>`
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${(props) => props.delay}s;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
`;

const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const EmailButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: 2px solid ${(props) => props.theme.text.primary};
  border-radius: 0.5rem;
  color: ${(props) => props.theme.text.primary};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.text.primary};
    color: ${(props) => props.theme.background};
    transform: translateY(-2px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: none;
  border: 2px solid ${(props) => props.theme.text.primary};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.text.primary};
    color: ${(props) => props.theme.background};
    transform: translateY(-2px);
  }
`;

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const email = "machlan.pettersen@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container>
      <ContentWrapper>
        <Section delay={0}>
          <Title>Let's get down to brass tacks</Title>
          <Subtitle>Here's how to reach me.</Subtitle>
        </Section>

        <ContactMethods delay={0.2}>
          <EmailContainer>
            <EnvelopeSimple size={24} weight="bold" />
            <EmailButton onClick={handleCopyEmail}>
              {email}
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </EmailButton>
          </EmailContainer>

          <SocialLinks>
            <SocialButton
              href="https://linkedin.com/in/machlan"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinLogo size={24} weight="bold" />
            </SocialButton>
            <SocialButton
              href="https://github.com/MachlanPettersen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubLogo size={24} weight="bold" />
            </SocialButton>
          </SocialLinks>
        </ContactMethods>
      </ContentWrapper>
    </Container>
  );
};

export default Contact;
