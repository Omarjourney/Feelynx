(function() {
  function createElement(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (key === 'class') el.className = value;
        else if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (value !== false) {
          el.setAttribute(key, value === true ? '' : value);
        }
      }
    }
    children.flat().forEach(child => {
      if (child == null) return;
      if (typeof child === 'string') child = document.createTextNode(child);
      el.appendChild(child);
    });
    return el;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const button = createElement('button', {
      class: 'bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 animate-pulse'
    }, 'Go Live');
    const buttonWrapper = createElement('div', { class: 'fixed bottom-6 right-6 z-50' }, button);

    const overlay = createElement('div', { class: 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 hidden' });
    const modal = createElement('div', { class: 'bg-white rounded-lg p-6 w-11/12 max-w-sm transform transition-all duration-300' });
    overlay.appendChild(modal);

    const closeBtn = createElement('button', { class: 'text-gray-500 text-2xl leading-none' }, '\u00d7');
    const header = createElement('div', { class: 'flex justify-between items-center mb-4' },
      createElement('h2', { class: 'text-xl font-semibold' }, 'Start Live Stream'),
      closeBtn
    );

    const titleInput = createElement('input', { id: 'goLiveTitle', class: 'w-full border rounded px-3 py-2', placeholder: 'Stream Title' });
    const select = createElement('select', { id: 'goLiveCategory', class: 'w-full border rounded px-3 py-2' },
      createElement('option', { value: 'general' }, 'General'),
      createElement('option', { value: 'gaming' }, 'Gaming'),
      createElement('option', { value: 'chatting' }, 'Chatting'),
      createElement('option', { value: 'music' }, 'Music')
    );

    const cameraCheck = createElement('input', { type: 'checkbox', class: 'mr-2', id: 'goLiveCamera', checked: true });
    const micCheck = createElement('input', { type: 'checkbox', class: 'mr-2', id: 'goLiveMicrophone', checked: true });
    const controls = createElement('div', { class: 'flex items-center space-x-4' },
      createElement('label', { class: 'flex items-center' }, cameraCheck, 'Camera'),
      createElement('label', { class: 'flex items-center' }, micCheck, 'Microphone')
    );

    const startBtn = createElement('button', {
      class: 'w-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-2 rounded-lg shadow'
    }, 'Start Stream');

    const body = createElement('div', { class: 'space-y-4' }, titleInput, select, controls, startBtn);
    modal.appendChild(header);
    modal.appendChild(body);

    function openModal() { overlay.classList.remove('hidden'); }
    function closeModal() { overlay.classList.add('hidden'); }

    button.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { e.stopPropagation(); });

    container.appendChild(buttonWrapper);
    container.appendChild(overlay);
  });
})();
