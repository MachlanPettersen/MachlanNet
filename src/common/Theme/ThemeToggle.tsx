import React from "react";
import styled from "styled-components";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "./ThemeContext";

const ToggleButton = styled.button`
  position: fixed;
  top: 40px;
  right: 40px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 2.5px solid ${(props) => props.theme.text.primary};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.05);
    border-color: ${(props) => props.theme.text.accent};
    color: ${(props) => props.theme.text.accent};
  }

  @media (max-width: 700px) {
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
  }
`;

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme}>
      {isDark ? (
        <Sun size={32} weight="bold" />
      ) : (
        <Moon size={32} weight="bold" />
      )}
    </ToggleButton>
  );
};

export default ThemeToggle;
