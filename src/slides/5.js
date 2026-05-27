import createThreeSlide from '../three/createThreeSlide.js';

export default createThreeSlide({
  steps: [
    ({ el, addHtml }) => {
      addHtml(el('h2', {
        margin: '0 0 28px',
        fontSize: '38px',
        color: 'rgb(0, 191, 255)',
        position: 'fixed',
        left: '3%',
        top: '3%',
        transform: 'translateX(-50%)',
      }, '4. Objectives of the project'));

      addHtml(el('div', {
        margin: '32px auto 0',
        maxWidth: '980px',
        padding: '28px',
        borderRadius: '20px',
        background: 'rgba(234, 242, 255, 0.96)',
        color: 'rgb(23, 74, 156)',
        fontWeight: '800',
        fontSize: '26px',
        textAlign: 'center',
      }, 'Evaluate whether the non-resumable model is practically viable.'));
    },

    ({ addHtml, grid, card }) => {
      const metrics = grid('repeat(3, minmax(0, 1fr))');
      metrics.style.marginTop = '34px';

      metrics.appendChild(card('Implement', 'Build a prototype that enforces restart-on-preemption semantics.', {
        minHeight: '180px',
      }));

      metrics.appendChild(card('Measure', 'Quantify preemption latency, restart cost, WCRT, and jitter.', {
        fill: 'rgb(255, 241, 207)',
        minHeight: '180px',
      }));

      metrics.appendChild(card('Compare', 'Compare real measurements with classical scheduling behavior.', {
        fill: 'rgb(239, 255, 241)',
        minHeight: '180px',
      }));

      addHtml(metrics);
    },

    ({ addHtml, card }) => {
      const questions = card('Guiding research questions', [
        'Can the model be implemented without excessive overhead?',
        'Which platform and implementation strategy is most realistic?',
        'Which sources of variability matter most in practice?',
        'How far are measured costs from the theoretical model?',
      ], { fill: 'rgb(246, 250, 255)' });

      questions.style.marginTop = '34px';

      addHtml(questions);
    },
  ],
});
