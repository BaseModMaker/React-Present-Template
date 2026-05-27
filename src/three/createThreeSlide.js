import * as THREE from 'three';

function createThreeSlide({ steps = [], cameraZ = 5}) {
  return function runSlide(container) {
    const scene = new THREE.Scene();
    
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      75,
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

    const objects = [];
    const animations = [];
    const tweens = [];

    const clock = new THREE.Clock();

    const api = {
      THREE,
      scene,
      camera,
      renderer,

      add(object) {
        scene.add(object);
        objects.push(object);
        return object;
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

    animate();
    nextStep();

    function cleanup() {
      stopped = true;

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

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

    return {
      nextStep,

      exit() {
        return fadeOutAndCleanup(500);
      },

      cleanup,
    };
    };
}

export default createThreeSlide;