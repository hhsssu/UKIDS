import { Route, Routes } from 'react-router-dom';
import CallMyNameMain from '../components/feature/game/CallMyNameMain';
import CallMyNameReady from '../components/feature/game/CallMyNameReady';
import CallMyNameStart from '../components/feature/game/CallMyNameStart';
import CallMyNameResult from '../components/feature/game/CallMyNameResult';
import CallMyNameHistory from '../components/feature/game/CallMyNameHistory';

const CallMyName = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<CallMyNameMain />} />
        <Route path="ready" element={<CallMyNameReady />} />
        <Route path="start" element={<CallMyNameStart />} />
        <Route path="result" element={<CallMyNameResult />} />
        <Route path="history" element={<CallMyNameHistory />} />
      </Routes>
    </>
  );
};

export default CallMyName;
