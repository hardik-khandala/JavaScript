// Get references to elements
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');

// Function to update the displayed content based on the hash
function updateContent() {
  const hash = window.location.hash;

  sections.forEach(section => {
    section.style.display = 'none';
  });

  if (hash) {
    const targetSection = document.querySelector(`#${hash.substring(1)}`);
    targetSection.style.display = 'block';
  } else {
    // Default to the first section
    sections[0].style.display = 'block';
  }
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    const targetHash = link.getAttribute('href');
    window.history.pushState(null, null, targetHash);
    updateContent();
  });
});

// Initial content display
updateContent();

// Listen for popstate event to handle back/forward navigation
window.addEventListener('popstate', updateContent);
