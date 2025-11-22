import React, { useState } from 'react';
import { Brain, Heart, Star, Coffee, Book, Music, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    type: 'A' | 'B' | 'C' | 'D';
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: '在周末，你最喜欢做什么？',
    options: [
      { text: '独自在家看书或看电影', type: 'A' },
      { text: '和朋友外出社交', type: 'B' },
      { text: '参加户外运动', type: 'C' },
      { text: '创作艺术或音乐', type: 'D' }
    ]
  },
  {
    id: 2,
    text: '遇到困难时，你通常会？',
    options: [
      { text: '仔细分析问题', type: 'A' },
      { text: '寻求他人建议', type: 'B' },
      { text: '凭直觉行动', type: 'C' },
      { text: '寻找创新解决方案', type: 'D' }
    ]
  },
  {
    id: 3,
    text: '你更倾向于？',
    options: [
      { text: '提前计划一切', type: 'A' },
      { text: '随机应变', type: 'B' },
      { text: '保持灵活', type: 'C' },
      { text: '跟随内心', type: 'D' }
    ]
  },
  {
    id: 4,
    text: '在团队项目中，你通常扮演什么角色？',
    options: [
      { text: '项目规划和统筹', type: 'A' },
      { text: '协调和沟通', type: 'B' },
      { text: '执行和落实', type: 'C' },
      { text: '提供创意想法', type: 'D' }
    ]
  },
  {
    id: 5,
    text: '面对新环境时，你会？',
    options: [
      { text: '仔细观察和分析', type: 'A' },
      { text: '主动结交新朋友', type: 'B' },
      { text: '探索和尝试新事物', type: 'C' },
      { text: '寻找独特的体验', type: 'D' }
    ]
  },
  {
    id: 6,
    text: '做决定时，你最看重什么？',
    options: [
      { text: '逻辑和数据', type: 'A' },
      { text: '他人的建议和感受', type: 'B' },
      { text: '实际效果', type: 'C' },
      { text: '直觉和创新', type: 'D' }
    ]
  },
  {
    id: 7,
    text: '你的理想工作环境是？',
    options: [
      { text: '安静有序的独立空间', type: 'A' },
      { text: '充满活力的开放办公室', type: 'B' },
      { text: '灵活多变的工作场所', type: 'C' },
      { text: '富有创意氛围的工作室', type: 'D' }
    ]
  },
  {
    id: 8,
    text: '压力大的时候，你会？',
    options: [
      { text: '列出计划，逐步解决', type: 'A' },
      { text: '和朋友倾诉交流', type: 'B' },
      { text: '运动或外出散心', type: 'C' },
      { text: '通过艺术创作释放压力', type: 'D' }
    ]
  }
];

const personalityTypes = {
  A: '理性思考者',
  B: '社交达人',
  C: '行动派',
  D: '创意先锋'
};

const personalityDescriptions = {
  A: '你是一个深思熟虑的人，喜欢分析和规划。你的理性思维帮助你做出明智的决定。你擅长处理复杂问题，总能找到最优解决方案。在团队中，你常常是智囊团的核心，为项目提供清晰的方向。',
  B: '你善于与人交往，充满同理心。你的社交能力让你在团队中发挥重要作用。你天生就是一个优秀的倾听者和沟通者，能够轻松化解矛盾，建立和谐的人际关系。你的情商很高，总能准确把握他人的情绪和需求。',
  C: '你是个实干家，喜欢冒险和挑战。你的行动力让你能够快速达成目标。你不喜欢空谈，更愿意付诸行动。在面对困难时，你总是勇往直前，用实际行动证明自己。你的果断和执行力常常让人印象深刻。',
  D: '你富有创造力和想象力。你独特的思维方式让你能够找到创新的解决方案。你喜欢打破常规，探索新的可能性。在工作中，你常常能提出独特的见解，为项目带来创新的突破。你的艺术感和创造力让你的作品总是与众不同。'
};

const personalityColors = {
  A: 'from-blue-500 to-cyan-300',
  B: 'from-pink-500 to-rose-300',
  C: 'from-yellow-500 to-amber-300',
  D: 'from-purple-500 to-violet-300'
};

const personalityBackgrounds = {
  A: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  B: 'bg-gradient-to-br from-pink-50 to-rose-50',
  C: 'bg-gradient-to-br from-yellow-50 to-amber-50',
  D: 'bg-gradient-to-br from-purple-50 to-violet-50'
};

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (type: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newAnswers = [...answers, type];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
      setIsAnimating(false);
    }, 300);
  };

  const getPersonalityType = () => {
    const counts = answers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const personalityType = showResult ? getPersonalityType() : 'A';

  return (
    <div className={`min-h-screen ${personalityBackgrounds[personalityType as keyof typeof personalityBackgrounds]} py-8 px-4 transition-all duration-500`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className={`w-8 h-8 text-transparent bg-gradient-to-r ${personalityColors[personalityType as keyof typeof personalityColors]}`} />
            <h1 className={`text-4xl font-bold bg-gradient-to-r ${personalityColors[personalityType as keyof typeof personalityColors]} bg-clip-text text-transparent`}>
              性格测试小游戏
            </h1>
            <Sparkles className={`w-8 h-8 text-transparent bg-gradient-to-r ${personalityColors[personalityType as keyof typeof personalityColors]}`} />
          </div>
          <p className="text-gray-600 text-lg">探索你独特的性格特征</p>
        </div>

        {!showResult ? (
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'}`}>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span className="font-medium">问题 {currentQuestion + 1}/{questions.length}</span>
                <span className="font-medium">进度: {Math.round(((currentQuestion) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`rounded-full h-3 transition-all duration-500 bg-gradient-to-r ${personalityColors[personalityType as keyof typeof personalityColors]}`}
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-8 text-gray-800">{questions[currentQuestion].text}</h2>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.type)}
                  className="w-full text-left p-6 rounded-xl border-2 border-gray-100 hover:border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-offset-transparent hover:shadow-lg group transition-all duration-200"
                  style={{
                    background: `linear-gradient(to right, white, white)`,
                    backgroundSize: '200% 100%',
                    backgroundPosition: '100% 0',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-medium group-hover:bg-gradient-to-r ${personalityColors[option.type as keyof typeof personalityColors]} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-500">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                {personalityType === 'A' && <Brain className={`w-24 h-24 text-transparent bg-gradient-to-r ${personalityColors[personalityType]}`} />}
                {personalityType === 'B' && <Heart className={`w-24 h-24 text-transparent bg-gradient-to-r ${personalityColors[personalityType]}`} />}
                {personalityType === 'C' && <Star className={`w-24 h-24 text-transparent bg-gradient-to-r ${personalityColors[personalityType]}`} />}
                {personalityType === 'D' && <Coffee className={`w-24 h-24 text-transparent bg-gradient-to-r ${personalityColors[personalityType]}`} />}
              </div>
              <h2 className={`text-3xl font-bold mb-6 bg-gradient-to-r ${personalityColors[personalityType]} bg-clip-text text-transparent`}>
                你的性格类型：{personalityTypes[personalityType as keyof typeof personalityTypes]}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                {personalityDescriptions[personalityType as keyof typeof personalityDescriptions]}
              </p>
              <button
                onClick={restart}
                className={`px-8 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r ${personalityColors[personalityType]}`}
              >
                重新测试
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;