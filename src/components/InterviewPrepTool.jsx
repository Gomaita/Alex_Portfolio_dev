import { useMemo, useState } from 'react'
import { interviewQuestions } from '../data/interviewQuestions'

const categories = ['All', 'JavaScript', 'React', 'SQL', 'Git']

function InterviewPrepTool() {
  const [category, setCategory] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const questions = useMemo(() => {
    const filtered =
      category === 'All'
        ? interviewQuestions
        : interviewQuestions.filter((question) => question.category === category)

    return filtered.length > 0 ? filtered : interviewQuestions
  }, [category])

  const currentQuestion = questions[currentIndex % questions.length]

  function changeCategory(nextCategory) {
    setCategory(nextCategory)
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  function nextQuestion() {
    setCurrentIndex((index) => (index + 1) % questions.length)
    setShowAnswer(false)
  }

  return (
    <section className="border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Interview Prep
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">
              Small technical question practice
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              A lightweight study tool for reviewing junior-level JavaScript,
              React, SQL and Git concepts.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeCategory(item)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    category === item
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <article className="rounded-md border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-semibold text-cyan-200">
              Question {currentIndex + 1} of {questions.length} ·{' '}
              {currentQuestion.category}
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              {currentQuestion.question}
            </h3>
            {showAnswer ? (
              <p className="mt-5 rounded-md border border-cyan-300/20 bg-cyan-300/10 p-4 leading-7 text-slate-200">
                {currentQuestion.answer}
              </p>
            ) : (
              <p className="mt-5 text-slate-400">
                Try answering out loud before revealing the explanation.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowAnswer((value) => !value)}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Next Question
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default InterviewPrepTool
