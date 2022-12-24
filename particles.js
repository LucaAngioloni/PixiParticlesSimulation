const normFactor = 2_000_000; // 2K screen

const createPixiApp = (querySelector, bg = 0x0b1320) => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    resolution: 1,
    autoDensity: true,
    backgroundColor: bg,
  });
  document.querySelector(querySelector).appendChild(app.view);

  return app;
};

const createPixiParticles = (app, properties) => {
  const container = new PIXI.ParticleContainer(100, {
    scale: true,
    position: true,
    rotation: false,
    uvs: false,
    alpha: true,
  });

  app.stage.addChild(container);

  // create an array to store all the sprites
  const particles = [];

  if (properties.density) {
    const screenPixels = app.screen.width * app.screen.height;

    properties.numParticles = Math.floor(
      (screenPixels * properties.numParticles) / normFactor
    );

    properties.size.minSize =
      (Math.sqrt(screenPixels) * properties.size.minSize) /
      Math.sqrt(normFactor);
    properties.size.maxSize =
      (Math.sqrt(screenPixels) * properties.size.maxSize) /
      Math.sqrt(normFactor);

    properties.speed.minSpeed =
      (Math.sqrt(screenPixels) * properties.speed.minSpeed) /
      Math.sqrt(normFactor);
    properties.speed.maxSpeed =
      (Math.sqrt(screenPixels) * properties.speed.maxSpeed) /
      Math.sqrt(normFactor);
  }
  console.log(properties);
  let totalParticles = properties.numParticles;

  console.log(totalParticles);

  for (let i = 0; i < totalParticles; i++) {
    const circleSprite = PIXI.Sprite.from(properties.sprite);
    circleSprite.scale.set(
      properties.size.minSize +
        Math.random() * (properties.size.maxSize - properties.size.minSize)
    );
    circleSprite.x = Math.floor(Math.random() * app.screen.width);
    circleSprite.y = Math.round(Math.random() * app.screen.height);

    circleSprite.anchor.set(0.5);

    // create a random direction in radians
    circleSprite.direction = Math.random() * Math.PI * 2;

    circleSprite.speed =
      properties.speed.minSpeed +
      Math.random() * (properties.speed.maxSpeed - properties.speed.minSpeed);

    circleSprite.alpha =
      properties.alpha.minAlpha +
      Math.random() * (properties.alpha.maxAlpha - properties.alpha.minAlpha);

    particles.push(circleSprite);

    container.addChild(circleSprite);
  }

  return particles;
};

const runPixiSimulation = (app, particles) => {
  let tick = 0;

  const alpha = 0.9;

  let offset = 0;

  app.ticker.add(() => {
    // iterate through the sprites and update their position

    let thisOffset = offset;
    offset = 0;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      // particle.direction =
      //   particle.direction * alpha +
      //   (Math.random() * Math.PI * 2 - Math.PI) * (1 - alpha);
      particle.x += Math.sin(particle.direction) * particle.speed;
      particle.y += Math.cos(particle.direction) * particle.speed - thisOffset;

      if (particle.x < 0) {
        particle.x += app.screen.width;
      } else if (particle.x > app.screen.width) {
        particle.x -= app.screen.width;
      }

      if (particle.y < 0) {
        particle.y += app.screen.height;
      } else if (particle.y > app.screen.height) {
        particle.y -= app.screen.height;
      }
    }

    // console.log(particles[0].x, particles[0].y);

    // increment the ticker
    tick += 0.1;
  });

  document.addEventListener("wheel", (e) => {
    offset += e.deltaY / 5;
  });

  document.addEventListener("resize", (event) => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    // const screenPixels = app.screen.width * app.screen.height;
    // let numParticles = Math.floor(
    //   (screenPixels * particles.length) / normFactor
    // );

    // if (numParticles > particles.length) {
    // }
  });
};
