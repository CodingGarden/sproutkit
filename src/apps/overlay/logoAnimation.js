async function startAnmiation() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const logo = document.querySelector('#logo');
  logo.style.opacity = '1';

  const state = {
    position: {
      x: (window.innerWidth / 2) - (logo.clientWidth / 2),
      y: (window.innerHeight / 2) - (logo.clientHeight / 2),
    },
    velocity: {
      x: 1,
      y: -1,
    },
  };

  function draw() {
    logo.style.top = `${state.position.y}px`;
    logo.style.left = `${state.position.x}px`;
  }

  function update() {
    state.position.y += (state.velocity.y * 2);
    state.position.x += (state.velocity.x * 2);
  }

  function random() {
    return 0;
    if (Math.random() > 0.5) return 0;
    return (Math.random() * (Math.random() > 0.5 ? -1 : 1)) / 2;
  }

  function collisionCheck() {
    if (state.position.x + logo.clientWidth >= window.innerWidth) {
      state.velocity.x = -state.velocity.x + random();
    } else if (state.position.x <= 0) {
      state.velocity.x = -state.velocity.x + random();
    }

    if (state.position.y <= 0) {
      state.velocity.y = -state.velocity.y + random();
    } else if (state.position.y + logo.clientHeight >= window.innerHeight) {
      state.velocity.y = -state.velocity.y + random();
    }
  }

  function gameLoop() {
    update();
    draw();
    collisionCheck();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

window.startAnmiation = startAnmiation;
