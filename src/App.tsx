
import { Main } from './components/base/Main';
import { usePreventNativeZoom } from './hooks/usePreventNativeZoom';

function App() {
  usePreventNativeZoom();

  return (
    <div className='workspace-area'>
      <Main />
    </div>
  );
}

export default App;
