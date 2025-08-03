'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TippingButton } from '@/components/TippingButton';
import { FaReact } from 'react-icons/fa'; // Example using react-icons

// ====================================================================
// START: Animated Squares Background React Component
// ====================================================================

interface AnimatedSquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
}

const AnimatedSquares: React.FC<AnimatedSquaresProps> = ({
  direction = 'right',
  speed = 0.5,
  borderColor = '#333',
  squareSize = 40,
  hoverFillColor = '#222',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationState = useRef({
    requestRef: null as number | null,
    gridOffset: { x: 0, y: 0 },
    hoveredSquare: null as { x: number; y: number } | null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrid = () => {
      const state = animationState.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width + squareSize; x += squareSize) {
        for (let y = 0; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (state.gridOffset.x % squareSize);
          const squareY = y - (state.gridOffset.y % squareSize);

          const isHovered =
            state.hoveredSquare &&
            Math.floor(x / squareSize) === state.hoveredSquare.x &&
            Math.floor(y / squareSize) === state.hoveredSquare.y;

          if (isHovered) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(18, 18, 18, 0)');
      gradient.addColorStop(1, 'rgba(18, 18, 18, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const state = animationState.current;
      const effectiveSpeed = Math.max(speed, 0.1);
      state.gridOffset.x = (state.gridOffset.x - effectiveSpeed + squareSize) % squareSize;
      drawGrid();
      state.requestRef = requestAnimationFrame(updateAnimation);
    };

    // This event listener is now on the window, so it works everywhere
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const state = animationState.current;

      const hoveredX = Math.floor((mouseX + state.gridOffset.x) / squareSize);
      const hoveredY = Math.floor((mouseY + state.gridOffset.y) / squareSize);

      state.hoveredSquare = { x: hoveredX, y: hoveredY };
    };

    const handleMouseLeave = () => {
      animationState.current.hoveredSquare = null;
    };

    const handleTipComplete = () => {
      console.log('Tip animation finished! Thanks for the tip!');
    };

    resizeCanvas();
    updateAnimation();
    window.addEventListener('resize', resizeCanvas);
    // Attach mouse move to the window, not the canvas
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationState.current.requestRef) {
        cancelAnimationFrame(animationState.current.requestRef);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 -z-10" />;
};

// ====================================================================
// END: Animated Squares Background React Component
// ====================================================================


interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = React.forwardRef<HTMLDivElement, WelcomeProps>(
  ({ disabled, startButtonText, onStartCall }, ref) => {
    function handleTipComplete(): void {
      // Show a thank you message or perform any desired action after tipping
      console.log('Tip animation finished! Thanks for the tip!');
    }

    return (
      <div
        ref={ref}
        // @ts-ignore
        inert={disabled ? '' : undefined}
        className="fixed inset-0 z-10 mx-auto flex h-svh flex-col items-center justify-center text-center"
      >
        <AnimatedSquares
          direction="diagonal"
          speed={0.5}
          borderColor="#333"
          squareSize={42}
          hoverFillColor="#222"
        />

        {/* 
          THE FIX: We make this entire content block 'invisible' to the mouse,
          but we will re-enable pointer events on the button itself so it remains clickable.
        */}
        <div className="relative z-10 flex flex-col items-center p-4 pointer-events-none">
          <h1 className="font-mono text-[12rem] sm:text-[8rem] md:text-[15rem] tracking-tight text-foreground leading-none">
            AURA
          </h1>

          <p className=" max-w-lg text-lg leading-8 text-foreground/80">
            Meet Aura – Your AI Companion for Thoughtful Conversations. When you're ready, begin your session.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onStartCall}
            // Add text-lg here to increase the font size
            className="mt-4 w-64 font-sans pointer-events-auto text-[0.85rem] text-white/50 hover:text-white transition-colors"
            disabled={disabled}
          >
            {startButtonText}
          </Button>
        </div>

        <p className="fixed bottom-6 left-1/2 w-full max-w-prose -translate-x-1/2 text-xs text-foreground/60 pointer-events-none">
          Built by Dheeraj Appaji using{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://livekit.io"
            // THE FIX PART 3: Also re-enable mouse events for the link
            className="underline hover:text-foreground/80 pointer-events-auto"
          >
            LiveKit
          </a>
          . Finally, someone who listens... unlike your group chat.
        </p>
        <TippingButton
          onTip={handleTipComplete}
          coinIcon={<FaReact size="100%" color="currentColor" />}
          instructionText="Click to show appreciation"
        >
          Support Creator
        </TippingButton>
      </div>
    );
  }
);

Welcome.displayName = 'Welcome';
