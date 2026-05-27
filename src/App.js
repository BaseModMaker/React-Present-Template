import { useEffect, useRef, useState } from 'react';
import './App.css';
import SharedSlideUI, { backgroundColor } from './slides/_SharedSlideUI_.js';
import usePresentationInputs from './inputs.js';
import useUrlSlideSync, { getSlideIndexFromUrl } from './urlSlideSync.js';

const slideContext = require.context('./slides', false, /\.js$/);

const slides = slideContext
  .keys()
  .filter((path) => path !== './_SharedSlideUI_.js')
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path) => slideContext(path).default);

function App() {
  const containerRef = useRef(null);
  const currentSlideControllerRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const [slideIndex, setSlideIndex] = useState(() =>
    getSlideIndexFromUrl(slides.length)
  );

  useEffect(() => {
    const previousHtmlBackground = document.documentElement.style.backgroundColor;
    const previousBodyBackground = document.body.style.backgroundColor;

    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;

    return () => {
      document.documentElement.style.backgroundColor = previousHtmlBackground;
      document.body.style.backgroundColor = previousBodyBackground;
    };
  }, []);

  useEffect(() => {
    if (currentSlideControllerRef.current?.cleanup) {
      currentSlideControllerRef.current.cleanup();
      currentSlideControllerRef.current = null;
    }

    const slide = slides[slideIndex];

    if (slide && containerRef.current) {
      currentSlideControllerRef.current = slide(containerRef.current);
    }

    return () => {
      if (currentSlideControllerRef.current?.cleanup) {
        currentSlideControllerRef.current.cleanup();
        currentSlideControllerRef.current = null;
      }
    };
  }, [slideIndex]);

  useUrlSlideSync({
    slideIndex,
    setSlideIndex,
    totalSlides: slides.length,
  });

  async function goNext() {
    if (isTransitioningRef.current) return;

    const currentSlide = currentSlideControllerRef.current;

    if (currentSlide?.nextStep) {
      const handledBySlide = currentSlide.nextStep();

      if (handledBySlide) {
        return;
      }
    }

    if (slideIndex >= slides.length - 1) {
      return;
    }

    isTransitioningRef.current = true;

    if (currentSlide?.exit) {
      await currentSlide.exit();
      currentSlideControllerRef.current = null;
    }

    setSlideIndex((current) => Math.min(current + 1, slides.length - 1));

    isTransitioningRef.current = false;
  }

  function goPrevious() {
    const currentSlide = currentSlideControllerRef.current;

    if (currentSlide?.previousStep) {
      const handledBySlide = currentSlide.previousStep();

      if (handledBySlide) {
        return;
      }
    }

    setSlideIndex((current) => Math.max(current - 1, 0));
  }

  function goNextSlide() {
    if (isTransitioningRef.current) return;

    if (slideIndex >= slides.length - 1) {
      return;
    }

    const currentSlide = currentSlideControllerRef.current;

    if (currentSlide?.cleanup) {
      currentSlide.cleanup();
      currentSlideControllerRef.current = null;
    }

    setSlideIndex((current) => Math.min(current + 1, slides.length - 1));
  }

  function goPreviousSlide() {
    if (isTransitioningRef.current) return;

    if (slideIndex <= 0) {
      return;
    }

    const currentSlide = currentSlideControllerRef.current;

    if (currentSlide?.cleanup) {
      currentSlide.cleanup();
      currentSlideControllerRef.current = null;
    }

    setSlideIndex((current) => Math.max(current - 1, 0));
  }

  usePresentationInputs({
    goNext,
    goPrevious,
    goNextSlide,
    goPreviousSlide,
  });

  return (
    <div className="App">
      <div ref={containerRef} className="slide-container" />

      <SharedSlideUI
        currentSlide={slideIndex + 1}
        totalSlides={slides.length}
      />
    </div>
  );
}

export default App;