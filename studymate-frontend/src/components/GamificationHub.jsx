import { useState } from 'react'
import { Trophy, Star, Zap, Target, Award, TrendingUp, Users, Crown, Medal, Gift } from 'lucide-react'

function GamificationHub({ user }) {
  const [activeTab, setActiveTab] = useState('achievements') // achievements, leaderboard, challenges

  // Mock gamification data
  const mockData = {
    userStats: {
      level: 15,
      xp: 2450,
      xpToNext: 550,
      totalXp: 3000,
      streak: 7,
      rank: 23,
      totalUsers: 1247
    },
    achievements: [
      {
        id: 1,
        title: "First Steps",
        description: "Complete your first study session",
        icon: "🎯",
        earned: true,
        xp: 50,
        rarity: "common",
        earnedDate: "2024-01-15"
      },
      {
        id: 2,
        title: "Study Streak Master",
        description: "Maintain a 7-day study streak",
        icon: "🔥",
        earned: true,
        xp: 200,
        rarity: "rare",
        earnedDate: "2024-01-20"
      },
      {
        id: 3,
        title: "Night Owl Scholar",
        description: "Study for 3 hours after 10 PM",
        icon: "🦉",
        earned: true,
        xp: 150,
        rarity: "uncommon",
        earnedDate: "2024-01-18"
      },
      {
        id: 4,
        title: "Knowledge Seeker",
        description: "Read 100 documents",
        icon: "📚",
        earned: false,
        progress: 67,
        total: 100,
        xp: 300,
        rarity: "rare"
      },
      {
        id: 5,
        title: "AI Whisperer",
        description: "Have 50 conversations with Study Buddy",
        icon: "🤖",
        earned: false,
        progress: 23,
        total: 50,
        xp: 250,
        rarity: "uncommon"
      },
      {
        id: 6,
        title: "Legendary Scholar",
        description: "Reach level 50",
        icon: "👑",
        earned: false,
        progress: 15,
        total: 50,
        xp: 1000,
        rarity: "legendary"
      }
    ],
    leaderboard: [
      { rank: 1, name: "Sarah Chen", level: 28, xp: 8450, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face", streak: 21 },
      { rank: 2, name: "Alex Rodriguez", level: 26, xp: 7890, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", streak: 15 },
      { rank: 3, name: "Emma Thompson", level: 24, xp: 7234, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face", streak: 12 },
      { rank: 4, name: "Michael Kim", level: 22, xp: 6789, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face", streak: 9 },
      { rank: 5, name: "Lisa Wang", level: 21, xp: 6456, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face", streak: 18 }
    ],
    challenges: [
      {
        id: 1,
        title: "Speed Reader Challenge",
        description: "Read 5 documents in one day",
        type: "daily",
        progress: 2,
        total: 5,
        reward: "150 XP + Speed Reader Badge",
        timeLeft: "18h 32m",
        difficulty: "medium"
      },
      {
        id: 2,
        title: "Focus Master",
        description: "Study for 4 hours without breaks",
        type: "weekly",
        progress: 2.5,
        total: 4,
        reward: "300 XP + Focus Master Title",
        timeLeft: "3d 12h",
        difficulty: "hard"
      },
      {
        id: 3,
        title: "Social Learner",
        description: "Join 3 virtual study sessions",
        type: "weekly",
        progress: 1,
        total: 3,
        reward: "200 XP + Team Player Badge",
        timeLeft: "5d 8h",
        difficulty: "easy"
      }
    ]
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'uncommon': return 'border-green-300 bg-green-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              Gamification Hub
            </h3>
            <p className="text-sm text-slate-600">Level up your learning journey!</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Lv.{mockData.userStats.level}</div>
                <div className="text-xs opacity-90">Level</div>
              </div>
              <Crown className="w-6 h-6 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockData.userStats.xp}</div>
                <div className="text-xs opacity-90">Total XP</div>
              </div>
              <Star className="w-6 h-6 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockData.userStats.streak}</div>
                <div className="text-xs opacity-90">Day Streak</div>
              </div>
              <Zap className="w-6 h-6 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">#{mockData.userStats.rank}</div>
                <div className="text-xs opacity-90">Global Rank</div>
              </div>
              <Medal className="w-6 h-6 opacity-80" />
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Progress to Level {mockData.userStats.level + 1}</span>
            <span>{mockData.userStats.xpToNext} XP needed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((mockData.userStats.totalXp - mockData.userStats.xp) / mockData.userStats.totalXp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        {[
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
          { id: 'challenges', label: 'Challenges', icon: Target }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.earned 
                    ? `${getRarityColor(achievement.rarity)} shadow-md` 
                    : 'border-slate-200 bg-slate-50 opacity-75'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-3xl ${achievement.earned ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${achievement.earned ? 'text-slate-900' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? 'text-slate-600' : 'text-slate-400'}`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.earned ? (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs font-medium text-green-600">Earned</span>
                        <span className="text-xs text-slate-500">{achievement.earnedDate}</span>
                        <span className="text-xs font-medium text-purple-600">+{achievement.xp} XP</span>
                      </div>
                    ) : (
                      <div className="mt-2">
                        {achievement.progress !== undefined && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <span className="text-xs font-medium text-purple-600">Reward: +{achievement.xp} XP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900">Global Leaderboard</h4>
              <div className="text-sm text-slate-600">Updated live</div>
            </div>
            
            {mockData.leaderboard.map((user, index) => (
              <div
                key={user.rank}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  index < 3 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {user.rank === 1 && <Crown className="w-4 h-4" />}
                    {user.rank === 2 && <Medal className="w-4 h-4" />}
                    {user.rank === 3 && <Award className="w-4 h-4" />}
                    {user.rank > 3 && user.rank}
                  </div>
                  
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-600">Level {user.level} • {user.xp} XP</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center text-orange-600">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="font-medium">{user.streak}</span>
                    </div>
                    <div className="text-xs text-slate-500">day streak</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900">Active Challenges</h4>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                View All
              </button>
            </div>
            
            {mockData.challenges.map((challenge) => (
              <div key={challenge.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-slate-900">{challenge.title}</h5>
                    <p className="text-sm text-slate-600">{challenge.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {challenge.type}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">{challenge.reward}</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {challenge.timeLeft} left
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GamificationHub
