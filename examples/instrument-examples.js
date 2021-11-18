function debug(str) {
  console.log(`EXAMPLE RUNNER: ${str}`); // eslint-ignore-line no-console
}

function formatCode(str, lang) {
  let lines = str
    .replace(/^\n+/, '')
    .replace(/[\n\t ]+$/, '')
    .split(/\n/);

  const firstLineIndent = lines[0].match(/^[\t ]+/);
  if (firstLineIndent) {
    const indentRemoval = new RegExp(firstLineIndent[0], 'g');
    lines = lines.map((line) => line.replace(indentRemoval, ''));
  }

  if (lang === 'javascript') {
    lines = lines.map((line) => `\t${line}`);
    lines.unshift('<script>');
    lines.push('</script>');
  }

  return lines.join('\n');
}

function createRunner(button, runFunc, resetFunc) {
  let running = true;

  return function toggle(reset) {
    running = !running;

    button.blur();
    button.classList.toggle('secondary', running);
    button.onclick = null;
    button.setAttribute('aria-busy', running);
    button.textContent = running ? 'Running...' : 'Run example';

    resetFunc(reset);

    if (!running) {
      button.onclick = async () => {
        toggle(true);
        await runFunc();
        toggle(false);
      };
    }
  };
}

function instrumentExamples() {
  const buttons = document.querySelectorAll('[data-run-script]');

  [...buttons].forEach((el) => {
    const script = document.querySelector(`#${el.dataset.runScript}`);
    const output = document.querySelector(`#${el.dataset.clearOutput}`);

    if (!script) {
      debug('No script found, skipping...');
      return;
    }

    // Make the script ready to execute.
    const lines = script.textContent.split('\n');
    lines[lines.length - 1] = `return ${lines[lines.length - 1]}`;
    const evalReady = `(function(){${lines.join('\n')}})()`;
    const runFunc = () => eval(evalReady);

    createRunner(el, runFunc, output)(false);
  });
}

instrumentExamples();
