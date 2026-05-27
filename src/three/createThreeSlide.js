import * as THREE from 'three';

function createThreeSlide({
  steps = [],
  cameraZ = 5,
  fov = 75,
}) {
  return function runSlide(container) {
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      fov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.z = cameraZ;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const htmlRoot = document.createElement('div');
    htmlRoot.style.position = 'absolute';
    htmlRoot.style.inset = '0';
    htmlRoot.style.pointerEvents = 'none';
    htmlRoot.style.boxSizing = 'border-box';
    htmlRoot.style.padding = '92px 72px 72px';
    htmlRoot.style.color = 'white';
    htmlRoot.style.transition = 'opacity 350ms ease';
    htmlRoot.style.opacity = '1';

    htmlRoot.style.display = 'flex';
    htmlRoot.style.flexDirection = 'column';
    htmlRoot.style.justifyContent = 'center';
    htmlRoot.style.alignItems = 'stretch';

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(htmlRoot);

    const objects = [];
    const htmlObjects = [];
    const animations = [];
    const tweens = [];
    const timeouts = [];

    const clock = new THREE.Clock();

    function setStyles(element, styles = {}) {
      Object.entries(styles).forEach(([key, value]) => {
        element.style[key] = value;
      });

      return element;
    }

    function fadeIn(element, delay = 0) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(16px)';
      element.style.transition = 'opacity 450ms ease, transform 450ms ease';

      const timeoutId = window.setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);

      timeouts.push(timeoutId);

      return element;
    }

    function createElement(tag, styles = {}, text = '') {
      const element = document.createElement(tag);

      if (text) {
        element.textContent = text;
      }

      setStyles(element, styles);

      return element;
    }

    function createCard(title, body, options = {}) {
      const {
        fill = 'rgba(234, 242, 255, 0.96)',
        minHeight = '130px',
        textColor = 'rgb(24, 26, 29)',
      } = options;

      const card = createElement('div', {
        background: fill,
        color: textColor,
        border: '2px solid rgb(0, 191, 255)',
        borderRadius: '18px',
        padding: '22px',
        minHeight,
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.22)',
        boxSizing: 'border-box',
      });

      const heading = createElement('h3', {
        margin: '0 0 12px',
        color: 'rgb(23, 74, 156)',
        fontSize: '24px',
      }, title);

      const content = createElement('div', {
        fontSize: '19px',
        lineHeight: '1.42',
      });

      if (Array.isArray(body)) {
        const list = createElement('ul', {
          margin: '0',
          paddingLeft: '22px',
        });

        body.forEach((item) => {
          const li = createElement('li', {}, item);
          list.appendChild(li);
        });

        content.appendChild(list);
      } else {
        content.textContent = body;
      }

      card.appendChild(heading);
      card.appendChild(content);

      return card;
    }

    function createGrid(columns, gap = '24px') {
      return createElement('div', {
        display: 'grid',
        gridTemplateColumns: columns,
        gap,
        alignItems: 'stretch',
      });
    }

    function createImage(src, styles = {}) {
      const image = createElement('img', {
        width: '100%',
        maxHeight: '310px',
        objectFit: 'contain',
        borderRadius: '14px',
        ...styles,
      });

      image.src = src;
      image.alt = '';

      return image;
    }

    const api = {
      THREE,
      scene,
      camera,
      renderer,
      htmlRoot,

      add(object) {
        scene.add(object);
        objects.push(object);
        return object;
      },

      addHtml(element, parent = htmlRoot, options = {}) {
        parent.appendChild(element);
        htmlObjects.push(element);

        if (options.fadeIn !== false) {
          fadeIn(element, options.delay ?? 0);
        }

        return element;
      },

      el: createElement,
      styles: setStyles,
      card: createCard,
      grid: createGrid,
      image: createImage,

      timeout(fn, delay) {
        const timeoutId = window.setTimeout(fn, delay);
        timeouts.push(timeoutId);
        return timeoutId;
      },

      animate(fn) {
        animations.push(fn);
      },

      tween({ duration = 1000, onUpdate, onComplete }) {
        tweens.push({
          startTime: performance.now(),
          duration,
          onUpdate,
          onComplete,
        });
      },

      spawnBall({
        color = 0xffffff,
        x = 0,
        y = 0,
        z = 0,
        radius = 0.5,
        fadeIn = false,
      }) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: fadeIn,
          opacity: fadeIn ? 0 : 1,
        });

        const ball = new THREE.Mesh(geometry, material);
        ball.position.set(x, y, z);

        scene.add(ball);
        objects.push(ball);

        if (fadeIn) {
          api.tween({
            duration: 600,
            onUpdate(progress) {
              material.opacity = progress;
            },
          });
        }

        return ball;
      },
    };

    let currentStep = 0;
    let animationId;
    let stopped = false;
    let cleaned = false;

    function nextStep() {
      if (currentStep >= steps.length) {
        return false;
      }

      steps[currentStep](api);
      currentStep++;

      return true;
    }

    function animate() {
      if (stopped) return;

      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const now = performance.now();

      animations.forEach((fn) => fn(delta));

      for (let i = tweens.length - 1; i >= 0; i--) {
        const tween = tweens[i];

        const rawProgress = (now - tween.startTime) / tween.duration;
        const progress = Math.min(rawProgress, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        tween.onUpdate(eased);

        if (progress >= 1) {
          if (tween.onComplete) {
            tween.onComplete();
          }

          tweens.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    }

    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      stopped = true;

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      timeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });

      objects.forEach((object) => {
        scene.remove(object);

        object.traverse?.((child) => {
          if (child.geometry) {
            child.geometry.dispose();
          }

          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      if (htmlRoot.parentNode) {
        htmlRoot.parentNode.removeChild(htmlRoot);
      }

      renderer.dispose();
    }

    function fadeOutAndCleanup(duration = 500) {
      return new Promise((resolve) => {
        const fadingMaterials = [];

        objects.forEach((object) => {
          object.traverse?.((child) => {
            if (!child.material) return;

            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material) => {
              material.transparent = true;
              fadingMaterials.push({
                material,
                startOpacity: material.opacity ?? 1,
              });
            });
          });
        });

        htmlRoot.style.opacity = '0';

        api.tween({
          duration,
          onUpdate(progress) {
            const opacity = 1 - progress;

            fadingMaterials.forEach(({ material, startOpacity }) => {
              material.opacity = startOpacity * opacity;
            });
          },
          onComplete() {
            cleanup();
            resolve();
          },
        });
      });
    }

    function handleResize() {
      if (!container.clientWidth || !container.clientHeight) return;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', handleResize);

    const originalCleanup = cleanup;

    function cleanupWithResize() {
      window.removeEventListener('resize', handleResize);
      originalCleanup();
    }

    animate();
    nextStep();

    return {
      nextStep,

      exit() {
        return fadeOutAndCleanup(500);
      },

      cleanup: cleanupWithResize,
    };
  };
}

export default createThreeSlide;
