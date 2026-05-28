import createThreeSlide from '../three/createThreeSlide.js';

export default createThreeSlide({
  steps: [
    ({ el, addHtml, image }) => {
      const publicPath = process.env.PUBLIC_URL || '';
      const seal = image(`${publicPath}/ulb_seal.png`, {
        position: 'absolute',
        right: '-200px',
        bottom: '-220px',
        width: '920px',
        height: '920px',
        maxWidth: '920px',
        maxHeight: '920px',
        opacity: '1',
        transform: 'rotate(-45deg)',
      });

      addHtml(seal, undefined, { fadeIn: false });

      addHtml(el('h1', {
        maxWidth: '980px',
        margin: '0',
        fontSize: '52px',
        lineHeight: '1.02',
      }, 'Practical Evaluation of the Non-Resumable Model'));

      addHtml(el('div', {
        marginTop: '18px',
        fontSize: '28px',
        opacity: '0.88',
      }, 'A feasibility study on real operating systems and hardware'));

      addHtml(el('div', {
        width: '100%',
        height: '3px',
        margin: '28px 0',
        // background: 'rgb(0, 191, 255)',
        background: '#3059ab',
      }));

      addHtml(el('div', {
        fontSize: '24px',
        marginTop: '18px',
      }, 'Basile Donnay'));

      addHtml(el('div', {
        fontSize: '20px',
        color: '#3059ab',
        marginTop: '10px',
      }, 'Supervisor: Joël Goossens — MEMO-F-403'));
    },
  ],
});
