import React from "react";
import styled from "styled-components";
import { MusicNote } from "@phosphor-icons/react";
import { useSpotify } from "./hooks/useSpotify";

const Container = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) =>
    props.theme.background === "#ffffff"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)"};
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.theme.background === "#ffffff"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.text.secondary};
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const LoadingText = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;

const NotPlayingText = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;

const NotPlayingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.text.secondary};
  width: 100%;
`;

const AlbumArt = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const Label = styled.span`
  color: ${(props) => props.theme.text.secondary};
`;

const Title = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.text.primary};
`;

const Artist = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
`;

const NowPlaying: React.FC = () => {
  const { data: track, isError, isLoading } = useSpotify();

  if (isLoading) {
    return (
      <LoadingContainer>
        <MusicNote size={20} weight="fill" />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (isError) {
    return null;
  }

  if (!track?.isPlaying) {
    return (
      <NotPlayingContainer>
        <MusicNote size={20} weight="fill" />
        <NotPlayingText>
          Machlan isn't listening to anything right now
        </NotPlayingText>
      </NotPlayingContainer>
    );
  }

  return (
    <Container
      href={track.spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {track.albumArt && <AlbumArt src={track.albumArt} alt={track.album} />}
      <TextContainer>
        <Label>Machlan is currently listening to:</Label>
        <Title>{track.title}</Title>
        <Artist>{track.artist}</Artist>
      </TextContainer>
    </Container>
  );
};

export default NowPlaying;
