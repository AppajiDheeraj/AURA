'use client';

import React, { useRef, useEffect, FC, ReactNode } from 'react';
import gsap from 'gsap';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';

gsap.registerPlugin(Physics2DPlugin);

// ====================================================================
// STYLES: Adjusted for fixed positioning and transparency.
// ====================================================================
const TippingButtonStyles: FC = () => (
  <style jsx global>{`
    /* Inlined Google Fonts for simplicity */
    @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Inter:opsz,wght@14..32,100..900&display=swap' );

    /* MODIFICATION: Position the container in the bottom right */
    .tipping-button-container {
      position: fixed;
      bottom: 2rem; /* 32px */
      right: 2rem;  /* 32px */
      z-index: 9999;
      --ru: 15;
      transform-style: preserve-3d;
      font-family: 'Inter', sans-serif;
    }

    .tipping-button-container *,
    .tipping-button-container *::before,
    .tipping-button-container *::after {
      transform-style: preserve-3d;
    }

    .tipping-button-container [data-flipped='true'] .arrow {
      opacity: 0;
    }

    .tipping-button-container .arrow {
      display: inline-block;
      opacity: 0.8;
      position: absolute; /* Changed from fixed to be relative to the container */
      font-size: 0.875rem;
      font-family: 'Gloria Hallelujah', cursive;
      transition: opacity 0.26s 0.26s ease-out;
      color: hsl(0 0% 65%);
      pointer-events: none;
    }

    /* MODIFICATION: Reposition the instruction arrow */
    .tipping-button-container .arrow--instruction {
      bottom: 160%;
      right: 25%;
      transform: rotate(-2deg) translateX(20%);
      white-space: wrap;
    }
    
    .tipping-button-container .arrow--instruction svg {
      color: hsl(0 0% 65%);
      position: absolute;
      width: 40px;
      top: 90%;
      left: 0%;
      transform: translateX(-70%) rotate(85deg) scaleX(-1);
    }5

    /* MODIFICATION: Removed transform that centered the button */
    .tipping-button-container main {
      scale: 1.2;
    }

    .tipping-button-container [aria-label] {
      touch-action: none;
      user-select: none;
      -webkit-tap-highlight-color: #0000;
      --bg: #1871f4;
      background: var(--bg);
      border-radius: 6px;
      font-size: 0.695rem;
      color: #fff;
      font-family: inherit;
      border: 1px solid color-mix(in oklch, var(--bg), #000 12%);
      cursor: pointer;
      transform-origin: 75% 50%;
      transition: transform 0.26s, box-shadow 0.26s;
      padding: 0;
      --shadow-color: 0 0% 0%;
      box-shadow: 0px 0.6px 0.7px hsl(var(--shadow-color) / 0.14),
        0px 2.3px 2.6px -0.8px hsl(var(--shadow-color) / 0.14),
        0px 5.9px 6.6px -1.7px hsl(var(--shadow-color) / 0.14),
        0px 14.5px 16.3px -2.5px hsl(var(--shadow-color) / 0.14);
    }

    .tipping-button-container .content {
      align-items: center;
      clip-path: inset(-100vmax 0 1px 0);
      display: flex;
      gap: 0.75rem;
      padding: 0.35rem 0.7rem;
      height: 100%;
    }

    .tipping-button-container [data-tipping='false']:active {
      transform: rotate(calc(var(--ru) * -1deg));
      box-shadow: -0.5px 0.7px 1px hsl(var(--shadow-color) / 0.14),
        -1.8px 2.3px 3.3px -0.8px hsl(var(--shadow-color) / 0.14),
        -4.6px 6px 8.5px -1.7px hsl(var(--shadow-color) / 0.14),
        -11.4px 14.6px 20.8px -2.5px hsl(var(--shadow-color) / 0.14);
    }

    .tipping-button-container [aria-label]:is(:focus-visible, :hover) {
      --bg: color-mix(in oklch, #1871f4, #000 5%);
    }
    
    .tipping-button-container [aria-label]:is(:focus-visible, :hover) .purse {
      rotate: y 360deg;
      transition: rotate 0.26s 0.12s ease-out;
    }

    .tipping-button-container .purse {
      height: 100%;
      width: 100%;
      position: absolute;
      inset: 0;
      transform-style: preserve-3d;
    }

    .tipping-button-container .scene {
      --thickness: 4;
      display: inline-block;
      width: 1.2lh;
      aspect-ratio: 1;
      position: relative;
      transform-style: preserve-3d;
      perspective: 100vh;
    }

    .tipping-button-container .hole {
      position: absolute;
      z-index: 10;
      inset: 0;
      scale: 0;
      transform-style: preserve-3d;
      transform: translate3d(0, 0, calc(var(--thickness) * -2px));
      transform-origin: 50% 70%;
    }

    .tipping-button-container .hole::before {
      content: '';
      position: absolute;
      width: 125%;
      height: 40%;
      border-radius: 50%;
      top: 70%;
      left: 50%;
      translate: -50% -50%;
      background: black;
      box-shadow: 0 2px hsl(0 0% 20%) inset;
    }

    .tipping-button-container .hole::after {
      transform-style: preserve-3d;
      content: '';
      background: var(--bg);
      height: 200%;
      top: 0;
      left: 50%;
      translate: -50% 25%;
      width: 121%;
      position: absolute;
      transform: translate3d(0, 0, calc(var(--thickness) * 5px));
      mask: radial-gradient(
        125% 32% at 50% 3%,
        rgba(0, 0, 0, 0) 50%,
        #fff 50%
      );
    }

    .tipping-button-container .coin {
      --depth: 2;
      --detail: hsl(43 97% 46%);
      --face: #ffdc02;
      --side: #f4ae00;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      position: absolute;
      translate: -50% -50%;
      top: 50%;
      left: 50%;
      transform-style: preserve-3d;
    }

    .tipping-button-container .coin__core {
      height: 100%;
      width: calc(var(--depth) * 2px);
      background: var(--side);
      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      transform: rotateY(90deg) rotateX(calc((90 - var(--rx, 0)) * -1deg));
      transform-style: preserve-3d;
    }

    .tipping-button-container .coin__core--rotated {
      --base: 90;
      transform: rotateY(90deg) rotateX(calc((90 - var(--rx, 0)) * 1deg));
    }

    .tipping-button-container .coin__core::after,
    .tipping-button-container .coin__core::before {
      content: '';
      height: 100%;
      width: calc(var(--depth) * 2px);
      background: var(--side);
      position: absolute;
      inset: 0;
      transform-style: preserve-3d;
    }

    .tipping-button-container .coin__core::after {
      transform: rotateX(calc((var(--base, 0) - var(--rx, 0)) * 1deg));
    }
    .tipping-button-container .coin__core::before {
      transform: rotateX(calc((var(--base, 0) - var(--rx, 0)) * -1deg));
    }

    .tipping-button-container .coin__face {
      height: 100%;
      width: 100%;
      position: absolute;
      inset: 0;
      border-radius: 50%;
      transform-style: preserve-3d;
      background: var(--face);
      display: grid;
      place-items: center;
      color: var(--detail);
    }

    .tipping-button-container .coin__face svg {
      width: 65%;
      scale: -1 1;
      translate: -5% 0;
    }

    .tipping-button-container .coin__face::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: var(--side);
      backface-visibility: hidden;
    }

    .tipping-button-container .coin__face--front {
      transform: translate3d(0, 0, calc((var(--depth) * 1px) + 0.5px))
        rotateY(180deg);
    }
    .tipping-button-container .coin__face--rear {
      transform: translate3d(0, 0, calc((var(--depth) * -1px) - 0.5px));
    }
  `}</style>
);
// ====================================================================
// 2. PROPS: Define the component's props for customization.
// ====================================================================
interface TippingButtonProps {
  children?: ReactNode;
  coinIcon?: ReactNode;
  instructionText?: string;
  ariaLabel?: string;
  onTip?: () => void; // Callback for when a tip animation completes
}

