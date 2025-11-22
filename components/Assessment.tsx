import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, XCircle, Timer, BrainCircuit, RotateCcw } from 'lucide-react';
import { Question } from '../types';
import { getGeminiExplanation } from '../services/geminiService';

interface AssessmentProps {
  apiKey: string;
  onComplete: () => void;
}

// Simulated Question Bank
const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: 'Maths',
    content: "Quelle est la dérivée de la fonction f(x) = x² * ln(x) ?",
    options: ["2x * ln(x) + x", "2x * ln(x)", "x * (2ln(x) + 1)", "x/2 * ln(x)"],
    correctIndex: 0,
    difficulty: -0.5,
    explanation: "On utilise la règle du produit (uv)' = u'v + uv'. Ici u=x² et v=ln(x)."
  },
  {
    id: 2,
    subject: 'Physique',
    content: "Dans un circuit RLC série en résonance, l'impédance est :",
    options: ["Maximale", "Minimale et égale à R", "Nulle", "Infinie"],
    correctIndex: 1,
    difficulty: 0.2,
    explanation: "À la résonance, les réactances capacitive et inductive s'annulent. Z = R."
  },
  {
    id: 3,
    subject: 'SVT',
    content: "La glycolyse se déroule dans :",
    options: ["La matrice mitochondriale", "Le hyaloplasme", "Les crêtes mitochondriales", "Le noyau"],
    correctIndex: 1,
    difficulty: -1.0,
    explanation: "La glycolyse est une étape anaérobie qui se déroule dans le cytoplasme (hyaloplasme)."
  },
  {
    id: 4,
    subject: 'Maths',
    content: "Si la limite de f(x) quand x tend vers +infini est 3, alors la droite y=3 est :",
    options: ["Asymptote verticale", "Asymptote oblique", "Asymptote horizontale", "Tangente"],
    correctIndex: 2,
    difficulty: -1.5,
    explanation: "Par définition, si lim f(x) = L quand x->inf, y=L est asymptote horizontale."
  },
  {
    id: 5,
    subject: 'Physique',
    content: "L'énergie cinétique d'un solide en rotation est donnée par :",
    options: ["1/2 mv²", "1/2 Jω²", "mgh", "Jω"],
    correctIndex: 1,
    difficulty: 1.0,
    explanation: "C'est l'analogue de 1/2 mv² mais avec le moment d'inertie J et la vitesse angulaire ω."
  }
];

const Assessment: React.FC<AssessmentProps> = ({ apiKey, onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [theta, setTheta] = useState(0.0); // IRT Ability estimate
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    
    setIsSubmitted(true);
    const currentQ = MOCK_QUESTIONS[currentQIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;

    // Simulate IRT Update (simplified)
    if (isCorrect) {
      setScore(s => s + 1);
      setTheta(t => t + 0.5 * (currentQ.difficulty + 2)); 
    } else {
      setTheta(t => t - 0.2);
    }

    // Call Gemini for explanation if incorrect or user wants depth
    if (!isCorrect && apiKey) {
        setLoadingAi(true);
        const explanation = await getGeminiExplanation(
            apiKey, 
            currentQ.content, 
            currentQ.options[selectedOption], 
            currentQ.options[currentQ.correctIndex]
        );
        setAiExplanation(explanation);
        setLoadingAi(false);
    } else if (!isCorrect && !apiKey) {
        // Fallback local explanation
        setAiExplanation(currentQ.explanation || "Réponse incorrecte.");
    }
  };

  const handleNext = () => {
    if (currentQIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setAiExplanation(null);
    } else {
      // Finish
      onComplete();
    }
  };

  const currentQ = MOCK_QUESTIONS[currentQIndex];
  const progress = ((currentQIndex) / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {currentQ.subject.slice(0, 2)}
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Évaluation Continue</h3>
                <p className="text-xs text-slate-500">Difficulté adaptative: {theta.toFixed(2)}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded-md">
            <Timer size={16} />
            {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
        <div 
            className="bg-benin-green h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Question {currentQIndex + 1} / {MOCK_QUESTIONS.length}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                {currentQ.content}
            </h2>

            <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                    let statusClass = "border-slate-200 hover:border-blue-400 hover:bg-slate-50";
                    if (isSubmitted) {
                        if (idx === currentQ.correctIndex) statusClass = "border-green-500 bg-green-50 text-green-700";
                        else if (idx === selectedOption) statusClass = "border-red-500 bg-red-50 text-red-700";
                        else statusClass = "border-slate-100 opacity-50";
                    } else if (selectedOption === idx) {
                        statusClass = "border-blue-600 bg-blue-50 ring-1 ring-blue-600";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${statusClass}`}
                        >
                            <span className="font-medium">{option}</span>
                            {isSubmitted && idx === currentQ.correctIndex && <CheckCircle size={20} className="text-green-600" />}
                            {isSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} className="text-red-600" />}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Action Area */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            {!isSubmitted ? (
                <button 
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="w-full md:w-auto ml-auto px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Valider la réponse
                </button>
            ) : (
                <>
                   {/* AI Feedback Section */}
                    <div className="flex-1 w-full">
                        {loadingAi ? (
                            <div className="flex items-center gap-2 text-slate-500 text-sm animate-pulse">
                                <BrainCircuit size={16} /> L'IA analyse ton erreur...
                            </div>
                        ) : (
                            <div className={`text-sm p-4 rounded-lg border ${selectedOption === currentQ.correctIndex ? 'bg-green-100 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-slate-700'}`}>
                                <p className="font-bold flex items-center gap-2 mb-1">
                                    {selectedOption === currentQ.correctIndex ? 'Excellent !' : 'Explication IA :'}
                                </p>
                                {aiExplanation}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleNext}
                        className="w-full md:w-auto px-8 py-3 bg-benin-green text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {currentQIndex === MOCK_QUESTIONS.length - 1 ? 'Terminer' : 'Suivant'} <ArrowRight size={18} />
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;