const { useState, useEffect } = React;

function GoLiveWidget() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [camera, setCamera] = useState(true);
  const [microphone, setMicrophone] = useState(true);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openModal}
          className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 animate-pulse"
        >
          Go Live
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 max-w-sm transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Start Live Stream</h2>
              <button onClick={closeModal} className="text-gray-500 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Stream Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="gaming">Gaming</option>
                <option value="chatting">Chatting</option>
                <option value="music">Music</option>
              </select>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={camera}
                    onChange={(e) => setCamera(e.target.checked)}
                  />
                  Camera
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={microphone}
                    onChange={(e) => setMicrophone(e.target.checked)}
                  />
                  Microphone
                </label>
              </div>
              <button
                className="w-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-2 rounded-lg shadow"
              >
                Start Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

document.addEventListener('DOMContentLoaded', function () {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(<GoLiveWidget />, container);
});
