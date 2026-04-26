/* =====================================================
   AIGuideBook — Tutorial Script
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const modules = document.querySelectorAll('.tutorial-module');
  const progressFill = document.getElementById('progress-fill');
  const stepLabel = document.querySelector('.module-controls__step');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const completeBtn = document.getElementById('complete-btn');
  const completionSection = document.getElementById('completion-section');
  const completionScore = document.getElementById('completion-score');

  if (!modules.length) return;

  let current = 0;
  let score = 0;
  const total = modules.length;
  const answered = new Array(total).fill(false);

  function showModule(idx) {
    modules.forEach(m => m.classList.remove('active'));
    modules[idx].classList.add('active');

    const pct = ((idx + 1) / total) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (stepLabel) stepLabel.textContent = 'Step ' + (idx + 1) + ' of ' + total;

    if (prevBtn) prevBtn.disabled = idx === 0;

    const isLast = idx === total - 1;
    if (nextBtn) nextBtn.style.display = isLast ? 'none' : '';
    if (completeBtn) completeBtn.style.display = isLast ? '' : 'none';

    // scroll to top of module
    const header = document.querySelector('.tutorial-section');
    if (header) header.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) showModule(--current); });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (current < total - 1) showModule(++current); });

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const pct = Math.round((score / total) * 100);
      if (completionScore) completionScore.textContent = pct + '%';
      if (completionSection) {
        completionSection.classList.remove('hidden');
        completionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      completeBtn.disabled = true;
    });
  }

  /* ── Option buttons ── */
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const scenario = btn.closest('.scenario');
      const moduleEl = btn.closest('.tutorial-module');
      const moduleIdx = Array.from(modules).indexOf(moduleEl);

      // disable all options in scenario
      scenario.querySelectorAll('.option-btn').forEach(b => {
        b.disabled = true;
        if (b.dataset.correct === 'true') b.classList.add('correct');
      });

      const isCorrect = btn.dataset.correct === 'true';
      if (!isCorrect) btn.classList.add('incorrect');

      // feedback
      const feedbackEl = scenario.querySelector('.scenario-feedback');
      if (feedbackEl) {
        feedbackEl.textContent = isCorrect
          ? '✓ Correct! ' + (feedbackEl.dataset.correct || 'Great choice — this demonstrates responsible AI use.')
          : '✗ Not quite. ' + (feedbackEl.dataset.incorrect || 'Think about how to use AI to learn, not to bypass learning.');
        feedbackEl.className = 'scenario-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
      }

      // score once per module
      if (!answered[moduleIdx] && isCorrect) {
        score++;
        answered[moduleIdx] = true;
      } else if (!answered[moduleIdx]) {
        answered[moduleIdx] = true; // mark attempted even if wrong
      }
    });
  });

  // initialise
  showModule(0);
});
