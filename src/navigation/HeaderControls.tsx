import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../common/Theme/ThemeContext";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 30px 40px 10px 40px;
  background-color: ${(props) => `${props.theme.background}CC`};
  backdrop-filter: blur(8px);
  z-index: 1000;
  box-sizing: border-box;
`;

const ControlButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 2px solid ${(props) => props.theme.text.primary};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${(props) => props.theme.text.accent};
    color: ${(props) => props.theme.text.accent};
  }
`;

const Spacer = styled.div`
  width: 48px;
`;

const HeaderControls: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const isHomePage = location.pathname === "/";

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer>
      {isHomePage ? (
        <Spacer />
      ) : (
        <ControlButton onClick={handleBackClick}>
          <ArrowLeft size={28} weight="bold" />
        </ControlButton>
      )}

      <ControlButton onClick={toggleTheme}>
        {isDark ? (
          <Sun size={28} weight="bold" />
        ) : (
          <Moon size={28} weight="bold" />
        )}
      </ControlButton>
    </HeaderContainer>
  );
};

export default HeaderControls;
