import { Routes, Route } from 'react-router-dom';
import QuizMain from '@components/feature/game/QuizMain';
import QuizReady from '@components/feature/game/QuizReady';
import QuizStart from '@components/feature/game/QuizStart';
import QuizResult from '@components/feature/game/QuizResult';
import QuizQnA from '@components/feature/game/QuizQnA';
import QuizHistory from '@components/feature/game/QuizHistory';
import QuizQuestion from '@components/feature/game/QuizQuestion';

const Quiz = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<QuizMain />} />
        <Route path="ready" element={<QuizReady />} />
        <Route path="start" element={<QuizStart />} />
        <Route path="result" element={<QuizResult />} />
        <Route path="qna" element={<QuizQnA />} />
        <Route path="question" element={<QuizQuestion />} />
        <Route path="history" element={<QuizHistory />} />
      </Routes>
    </>
  );
};

export default Quiz;
