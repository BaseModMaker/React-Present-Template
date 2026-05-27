import { useEffect } from 'react';

function usePresentationInputs({ goNext, goPrevious, goNextSlide, goPreviousSlide }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === 'ArrowRight') {
        if (event.shiftKey) {
          goNextSlide();
        } else {
          goNext();
        }
      }

      if (event.code === 'ArrowLeft') {
        if (event.shiftKey) {
          goPreviousSlide();
        } else {
          goPrevious();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [goNext, goPrevious, goNextSlide, goPreviousSlide]);
}

export default usePresentationInputs;