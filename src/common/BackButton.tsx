import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

const Button = styled.button`
  width: 54px;
  height: 54px;
  background: none;
  border: 2.5px solid ${(props) => props.theme.text.primary};
  border-radius: 50%;
  cursor: pointer;
  position: fixed;
  top: 20px;
  left: 20px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    border-color: ${(props) => props.theme.text.accent};
    transform: scale(1.05);

    svg {
      color: ${(props) => props.theme.text.accent};
      transform: translateX(-2px);
    }
  }
`;

const StyledIcon = styled(ArrowLeft)`
  color: ${(props) => props.theme.text.primary};
  transition: all 0.2s ease;
`;
interface BackButtonProps {
  to?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button onClick={handleClick}>
      <StyledIcon size={32} weight="bold" />
    </Button>
  );
};

export default BackButton;
