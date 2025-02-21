import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useTheme } from "../common/Theme/ThemeContext";
import { List, CaretUp } from "@phosphor-icons/react";

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NavContainer = styled.nav`
  position: fixed;
  top: 30px;
  left: 30px;
  background-color: ${(props) => `${props.theme.background}E6`};
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px ${(props) => `${props.theme.text.primary}1A`};
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1001;

  @media (max-width: 700px) {
    background: none;
    padding: 0;
    box-shadow: none;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;

  @media (max-width: 700px) {
    display: none;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0px;
  left: 0;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
  box-shadow: 0 4px 10px ${(props) => `${props.theme.text.primary}1A`};
  padding: 12px;
  border-radius: 8px;
  animation: ${slideDown} 0.3s ease-out;
  z-index: 1001;
  min-width: 160px;

  @media (min-width: 701px) {
    display: none;
  }
`;

const MobileNavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  display: inline;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 8px 12px;
  color: ${(props) => props.theme.text.primary};
  transition: all 0.3s ease;
  border-radius: 4px;
  display: block;

  &:hover {
    color: ${(props) => props.theme.text.accent};
  }

  @media (max-width: 700px) {
    font-size: 1rem;
    padding: 10px 15px;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text.primary};
  font-size: 2rem;
  cursor: pointer;
  display: none;
  padding: 0;
  z-index: 1002;

  @media (max-width: 700px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  align-self: center;
  margin-top: 10px;
  padding: 0;

  &:hover {
    color: ${(props) => props.theme.text.accent};
  }
`;

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <NavLink to="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/about">About</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/projects">Projects</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contact">Contact</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/guestbook" style={{ color: theme.accent.green.main }}>
            Sign the guest book!
          </NavLink>
        </NavItem>
      </NavList>

      {!isOpen && (
        <MenuButton onClick={() => setIsOpen(true)}>
          <List size={28} />
        </MenuButton>
      )}

      <DropdownMenu isOpen={isOpen}>
        <MobileNavList>
          <NavItem>
            <NavLink to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/projects">Projects</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contact">Contact</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/guestbook" style={{ color: theme.accent.green.main }}>
              Sign the guest book!
            </NavLink>
          </NavItem>
        </MobileNavList>
        <CloseButton onClick={() => setIsOpen(false)}>
          <CaretUp size={28} />
        </CloseButton>
      </DropdownMenu>
    </NavContainer>
  );
};

export default Navbar;
