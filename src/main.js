const homeScreen = document.querySelector('[data-screen="home"]');
const ornamentScreen = document.querySelector('[data-screen="ornament"]');
const sceneTrigger = document.querySelector('[data-scene-trigger]');

function openOrnamentScene() {
  homeScreen.hidden = true;
  ornamentScreen.hidden = false;
  ornamentScreen.focus({ preventScroll: true });
}

function closeOrnamentScene() {
  ornamentScreen.hidden = true;
  homeScreen.hidden = false;
  sceneTrigger.focus({ preventScroll: true });
}

sceneTrigger.addEventListener('click', openOrnamentScene);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !ornamentScreen.hidden) closeOrnamentScene();
});
