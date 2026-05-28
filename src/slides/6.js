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
      }, '5. Project plan'));

      const plan = grid('repeat(3, minmax(0, 1fr))');

      plan.appendChild(card('Platforms', [
        'embedded RTOS',
        'Linux PREEMPT_RT',
        'bare-metal reference',
        'virtual machines only for exploration',
      ], { fill: 'rgb(246, 250, 255)', borderColor: 'rgb(91, 140, 201)' }));

      plan.appendChild(card('Workloads', [
        'mixed periodic/aperiodic tasks',
        'different interruption points',
        'light and heavy load',
      ], { fill: 'rgb(255, 241, 207)', borderColor: 'rgb(255, 166, 0)' }));

      plan.appendChild(card('Measurements', [
        'ftrace / cyclictest on Linux',
        'hardware timers on RTOS',
        'GPIO + oscilloscope if possible',
        'repeated runs under controlled conditions',
      ], { fill: 'rgb(239, 255, 241)', borderColor: 'rgb(0, 177, 21)' }));

      addHtml(plan);
    },

    ({ el, addHtml }) => {
      addHtml(el('div', {
        border: '2px solid #3059ab',
        borderRadius: '18px',
        padding: '22px',
        fontSize: '24px',
        background: 'rgba(234, 242, 255, 0.12)',
        marginTop: '36px',
      }, 'Baseline comparison: same workload, same hardware, but classical preemptive or non-preemptive behavior.'));
    },
  ],
});
