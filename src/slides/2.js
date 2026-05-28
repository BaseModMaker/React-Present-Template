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
        color: '#ffffff',
        position: 'fixed',
        left: '1.5%',
        top: '1.5%',
        transform: 'translateX(-50%)',
        zIndex: '1',
      }, '1. Situation in the domain'));

      state = {};

      const panel = el('div', {
        position: 'relative',
        width: '94vw',
        height: '62vh',
        overflow: 'hidden',
      });

      state.panel = panel;

      const title = el('div', {
        position: 'absolute',
        top: vh(3.2),
        left: '0',
        width: '100%',
        textAlign: 'center',
        fontSize: '2.35vw',
        fontWeight: '800',
        letterSpacing: '0.05vw',
      }, 'Execution timeline: Tasks A → B → C');

      state.title = title;
      panel.appendChild(title);

      const subtitle = el('div', {
        position: 'absolute',
        top: vh(8.8),
        left: '0',
        width: '100%',
        textAlign: 'center',
        fontSize: '1.35vw',
        color: '#888',
      }, 'first: idealized tasks, then real execution overhead');

      state.subtitle = subtitle;
      panel.appendChild(subtitle);

      addHtml(panel);

      function task(label, fill, border, left, delay) {
        const block = el('div', {
          position: 'absolute',
          left: vw(left),
          top: vh(27),
          width: vw(12),
          height: vh(9),
          background: fill,
          border: `0.14vw solid ${border}`,
          display: 'flex',
          color: 'black',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.55vw',
          fontWeight: '500',
          opacity: '0',
          transform: 'translateY(2vh)',
          transition: 'all 700ms cubic-bezier(.2,.8,.2,1)',
          boxSizing: 'border-box',
        }, `Task ${label}`);

        panel.appendChild(block);

        window.setTimeout(() => {
          block.style.opacity = '1';
          block.style.transform = 'translateY(0)';
        }, delay);

        return block;
      }

      state.tasks = {
        A: task('A', '#dceecf', '#6d8f63', 28, 0),
        B: task('B', '#dbe8f8', '#416ba8', 42, 220),
        C: task('C', '#fff4d7', '#a67c18', 56, 440),
      };
    },

    (api) => {
      const { el } = api;
      const { panel, tasks, title, subtitle } = state;

      if (!panel || !tasks || !title || !subtitle) return;

      title.textContent = 'Idealized Execution: Tasks A → B → C';
      subtitle.textContent = 'idealized continuous execution — no interrupts, no jitter, no context-switch cost';

      const idealLayer = el('div', {
        position: 'absolute',
        inset: '0',
        opacity: '1',
        transition: 'opacity 450ms ease',
      });

      panel.appendChild(idealLayer);
      state.idealLayer = idealLayer;

      function addLine(styles, parent = idealLayer) {
        const line = el('div', {
          position: 'absolute',
          background: '#000000',
          ...styles,
        });

        parent.appendChild(line);
        return line;
      }

      function addText(text, styles, parent = idealLayer) {
        const label = el('div', {
          position: 'absolute',
          fontSize: '1.35vw',
          fontWeight: '700',
          ...styles,
        }, text);

        parent.appendChild(label);
        return label;
      }

      function addArrowHead(left, top, rotation = 0, color = '#000', parent = idealLayer) {
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

      state.helpers = {
        addLine,
        addText,
        addArrowHead,
      };

      // Main x-axis
      addLine({
        left: vw(7),
        top: vh(43),
        width: vw(84),
        height: vh(0.25),
      });

      addArrowHead(91, 42.58, 0);

      // CPU y-axis
      addLine({
        left: vw(10),
        top: vh(14),
        width: vw(0.14),
        height: vh(36),
      });

      addArrowHead(9.65, 13.2, -90);

      addText('CPU', {
        left: vw(5),
        top: vh(35.8),
        fontSize: '1.65vw',
        fontWeight: '500',
      });

      addText('ms', {
        right: vw(1),
        top: vh(45),
        fontSize: '1.75vw',
        fontWeight: '700',
      });

      // Top bracket
      addLine({
        left: vw(13),
        top: vh(21),
        width: vw(67),
        height: vh(0.22),
      });

      addLine({
        left: vw(13),
        top: vh(19.7),
        width: vw(0.14),
        height: vh(3),
      });

      addLine({
        left: vw(80),
        top: vh(19.7),
        width: vw(0.14),
        height: vh(3),
      });

      addText('idealized continuous execution', {
        left: vw(33),
        top: vh(14.5),
        color: '#888',
        fontSize: '1.55vw',
        fontWeight: '400',
      });

      // Completion arrow
      addLine({
        left: vw(80),
        top: vh(27),
        width: vw(0.14),
        height: vh(16),
      });

      addArrowHead(79.65, 42.55, 90);

      const timelineTop = 33.5;
      const height = 9.5;

      tasks.A.style.left = vw(13);
      tasks.A.style.top = vh(timelineTop);
      tasks.A.style.width = vw(23);
      tasks.A.style.height = vh(height);

      tasks.B.style.left = vw(36);
      tasks.B.style.top = vh(timelineTop);
      tasks.B.style.width = vw(18.5);
      tasks.B.style.height = vh(height);

      tasks.C.style.left = vw(54.5);
      tasks.C.style.top = vh(timelineTop);
      tasks.C.style.width = vw(25.5);
      tasks.C.style.height = vh(height);

      addText('start', {
        left: vw(10.4),
        top: vh(50),
        fontSize: '1.55vw',
      });

      addText('A done', {
        left: vw(32.5),
        top: vh(50),
        fontSize: '1.55vw',
      });

      addText('B done', {
        left: vw(50),
        top: vh(50),
        fontSize: '1.55vw',
      });

      addText('C done', {
        left: vw(76),
        top: vh(50),
        fontSize: '1.55vw',
      });
    },

    (api) => {
      const { el } = api;
      const { panel, tasks, title, subtitle, idealLayer } = state;

      if (!panel || !tasks || !title || !subtitle) return;

      title.textContent = 'Real Execution: Interrupts, Jitter, and Context Switches';
      subtitle.textContent = 'observed response time includes overhead and interference';

      if (idealLayer) {
        idealLayer.style.opacity = '0';
      }

      Object.values(tasks).forEach((task) => {
        task.style.opacity = '0';
        task.style.transform = 'translateY(2vh)';
      });

      const realLayer = el('div', {
        position: 'absolute',
        inset: '0',
        opacity: '0',
        transition: 'opacity 450ms ease',
      });

      panel.appendChild(realLayer);

      requestAnimationFrame(() => {
        realLayer.style.opacity = '1';
      });

      function addLine(styles, parent = realLayer) {
        const line = el('div', {
          position: 'absolute',
          background: '#000000',
          ...styles,
        });

        parent.appendChild(line);
        return line;
      }

      function addText(text, styles, parent = realLayer) {
        const label = el('div', {
          position: 'absolute',
          fontSize: '1.35vw',
          fontWeight: '700',
          color: '#000000',
          ...styles,
        }, text);

        parent.appendChild(label);
        return label;
      }

      function addArrowHead(left, top, rotation = 0, color = '#000000', parent = realLayer) {
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

      function addFragment({
        label,
        left,
        width,
        fill,
        border,
        top = 33.5,
        height = 9.5,
        delay = 0,
        striped = false,
        dotted = false,
        color = 'black',
      }) {
        const block = el('div', {
          position: 'absolute',
          left: vw(left),
          top: vh(top),
          width: vw(width),
          height: vh(height),
          background: fill,
          border: `0.14vw solid ${border}`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4vw',
          fontWeight: '500',
          opacity: '0',
          transform: 'translateY(1.8vh)',
          transition: 'all 550ms cubic-bezier(.2,.8,.2,1)',
          boxSizing: 'border-box',
        }, label);

        if (striped) {
          block.style.background = `repeating-linear-gradient(
            -45deg,
            ${fill},
            ${fill} 0.65vw,
            rgba(255,255,255,0.75) 0.65vw,
            rgba(255,255,255,0.75) 1.3vw
          )`;
        }

        if (dotted) {
          block.style.background = `radial-gradient(${border} 0.12vw, transparent 0.12vw), ${fill}`;
          block.style.backgroundSize = '0.85vw 0.85vw';
        }

        realLayer.appendChild(block);

        window.setTimeout(() => {
          block.style.opacity = '1';
          block.style.transform = 'translateY(0)';
        }, delay);

        return block;
      }

      // Main x-axis
      addLine({
        left: vw(7),
        top: vh(43),
        width: vw(84),
        height: vh(0.25),
      });

      addArrowHead(91, 42.58, 0);

      // CPU y-axis
      addLine({
        left: vw(10),
        top: vh(14),
        width: vw(0.14),
        height: vh(36),
      });

      addArrowHead(9.65, 13.2, -90);

      addText('CPU', {
        left: vw(5),
        top: vh(35.8),
        fontSize: '1.65vw',
        fontWeight: '500',
      });

      addText('ms', {
        right: vw(1),
        top: vh(45),
        fontSize: '1.75vw',
        fontWeight: '700',
      });

      // Real response-time bracket
      addLine({
        left: vw(13),
        top: vh(14.5),
        width: vw(79),
        height: vh(0.22),
      });

      addLine({
        left: vw(13),
        top: vh(13.2),
        width: vw(0.14),
        height: vh(3),
      });

      addLine({
        left: vw(92),
        top: vh(13.2),
        width: vw(0.14),
        height: vh(3),
      });

      // Real completion arrow
      addLine({
        left: vw(92),
        top: vh(29),
        width: vw(0.14),
        height: vh(14),
      });

      addArrowHead(91.65, 42.55, 90);

      // Fragments
      addFragment({
        label: 'Task A',
        left: 13,
        width: 9,
        fill: '#dceecf',
        border: '#6d8f63',
        delay: 0,
      });

      addFragment({
        label: 'IRQ',
        left: 22,
        width: 4,
        fill: '#fff5f5',
        border: '#aa5555',
        striped: true,
        delay: 120,
      });

      addFragment({
        label: 'ctx',
        left: 26,
        width: 3.6,
        fill: '#eeeeee',
        border: '#888',
        dotted: true,
        delay: 240,
      });

      addFragment({
        label: 'Task A',
        left: 29.6,
        width: 8,
        fill: '#dceecf',
        border: '#6d8f63',
        delay: 360,
      });

      addFragment({
        label: 'Task B',
        left: 42,
        width: 12.5,
        fill: '#dbe8f8',
        border: '#416ba8',
        delay: 520,
      });

      addFragment({
        label: 'IRQ',
        left: 54.5,
        width: 4.2,
        fill: '#fff5f5',
        border: '#aa5555',
        striped: true,
        delay: 660,
      });

      addFragment({
        label: 'ctx',
        left: 58.7,
        width: 3.2,
        fill: '#eeeeee',
        border: '#888',
        dotted: true,
        delay: 780,
      });

      addFragment({
        label: 'B',
        left: 61.9,
        width: 4.1,
        fill: '#dbe8f8',
        border: '#416ba8',
        delay: 900,
      });

      addFragment({
        label: 'Task C',
        left: 66,
        width: 9.3,
        fill: '#fff4d7',
        border: '#a67c18',
        delay: 1020,
      });

      addFragment({
        label: 'ctx',
        left: 79,
        width: 3.2,
        fill: '#eeeeee',
        border: '#888',
        dotted: true,
        delay: 1160,
      });

      addFragment({
        label: 'Task C',
        left: 82.2,
        width: 9.8,
        fill: '#fff4d7',
        border: '#a67c18',
        delay: 1280,
      });

      // Bottom labels
      addText('release', {
        left: vw(9),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      addText('IRQ', {
        left: vw(20.5),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      addText('resume', {
        left: vw(26.5),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      addText('dispatch B', {
        left: vw(38),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      addText('IRQ', {
        left: vw(52.8),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      addText('dispatch C', {
        left: vw(60),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      addText('completion', {
        left: vw(86),
        top: vh(50.8),
        fontSize: '1.45vw',
      });

      // Jitter annotation 1
      addText('dispatch jitter', {
        left: vw(33.5),
        top: vh(24),
        color: '#aa5555',
        fontSize: '1.15vw',
        fontWeight: '400',
      });

      addLine({
        left: vw(37),
        top: vh(29),
        width: vw(4.5),
        height: vh(0.22),
        background: '#aa5555',
      });

      addLine({
        left: vw(37),
        top: vh(27.5),
        width: vw(0.12),
        height: vh(3),
        background: '#aa5555',
      });

      addLine({
        left: vw(41.5),
        top: vh(27.5),
        width: vw(0.12),
        height: vh(3),
        background: '#aa5555',
      });

      // Jitter annotation 2
      addText('cache / scheduler jitter', {
        left: vw(63.5),
        top: vh(24),
        color: '#aa5555',
        fontSize: '1.15vw',
        fontWeight: '400',
      });

      addLine({
        left: vw(74.8),
        top: vh(29),
        width: vw(4.2),
        height: vh(0.22),
        background: '#aa5555',
      });

      addLine({
        left: vw(74.8),
        top: vh(27.5),
        width: vw(0.12),
        height: vh(3),
        background: '#aa5555',
      });

      addLine({
        left: vw(79),
        top: vh(27.5),
        width: vw(0.12),
        height: vh(3),
        background: '#aa5555',
      });

      // IRQ arrows
      addLine({
        left: vw(22),
        top: vh(29.2),
        width: vw(0.12),
        height: vh(13.8),
        background: '#aa5555',
      });

      addArrowHead(21.65, 42.55, 90, '#aa5555');

      addLine({
        left: vw(54.5),
        top: vh(29.2),
        width: vw(0.12),
        height: vh(13.8),
        background: '#aa5555',
      });

      addArrowHead(54.15, 42.55, 90, '#aa5555');
    },
  ],
});