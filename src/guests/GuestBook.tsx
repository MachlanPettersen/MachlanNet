import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Lock } from "@phosphor-icons/react";
import BackButton from "../common/BackButton";
import { useTheme } from "../common/Theme/ThemeContext";
import { useCreateSignature } from "./hooks/useSignatures";
import Alert from "../common/Alert/Alert";
import Tooltip from "../common/components/ToolTip";
import GuestList from "./GuestList";

interface Signature {
  image: string;
  timestamp: string;
  color: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1.5rem;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 400px;
`;

const ColorButton = styled.button<{ color: string; isSelected: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.isSelected ? props.theme.text.primary : props.color)};
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const CanvasContainer = styled.div`
  border: 4px solid ${(props) => props.theme.accent.brown.light};
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  touch-action: none;
`;

const StyledCanvas = styled.canvas`
  background-color: #f5f2ea;
  touch-action: none;
  width: 100%;
  height: 400px;
  border: 2px solid ${(props) => props.theme.text.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => props.theme.text.primary};
  color: ${(props) => props.theme.background};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.text.accent};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const ViewButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) => props.theme.accent.green.main};

  &:hover {
    background-color: ${(props) => props.theme.accent.green.dark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.text.secondary};
  }
`;

const GuestBook: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>(theme.palette.bark);
  const [localSignatures, setLocalSignatures] = useState<Signature[]>([]);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isViewingList, setIsViewingList] = useState(false);
  const createSignature = useCreateSignature();

  const paletteColors = [
    theme.palette.bark,
    theme.palette.clay,
    theme.palette.moss,
    theme.palette.sage,
    theme.palette.sand,
    theme.palette.earth,
    theme.palette.stone,
    theme.palette.fog,
    theme.palette.dusk,
    theme.palette.berry,
    theme.palette.wine,
    theme.palette.rust,
  ];

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the DPR and size the canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Scale the context to ensure correct drawing operations
    context.scale(dpr, dpr);

    // Set initial drawing style
    context.strokeStyle = currentColor;
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    setCtx(context);

    const savedSignatures = localStorage.getItem("signatures");
    if (savedSignatures) {
      const parsedSignatures: Signature[] = JSON.parse(savedSignatures);
      setLocalSignatures(parsedSignatures);
      drawSavedSignatures(parsedSignatures, context);
    }
  };

  useEffect(() => {
    if (!isViewingList) {
      initializeCanvas();
    }
  }, [isViewingList]);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor;
    }
  }, [currentColor, ctx]);

  useEffect(() => {
    setCurrentColor(theme.palette.bark);
  }, [theme]);

  const getCoordinates = (
    e: MouseEvent | TouchEvent
  ): { offsetX: number; offsetY: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    }

    return {
      offsetX: (e as MouseEvent).clientX - rect.left,
      offsetY: (e as MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e.nativeEvent);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !ctx) return;

    const { offsetX, offsetY } = getCoordinates(e.nativeEvent);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newSignature: Signature = {
      image: canvas.toDataURL(),
      timestamp: new Date().toISOString(),
      color: currentColor,
    };

    const updatedSignatures = [...localSignatures, newSignature];
    setLocalSignatures(updatedSignatures);
    localStorage.setItem("signatures", JSON.stringify(updatedSignatures));
  };

  const drawSavedSignatures = (
    savedSignatures: Signature[],
    context: CanvasRenderingContext2D
  ) => {
    savedSignatures.forEach((sig) => {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = sig.image;
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setLocalSignatures([]);
    localStorage.removeItem("signatures");
  };

  const handleSubmitSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = {
      image: canvas.toDataURL(),
      color: currentColor,
    };

    setShowAlert(true);

    try {
      await createSignature.mutateAsync(signatureData);
      clearCanvas();
    } catch (error) {
      console.error("Failed to submit signature:", error);
    }
  };

  if (isViewingList) {
    return <GuestList onBack={() => setIsViewingList(false)} />;
  }

  return (
    <Container>
      {showAlert && (
        <Alert
          type={
            createSignature.isPending
              ? "loading"
              : createSignature.isError
              ? "error"
              : "success"
          }
          category="signatures"
          onClose={() => setShowAlert(false)}
        />
      )}
      <Title>Sign The Guestbook!</Title>

      <ColorPicker>
        {paletteColors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            isSelected={currentColor === color}
            onClick={() => setCurrentColor(color)}
          />
        ))}
      </ColorPicker>

      <CanvasContainer>
        <StyledCanvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </CanvasContainer>

      <ButtonContainer>
        <Button onClick={clearCanvas}>Clear Canvas</Button>
        <Button
          onClick={handleSubmitSignature}
          disabled={createSignature.isPending || localSignatures.length === 0}
        >
          Submit Signature
        </Button>
        <ViewButton onClick={() => setIsViewingList(true)}>
          View Guestbook
        </ViewButton>
      </ButtonContainer>
    </Container>
  );
};

export default GuestBook;
