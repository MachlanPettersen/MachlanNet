import React from "react";
import styled from "styled-components";
import { ArrowLeft } from "@phosphor-icons/react";
import { useSignatures } from "./hooks/useSignatures";
import { format } from "date-fns";

interface GuestListProps {
  onBack: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  overflow: auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
`;

const SignatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
`;

const SignatureCard = styled.div`
  background: ${(props) => props.theme.background};
  border: 2px solid ${(props) => props.theme.accent.brown.light};
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SignatureImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f5f2ea;
  border-bottom: 2px solid ${(props) => props.theme.accent.brown.light};
`;

const SignatureInfo = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
`;

const BackButton = styled.button`
  position: absolute;
  top: 40px;
  left: 40px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2.5px solid ${(props) => props.theme.text.primary};
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.text.accent};
    transform: scale(1.05);

    svg {
      color: ${(props) => props.theme.text.accent};
    }
  }
`;

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${(props) => props.theme.text.primary};
  transition: all 0.2s ease;
`;

const LoadingText = styled.div`
  color: ${(props) => props.theme.text.secondary};
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.accent.orange.main};
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
`;

const NoSignaturesText = styled.div`
  color: ${(props) => props.theme.text.secondary};
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
`;

const GuestList: React.FC<GuestListProps> = ({ onBack }) => {
  const { data: signatures, isLoading, isError } = useSignatures();

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading signatures...</LoadingText>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorText>
          Failed to load signatures. Please try again later.
        </ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Guest Signatures</Title>

      {signatures && signatures.length > 0 ? (
        <SignatureGrid>
          {signatures.map((signature) => (
            <SignatureCard key={signature._id}>
              <SignatureImage src={signature.image} alt="Guest signature" />
              <SignatureInfo>
                <span
                  style={{
                    backgroundColor: signature.color,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                  }}
                />
                <span>
                  {format(new Date(signature.timestamp), "MMM d, yyyy")}
                </span>
              </SignatureInfo>
            </SignatureCard>
          ))}
        </SignatureGrid>
      ) : (
        <NoSignaturesText>
          No signatures yet. Be the first to sign!
        </NoSignaturesText>
      )}
    </Container>
  );
};

export default GuestList;
