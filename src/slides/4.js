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
      }, '3. What is known, and what is missing'));

      const comparison = grid('1fr auto 1fr');
      comparison.style.alignItems = 'center';

      comparison.appendChild(card('Theory already provides', [
        'schedulability reasoning',
        'finite simulation intervals',
        'response-time bounds',
        'starting/resuming delay models',
        'more realistic preemption costs',
      ], { fill: 'rgb(239, 255, 241)', borderColor: 'rgb(0, 177, 21)' }));

      comparison.appendChild(el('div', {
        fontSize: '58px',
        color: '#3059ab',
        fontWeight: '800',
      }, '→'));

      comparison.appendChild(card('But practice is unclear', [
        'real overhead on operating systems',
        'effect of hardware and kernel jitter',
        'user-space vs kernel implementation',
        'difference between measured and predicted costs',
        'practical feasibility',
      ], { fill: 'rgb(255, 230, 230)', borderColor: 'rgb(255, 0, 0)' }));

      addHtml(comparison);
    },

    ({ el, addHtml }) => {
      addHtml(el('div', {
        margin: '32px auto 0',
        maxWidth: '980px',
        padding: '28px',
        borderRadius: '20px',
        background: 'rgb(13, 46, 99)',
        color: 'white',
        fontWeight: '800',
        fontSize: '26px',
        textAlign: 'center',
      }, 'Research gap: from theoretical model to measurable system behavior'));
    },
  ],
});
