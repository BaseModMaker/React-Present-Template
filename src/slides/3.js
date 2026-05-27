import createThreeSlide from '../three/createThreeSlide.js';

let state = {};

const vw = (value) => `${value}vw`;
const vh = (value) => `${value}vh`;

export default createThreeSlide({
  steps: [
    (api) => {
      const { el, addHtml } = api;

      addHtml(el('h2', {
        margin: '0 0 28px',
        fontSize: '38px',
        color: 'rgb(0, 191, 255)',
        position: 'fixed',
        left: '3%',
        top: '3%',
        transform: 'translateX(-50%)',
      }, '2. The non-resumable model'));

      state = {};

      const panel = el('div', {
        position: 'relative',
        width: '94vw',
        height: '72vh',
        overflow: 'hidden',
        color: '#666',
      });

      state.panel = panel;
      addHtml(panel);

      const title = el('div', {
        position: 'absolute',
        top: vh(3.2),
        left: '0',
        width: '100%',
        textAlign: 'center',
        fontSize: '2.45vw',
        fontWeight: '800',
        letterSpacing: '0.05vw',
        color: 'white',
      }, 'Starting Delay vs Resuming Delay');

      panel.appendChild(title);
      state.title = title;

      function addLine(styles, parent = panel) {
        const line = el('div', {
          position: 'absolute',
          background: '#666',
          ...styles,
        });

        parent.appendChild(line);
        return line;
      }

      function addText(text, styles, parent = panel) {
        const label = el('div', {
          position: 'absolute',
          fontSize: '1.35vw',
          fontWeight: '700',
          color: '#666',
          whiteSpace: 'pre-line',
          ...styles,
        }, text);

        parent.appendChild(label);
        return label;
      }

      function addArrowHead(left, top, rotation = 0, color = '#666', parent = panel) {
        const head = el('div', {
          position: 'absolute',
          left: vw(left),
          top: vh(top),
          width: '0',
          height: '0',
          borderTop: '0.45vh solid transparent',
          borderBottom: '0.45vh solid transparent',
          borderLeft: `0.8vw solid ${color}`,
          transform: `rotate(${rotation}deg)`,
        });

        parent.appendChild(head);
        return head;
      }

      function addBracket({ left, top, width, color = '#666', label }) {
        addLine({
          left: vw(left),
          top: vh(top),
          width: vw(width),
          height: vh(0.22),
          background: color,
        });

        addLine({
          left: vw(left),
          top: vh(top - 1.25),
          width: vw(0.12),
          height: vh(2.5),
          background: color,
        });

        addLine({
          left: vw(left + width),
          top: vh(top - 1.25),
          width: vw(0.12),
          height: vh(2.5),
          background: color,
        });

        addText(label, {
          left: vw(left + width * 0.25),
          top: vh(top - 5),
          color,
          fontSize: '1.45vw',
          fontWeight: '400',
        });
      }

      state.helpers = {
        addLine,
        addText,
        addArrowHead,
        addBracket,
      };

      // X axis
      addLine({
        left: vw(7),
        top: vh(43),
        width: vw(84),
        height: vh(0.25),
      });

      addArrowHead(91, 42.58, 0);

      // Y axis
      addLine({
        left: vw(9),
        top: vh(13),
        width: vw(0.14),
        height: vh(43),
      });

      addArrowHead(8.65, 12.2, -90);

      addText('τ₁', {
        left: vw(4.5),
        top: vh(35),
        fontSize: '1.75vw',
        fontWeight: '500',
        color: 'white',
      });

      addText('ms', {
        right: vw(1),
        top: vh(51),
        fontSize: '1.75vw',
        fontWeight: '700',
        color: '#666',
      });

      state.addBlock = function addBlock({
        label,
        left,
        top = 33.5,
        width,
        height = 9.5,
        fill,
        border,
        color = 'black',
        delay = 0,
      }) {
        const block = el('div', {
          position: 'absolute',
          left: vw(left),
          top: vh(top),
          width: vw(width),
          height: vh(height),
          background: fill,
          border: `0.14vw solid ${border}`,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '1.55vw',
          fontWeight: '500',
          lineHeight: '1.15',
          whiteSpace: 'pre-line',
          opacity: '0',
          transform: 'translateY(2vh)',
          transition: 'all 700ms cubic-bezier(.2,.8,.2,1)',
          boxSizing: 'border-box',
        }, label);

        panel.appendChild(block);

        window.setTimeout(() => {
          block.style.opacity = '1';
          block.style.transform = 'translateY(0)';
        }, delay);

        return block;
      };

      state.labels = {
        release: addText('release', {
          left: vw(8),
          top: vh(51),
          fontSize: '1.55vw',
          color: '#666',
          opacity: '0',
          transition: 'opacity 450ms ease',
        }),

        preempted: addText('preempted', {
          left: vw(30),
          top: vh(51),
          fontSize: '1.55vw',
          color: '#666',
          opacity: '0',
          transition: 'opacity 450ms ease',
        }),

        resumed: addText('resumed', {
          left: vw(50),
          top: vh(51),
          fontSize: '1.55vw',
          color: '#666',
          opacity: '0',
          transition: 'opacity 450ms ease',
        }),

        completion: addText('completion', {
          left: vw(79),
          top: vh(51),
          fontSize: '1.55vw',
          color: '#666',
          opacity: '0',
          transition: 'opacity 450ms ease',
        }),
      };

      state.startingDelay = state.addBlock({
        label: 'starting delay',
        left: 18,
        width: 13,
        fill: '#eeeeee',
        border: '#999',
        delay: 0,
      });

      state.firstExecution = state.addBlock({
        label: 'first\nexecution',
        left: 31,
        width: 12,
        fill: '#dceecf',
        border: '#6d8f63',
        delay: 220,
      });

      state.resumingDelay = state.addBlock({
        label: 'resuming\ndelay',
        left: 47,
        width: 10,
        fill: '#fff1cf',
        border: '#a67c18',
        delay: 440,
      });

      state.continuedExecution = state.addBlock({
        label: 'continued execution',
        left: 57,
        width: 32,
        fill: '#dceecf',
        border: '#6d8f63',
        delay: 660,
      });
    },

    () => {
      const { helpers, labels } = state;
      const { addLine, addArrowHead, addBracket } = helpers;

      Object.values(labels).forEach((label) => {
        label.style.opacity = '1';
      });

      // Release vertical marker
      addLine({
        left: vw(18),
        top: vh(27),
        width: vw(0.14),
        height: vh(16),
        background: '#666',
      });

      addArrowHead(17.65, 26.2, -90, '#666');

      // Resumed vertical marker
      addLine({
        left: vw(57),
        top: vh(27),
        width: vw(0.14),
        height: vh(16),
        background: '#666',
      });

      addArrowHead(56.65, 26.2, -90, '#666');

      // End marker
      addLine({
        left: vw(89),
        top: vh(35),
        width: vw(0.14),
        height: vh(8),
        background: '#666',
      });

      addBracket({
        left: 18,
        top: 19,
        width: 25,
        color: '#777',
        label: 'first execution',
      });

      addBracket({
        left: 47,
        top: 19,
        width: 42,
        color: '#9a6700',
        label: 'second execution',
      });
    },

    (api) => {
      const { el } = api;
      const { panel, helpers } = state;
      const { addLine, addArrowHead, addText } = helpers;

      const annotationLayer = el('div', {
        position: 'absolute',
        inset: '0',
        opacity: '0',
        transition: 'opacity 500ms ease',
      });

      panel.appendChild(annotationLayer);

      requestAnimationFrame(() => {
        annotationLayer.style.opacity = '1';
      });

      function text(text, styles) {
        return addText(text, styles, annotationLayer);
      }

      function line(styles) {
        return addLine(styles, annotationLayer);
      }

      function arrow(left, top, rotation = 0, color = '#666') {
        return addArrowHead(left, top, rotation, color, annotationLayer);
      }

      line({
        left: vw(43),
        top: vh(27.5),
        width: vw(0.14),
        height: vh(15.5),
        background: '#aa5555',
      });

      arrow(42.65, 42.55, 90, '#aa5555');

      // Delay emphasis under blocks
      line({
        left: vw(18),
        top: vh(46),
        width: vw(13),
        height: vh(0.22),
        background: '#999',
      });

      line({
        left: vw(47),
        top: vh(46),
        width: vw(10),
        height: vh(0.22),
        background: '#9a6700',
      });

      text('Examples:\n- loading task state\n- initialization\n- security check', {
        left: vw(19),
        top: vh(47),
        color: '#999',
        fontSize: '1.7vw',
        fontWeight: '700',
        background: '#181a1d',
      });

      text('Examples:\n- restoring context\n- reloading resources\n- validating state', {
        left: vw(47.2),
        top: vh(47),
        color: '#9a6700',
        fontSize: '1.7vw',
        fontWeight: '700',
        background: '#181a1d',
      });
    },

    // add a pill-shaped highlight that says Some operations must restart if they are interrupted
    (api) => {
      const { el } = api;
      const { panel } = state;

      const highlight = el('div', {
        position: 'absolute',
        left: vw(24),
        top: vh(65),
        padding: '0.8vh 1.2vw',
        background: 'rgba(101, 116, 255, 0.9)',
        border: '2px solid rgb(34, 0, 255)',
        borderRadius: '999px',
        color: '#ffffff',
        fontSize: '1.55vw',
        fontWeight: '700',
        opacity: '0',
        transform: 'translateY(-2vh)',
        transition: 'all 700ms cubic-bezier(.2,.8,.2,1)',
      }, 'Some operations must restart if they are interrupted');

      panel.appendChild(highlight);

      requestAnimationFrame(() => {
        highlight.style.opacity = '1';
        highlight.style.transform = 'translateY(0)';
      });
    },
  ],
});