import createThreeSlide from '../three/createThreeSlide.js';

export default createThreeSlide({
  steps: [
    ({ el, addHtml, grid, card }) => {
      addHtml(el('h2', {
        margin: '0 0 28px',
        fontSize: '38px',
        color: '#ffffff',
        position: 'fixed',
        left: '1.5%',
        top: '1.5%',
        transform: 'translateX(-50%)',
        zIndex: '1',
      }, '6. Expected contribution and deliverables'));

      const layout = grid('1.2fr 1fr');

      layout.appendChild(card('Expected contribution', [
        'Prototype: a practical implementation of restart-on-preemption.',
        'Measurements: experimental data on restart overhead, latency, WCRT, and jitter.',
        'Evaluation: comparison between theoretical expectations and real system behavior.',
      ], { fill: 'rgb(246, 250, 255)' }));

      layout.appendChild(el('div', {
        padding: '28px',
        borderRadius: '20px',
        background: 'rgb(13, 46, 99)',
        color: 'white',
        fontWeight: '800',
        fontSize: '26px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '260px',
      }, 'Final question: is the model only theoretically sound, or also usable in practice?'));

      addHtml(layout);
    },
  ],
});
