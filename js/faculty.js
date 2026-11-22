/* Faculty profile pop-out.
   Clicking (or pressing Enter/Space on) a faculty card opens a <dialog>
   filled with that card's name, position, degrees and photo.
   Expertise, research, teaching and bio stay "To follow" until confirmed. */
document.addEventListener('DOMContentLoaded', function () {
  var pop = document.getElementById('profile-pop');
  if (!pop || typeof pop.showModal !== 'function') return;

  var photo = document.getElementById('pp-photo');
  var lastCard = null;

  function fill(card) {
    var name = card.querySelector('h3').textContent;
    document.getElementById('pp-name').textContent = name;
    document.getElementById('pp-pos').textContent = card.querySelector('.pos').textContent;
    document.getElementById('pp-id').textContent = card.querySelector('.id').textContent;

    // Degrees: full names from the badge titles.
    var degs = Array.prototype.map.call(card.querySelectorAll('.deg'), function (d) {
      return d.getAttribute('title') || d.textContent;
    });
    document.getElementById('pp-degs').textContent = degs.join(', ');

    // Photo: real image if the card has one, otherwise the initials.
    photo.textContent = '';
    var img = card.querySelector('img.av');
    if (img) {
      var big = document.createElement('img');
      big.src = img.src;
      big.alt = '';
      photo.appendChild(big);
      photo.setAttribute('aria-label', 'Photo of ' + name);
    } else {
      photo.textContent = card.querySelector('.av').textContent;
      photo.setAttribute('aria-label', 'Photo of ' + name + ' (placeholder)');
    }
  }

  function open(card) {
    lastCard = card;
    fill(card);
    pop.showModal();
  }

  document.querySelectorAll('.fac').forEach(function (card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', function () { open(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  pop.querySelector('.pp-close').addEventListener('click', function () { pop.close(); });
  // Click on the backdrop (outside the panel) closes it.
  pop.addEventListener('click', function (e) { if (e.target === pop) pop.close(); });
  pop.addEventListener('close', function () { if (lastCard) lastCard.focus(); });
});
