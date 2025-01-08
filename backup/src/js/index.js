// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  initializeDropZone();
  initializeNavigation();
});

// Gestion de la zone de dépôt
function initializeDropZone() {
  const dropzone = document.getElementById('dropzone');
  const uploadBtn = dropzone.querySelector('.upload-btn');

  // Gestion du drag & drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Mise en surbrillance pendant le survol
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropzone.classList.add('highlight');
  }

  function unhighlight() {
    dropzone.classList.remove('highlight');
  }

  // Gestion du dépôt de fichiers
  dropzone.addEventListener('drop', handleDrop, false);
  uploadBtn.addEventListener('click', handleClick, false);
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function handleClick() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = e => {
    const files = e.target.files;
    handleFiles(files);
  };
  input.click();
}

function handleFiles(files) {
  // TODO: Implémenter la gestion des fichiers
  console.log('Fichiers reçus:', files);
}

// Gestion de la navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.getAttribute('href').substring(1);
      console.log(`Navigation vers la section: ${section}`);
      // TODO: Implémenter la navigation
    });
  });
}