// ====================================================================
// 3. COMPONENT: The main reusable component logic.
// ====================================================================
export const TippingButton: FC<TippingButtonProps> = ({
  children = 'Leave tip',
  coinIcon,
  instructionText = 'hold to flip coin',
  ariaLabel = 'Leave a tip',
  onTip,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const purseRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tipSoundRef = useRef<HTMLAudioElement | null>(null);

  // Default coin icon if none is provided
  const defaultCoinIcon = (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>React</title>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-3.5h5v-2h-5v2zm0-3h5v-2h-5v2zm0-3h5v-2h-5v2z" fill="currentColor" />
    </svg>
   );

  useEffect(() => {
    // Initialize the audio only on the client-side
    tipSoundRef.current = new Audio('https://assets.codepen.io/605876/coin.mp3' );
    tipSoundRef.current.volume = 0.4;
    tipSoundRef.current.muted = false;

    const button = buttonRef.current;
    const coin = coinRef.current;
    const purse = purseRef.current;
    const hole = holeRef.current;
    const container = containerRef.current;

    if (!button || !coin || !purse || !hole || !container) return;

    const handleTip = () => {
      if (button.dataset.tipping === 'true') return;

      const currentRotation = gsap.getProperty(button, 'rotate') as number;
      if (currentRotation < 0) {
        container.dataset.flipped = 'true';
      }
      button.dataset.tipping = 'true';

      const duration = gsap.utils.mapRange(0, 15, 0, 0.6)(Math.abs(currentRotation));
      const velocity = gsap.utils.mapRange(0, 15, 300, 700)(Math.abs(currentRotation));
      const bounce = gsap.utils.mapRange(300, 700, 2, 12)(Math.abs(velocity));
      const distanceDuration = gsap.utils.mapRange(100, 350, 0.25, 0.6)(velocity);
      const spin = gsap.utils.snap(1, gsap.utils.mapRange(100, 350, 1, 6)(velocity));
      const offRotate = gsap.utils.random(0, 90, 1) * -1;
      const hangtime = Math.max(1, duration * 4);

      const tl = gsap.timeline({
        onComplete: () => {
          if (tipSoundRef.current && !tipSoundRef.current.muted) {
            tipSoundRef.current.play();
          }
          if (onTip) onTip(); // Fire the callback

          gsap.set(coin, { yPercent: 100 });
          gsap.timeline({
            onComplete: () => {
              gsap.set(button, { clearProps: 'all' });
              gsap.set(coin, { clearProps: 'all' });
              gsap.set(purse, { clearProps: 'all' });
              button.dataset.tipping = 'false';
              container.dataset.flipped = 'false';
            },
          })
          .to(button, { yPercent: bounce, repeat: 1, duration: 0.12, yoyo: true })
          .fromTo(hole, { scale: 1 }, { scale: 0, duration: 0.2, delay: 0.2 })
          .set(coin, { clearProps: 'all', yPercent: -50 })
          .fromTo(purse, { xPercent: -200 }, { delay: 0.5, xPercent: 0, duration: 0.5, ease: 'power1.out' })
          .fromTo(coin, { rotate: -460 }, { rotate: 0, duration: 0.5, ease: 'power1.out' }, '<');
        },
      });

      tl.set(button, { transition: 'none' })
        .fromTo(button, { rotate: currentRotation }, { rotate: 0, duration, ease: 'elastic.out(1.75,0.75)' })
        .to(coin, {
            onUpdate: function () {
              const y = gsap.getProperty(coin, 'y') as number;
              if (y >= coin.offsetHeight) {
                this.progress(1);
                tl.progress(1);
              }
            },
            duration: hangtime,
            physics2D: { velocity, angle: -90, gravity: 1000 },
          }, `>-${duration * 0.825}`
        )
        .fromTo(coin, { rotateX: 0 }, { duration: distanceDuration * 2, rotateX: spin * -360 }, '<')
        .to(coin, { rotateY: offRotate, duration: distanceDuration }, '<')
        .to(coin, { '--rx': offRotate, duration: distanceDuration }, '<')
        .fromTo(hole, { scale: 0 }, { scale: 1, duration: 0.2 }, hangtime * 0.35);
    };

    button.addEventListener('click', handleTip);

    return () => {
      button.removeEventListener('click', handleTip);
    };
  }, [onTip]); // Rerun effect if onTip callback changes

  return (
    <div ref={containerRef} className="tipping-button-container">
      <TippingButtonStyles />
      <span className="arrow arrow--instruction">
        <span>{instructionText}</span>
        <svg viewBox="0 0 97 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M74.568 0.553803C74.0753 0.881909 73.6295 1.4678 73.3713 2.12401C73.1367 2.70991 72.3858 4.67856 71.6584 6.50658C70.9544 8.35803 69.4526 11.8031 68.3498 14.1936C66.1441 19.0214 65.839 20.2167 66.543 21.576C67.4581 23.3337 69.4527 23.9196 71.3064 22.9821C72.4797 22.3728 74.8965 19.5839 76.9615 16.4435C78.8387 13.5843 78.8387 13.6077 78.1113 18.3418C77.3369 23.4275 76.4687 26.2866 74.5915 30.0364C73.254 32.7316 71.8461 34.6299 69.218 37.3485C65.9563 40.6999 62.2254 42.9732 57.4385 44.4965C53.8718 45.6449 52.3935 45.8324 47.2546 45.8324C43.3594 45.8324 42.1158 45.7386 39.9805 45.2933C32.2604 43.7466 25.3382 40.9577 19.4015 36.9735C15.0839 34.0909 12.5028 31.7004 9.80427 27.9975C6.80073 23.9196 4.36038 17.2403 3.72682 11.475C3.37485 8.1471 3.1402 7.32683 2.43624 7.13934C0.770217 6.71749 0.183578 7.77211 0.0193217 11.5219C-0.26226 18.5996 2.55356 27.1304 7.17619 33.1066C13.8403 41.7545 25.432 48.4103 38.901 51.2696C41.6465 51.8555 42.2566 51.9023 47.4893 51.9023C52.3935 51.9023 53.426 51.832 55.5144 51.3867C62.2723 49.9337 68.5375 46.6292 72.949 42.1998C76.0464 39.1296 78.1113 36.2939 79.8946 32.7081C82.1942 28.0912 83.5317 23.3103 84.2591 17.17C84.3999 15.8576 84.6111 14.7795 84.7284 14.7795C84.8223 14.7795 85.4559 15.1311 86.1364 15.5763C88.037 16.7716 90.3835 17.8965 93.5748 19.0918C96.813 20.3339 97.3996 20.287 96.4141 18.9512C94.9123 16.9122 90.055 11.5219 87.1219 8.63926C84.0949 5.66288 83.8368 5.33477 83.5552 4.1864C83.3909 3.48332 83.0155 2.68649 82.6401 2.31151C82.0065 1.6553 80.4109 1.04595 79.9885 1.30375C79.8712 1.37406 79.2845 1.11626 78.6744 0.717845C77.2431 -0.172727 75.7413 -0.243024 74.568 0.553803Z" fill="currentColor" />
        </svg>
      </span>
      <main>
        <button ref={buttonRef} aria-label={ariaLabel} data-tipping="false">
          <span className="content">
            <span className="scene">
              <span ref={holeRef} className="hole"></span>
              <div ref={purseRef} className="purse">
                <div ref={coinRef} className="coin">
                  <div className="coin__face coin__face--front">
                    {coinIcon || defaultCoinIcon}
                  </div>
                  <div className="coin__core"></div>
                  <div className="coin__core coin__core--rotated"></div>
                  <div className="coin__face coin__face--rear">
                    {coinIcon || defaultCoinIcon}
                  </div>
                </div>
              </div>
            </span>
            <span>{children}</span>
          </span>
        </button>
      </main>
    </div>
   );
};
