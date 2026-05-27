import './_SharedSlideUI_.css';

export const backgroundColor = 'rgb(24, 26, 29)';
export const lightblue = 'rgb(0, 191, 255)';
// set font to roboto mono for all slides
export const fontFamily = '"Roboto Mono", monospace';

function SharedSlideUI({ currentSlide, totalSlides }) {
  const progress =
    totalSlides <= 1
      ? 100
      : ((currentSlide - 1) / (totalSlides - 1)) * 100;

  return (
    <div className="shared-slide-ui">
      <header className="slide-header">
        <span> </span>
        <span>
          {currentSlide} / {totalSlides}
        </span>
      </header>

      <div className="slide-progress-bar">
        <div
          className="slide-progress-bar-fill"
          style={{
            width: `${progress}%`,
            background: lightblue,
          }}
        />
      </div>
    </div>
  );
}

export default SharedSlideUI;