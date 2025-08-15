import React, { useState, useEffect } from 'react';
import { Upload, BookOpen, Video, Globe, User, Brain, FileText, Play, Settings, Search, ChevronRight, Star, Target, Lightbulb, QrCode, Smartphone } from 'lucide-react';
import { useOpenAI } from './hooks/useOpenAI';

interface Student {
  id: string;
  name: string;
  level: string;
  country: string;
  subjects: string[];
}

interface UploadedContent {
  id: string;
  title: string;
  level: string;
  subject: string;
  content: string;
  questions: Question[];
  videoSuggestions: string[];
}

interface Question {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: string;
  examples: string[];
}

interface VideoRequest {
  id: string;
  title: string;
  description: string;
  style: string;
  duration: string;
  level: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: Date;
}
function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [student, setStudent] = useState<Student | null>(null);
  const [uploadedContent, setUploadedContent] = useState<UploadedContent[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('auto');
  const [selectedCountry, setSelectedCountry] = useState('auto');
  const [videoRequests, setVideoRequests] = useState<VideoRequest[]>([]);
  const [customVideoInput, setCustomVideoInput] = useState({
    title: '',
    description: '',
    style: 'animated',
    duration: '2-3',
    level: 'auto'
  });
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // OpenAI integration
  const { processContent, createVideoScript, getResearchInsights, isProcessing, error, clearError } = useOpenAI();

  const educationLevels = [
    { id: 'elementary', label: 'Elementary (K-5)', color: 'bg-green-100 text-green-800' },
    { id: 'middle', label: 'Middle School (6-8)', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', label: 'High School (9-12)', color: 'bg-purple-100 text-purple-800' },
    { id: 'undergraduate', label: 'Undergraduate', color: 'bg-orange-100 text-orange-800' },
    { id: 'graduate', label: 'Graduate/PhD', color: 'bg-red-100 text-red-800' }
  ];

  const countries = [
    { id: 'us', label: 'United States', flag: '🇺🇸' },
    { id: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { id: 'canada', label: 'Canada', flag: '🇨🇦' },
    { id: 'australia', label: 'Australia', flag: '🇦🇺' },
    { id: 'india', label: 'India', flag: '🇮🇳' },
    { id: 'other', label: 'Other', flag: '🌍' }
  ];

  // Simulate content processing
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearError();
    
    try {
      const result = await processContent(file, selectedLevel, selectedCountry);
      
      if (result) {
        const newContent: UploadedContent = {
          id: Date.now().toString(),
          ...result.content,
          questions: result.questions,
          videoSuggestions: [
            `Animation explaining ${result.content.title}`,
            `Interactive demonstration of key concepts`,
            `Real-world applications and examples`
          ]
        };

        setUploadedContent(prev => [...prev, newContent]);
        setActiveTab('analyze');
        
        // Generate research insights in background
        getResearchInsights(result.content.content, result.content.level, selectedCountry)
          .then(insights => {
            if (insights) {
              setUploadedContent(prev => 
                prev.map(content => 
                  content.id === newContent.id 
                    ? { ...content, researchInsights: insights }
                    : content
                )
              );
            }
          });
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const generateCustomVideo = async () => {
    if (!customVideoInput.title.trim() || !customVideoInput.description.trim()) {
      alert('Please fill in both title and description fields.');
      return;
    }

    setIsGeneratingVideo(true);
    
    const newVideoRequest: VideoRequest = {
      id: Date.now().toString(),
      title: customVideoInput.title,
      description: customVideoInput.description,
      style: customVideoInput.style,
      duration: customVideoInput.duration,
      level: customVideoInput.level === 'auto' ? selectedLevel : customVideoInput.level,
      status: 'processing',
      createdAt: new Date()
    };

    setVideoRequests(prev => [...prev, newVideoRequest]);
    
    try {
      const script = await createVideoScript(
        customVideoInput.title,
        customVideoInput.description,
        customVideoInput.style,
        customVideoInput.duration,
        customVideoInput.level === 'auto' ? selectedLevel : customVideoInput.level
      );
      
      if (script) {
        // Update video request with completed status
        setVideoRequests(prev => 
          prev.map(req => 
            req.id === newVideoRequest.id 
              ? { ...req, status: 'completed' }
              : req
          )
        );
        
        // Reset form
        setCustomVideoInput({
          title: '',
          description: '',
          style: 'animated',
          duration: '2-3',
          level: 'auto'
        });
        
        alert(`Video script generated successfully!\n\nTitle: ${script.title}\nScenes: ${script.scenes.length}\nDuration: ${script.totalDuration}`);
      }
    } catch (err) {
      // Update video request with error status
      setVideoRequests(prev => 
        prev.map(req => 
          req.id === newVideoRequest.id 
            ? { ...req, status: 'pending' }
            : req
        )
      );
      console.error('Video generation error:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateVideo = (suggestion: string) => {
    // Use the suggestion as title and generate a video
    setCustomVideoInput(prev => ({
      ...prev,
      title: suggestion,
      description: `Create an educational video about: ${suggestion}`
    }));
    setActiveTab('videos');
  };

  const TabButton = ({ id, label, icon: Icon, active }: { id: string; label: string; icon: any; active: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-3 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border'
      }`}
    >
      <Icon size={20} />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Brain size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EduVision</h1>
                <p className="text-sm text-gray-500 hidden sm:block">AI-Powered Learning Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 hidden sm:flex">
                <Globe size={18} className="text-gray-400" />
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="auto">Auto-detect</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.flag} {country.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-50 px-2 sm:px-4 py-2 rounded-lg">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800 hidden sm:inline">Student Mode</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <TabButton id="upload" label="Upload Content" icon={Upload} active={activeTab === 'upload'} />
          <TabButton id="analyze" label="Analyze & Learn" icon={BookOpen} active={activeTab === 'analyze'} />
          <TabButton id="videos" label="Create Videos" icon={Video} active={activeTab === 'videos'} />
          <TabButton id="research" label="Deep Research" icon={Search} active={activeTab === 'research'} />
          <TabButton id="mobile" label="Mobile Access" icon={QrCode} active={activeTab === 'mobile'} />
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Upload Your Learning Material</h2>
              <p className="text-gray-600 max-w-2xl mx-auto px-4">
                Upload any page from textbooks, research papers, or educational content. Our AI will extract and adapt the knowledge to your learning level.
              </p>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h3>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                  <select 
                    value={selectedLevel} 
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  >
                    <option value="auto">Auto-detect from content</option>
                    {educationLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {['Science', 'Math', 'History', 'Literature', 'Engineering'].map(subject => (
                      <span key={subject} className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 sm:p-12 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.txt"
                  className="hidden"
                  id="file-upload"
                  disabled={isProcessing}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                      <p className="text-blue-600 font-medium">Processing your content...</p>
                      <p className="text-xs sm:text-sm text-gray-500">Extracting text, analyzing difficulty, generating questions...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                        <Upload size={24} className="text-blue-600 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Upload Book Pages</h3>
                        <p className="text-gray-600 text-sm sm:text-base px-4">
                          Drag and drop or click to select images of book pages, PDFs, or text files
                        </p>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Supports: JPG, PNG, PDF, TXT • Max size: 10MB
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Knowledge Analysis</h2>
              <p className="text-gray-600">
                Explore extracted knowledge with personalized questions and explanations
              </p>
            </div>

            {uploadedContent.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload some content first to see the analysis</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {uploadedContent.map(content => (
                  <div key={content.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Content Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              educationLevels.find(l => l.id === content.level)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {educationLevels.find(l => l.id === content.level)?.label}
                            </span>
                            <span className="text-blue-100">{content.subject}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={20} />
                          <span className="text-sm">AI Processed</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Content Summary */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Lightbulb size={20} className="text-yellow-500" />
                          Key Concepts
                        </h4>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                          {content.content}
                        </p>
                      </div>

                      {/* Questions */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target size={20} className="text-blue-500" />
                          Interactive Questions
                        </h4>
                        <div className="space-y-4">
                          {content.questions.map(question => (
                            <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h5 className="font-medium text-gray-900">{question.question}</h5>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {question.difficulty}
                                </span>
                              </div>
                              
                              <div className="text-gray-700 mb-3">
                                <strong>Answer:</strong> {question.answer}
                              </div>
                              
                              <div>
                                <strong className="text-sm text-gray-600">Real-world examples:</strong>
                                <ul className="mt-1 space-y-1">
                                  {question.examples.map((example, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                      <ChevronRight size={14} />
                                      {example}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">AI Video Generation</h2>
              <p className="text-gray-600 px-4">
                Create personalized animated videos from your content or custom descriptions
              </p>
            </div>

            {/* Custom Video Creation Form */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Video size={24} className="text-blue-600" />
                <span className="hidden sm:inline">Create Custom Educational Video</span>
                <span className="sm:hidden">Create Video</span>
              </h3>
              
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                    <input
                      type="text"
                      value={customVideoInput.title}
                      onChange={(e) => setCustomVideoInput(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., How Photosynthesis Works"
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      disabled={isGeneratingVideo}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Description</label>
                    <textarea
                      value={customVideoInput.description}
                      onChange={(e) => setCustomVideoInput(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what you want the video to explain or demonstrate. Be as detailed as possible..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                      disabled={isGeneratingVideo}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Animation Style</label>
                    <select
                      value={customVideoInput.style}
                      onChange={(e) => setCustomVideoInput(prev => ({ ...prev, style: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      disabled={isGeneratingVideo}
                    >
                      <option value="animated">2D Animation</option>
                      <option value="3d">3D Animation</option>
                      <option value="whiteboard">Whiteboard Style</option>
                      <option value="infographic">Infographic Style</option>
                      <option value="realistic">Realistic Simulation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <select
                      value={customVideoInput.duration}
                      onChange={(e) => setCustomVideoInput(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      disabled={isGeneratingVideo}
                    >
                      <option value="1-2">1-2 minutes</option>
                      <option value="2-3">2-3 minutes</option>
                      <option value="3-5">3-5 minutes</option>
                      <option value="5-10">5-10 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Level</label>
                    <select
                      value={customVideoInput.level}
                      onChange={(e) => setCustomVideoInput(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      disabled={isGeneratingVideo}
                    >
                      <option value="auto">Use current setting</option>
                      {educationLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={generateCustomVideo}
                  disabled={isGeneratingVideo || !customVideoInput.title.trim() || !customVideoInput.description.trim()}
                  className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isGeneratingVideo ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="hidden sm:inline">Generating Video...</span>
                      <span className="sm:hidden">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      <span className="hidden sm:inline">Generate Custom Video</span>
                      <span className="sm:hidden">Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video Generation Queue */}
            {videoRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Video Generation Queue</h3>
                <div className="space-y-4">
                  {videoRequests.map(request => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{request.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status === 'processing' ? 'Generating...' :
                           request.status === 'completed' ? 'Ready to View' : 'Pending'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{request.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Style: {request.style}</span>
                        <span>Duration: {request.duration} min</span>
                        <span>Level: {educationLevels.find(l => l.id === request.level)?.label || request.level}</span>
                      </div>
                      
                      {request.status === 'completed' && (
                        <div className="mt-3">
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <Play size={16} />
                            Watch Video
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content-Based Video Suggestions */}
            {uploadedContent.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Or Generate from Uploaded Content</h3>
                  <p className="text-gray-600">Quick video suggestions based on your uploaded materials</p>
                </div>
                
                {uploadedContent.map(content => (
                  <div key={content.id} className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Video Suggestions for "{content.title}"</h4>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {content.videoSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 rounded-lg mb-3">
                            <Play size={32} className="text-purple-600 mx-auto" />
                          </div>
                          
                          <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{suggestion}</h5>
                          
                          <button
                            onClick={() => generateVideo(suggestion)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <Play size={16} />
                            <span className="hidden sm:inline">Generate Video</span>
                            <span className="sm:hidden">Generate</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Research Tab */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Deep Research & Context</h2>
              <p className="text-gray-600">
                Get comprehensive research with real-time examples and case studies
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Globe size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-time Cases</h3>
                  <p className="text-sm text-gray-600">
                    Get current examples and case studies relevant to your country and context
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Search size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Context Research</h3>
                  <p className="text-sm text-gray-600">
                    Deep dive into related topics with academic and practical references
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Target size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adaptive Learning</h3>
                  <p className="text-sm text-gray-600">
                    Content automatically adjusts to your educational level and learning style
                  </p>
                </div>
              </div>
            </div>

            {uploadedContent.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Research Insights</h3>
                <div className="space-y-4">
                  {uploadedContent.map(content => (
                    content.researchInsights ? (
                      <div key={content.id} className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Insights for "{content.title}"</h4>
                        
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h5 className="font-medium text-gray-900">Current Applications</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {content.researchInsights.currentApplications}
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-500 pl-4">
                          <h5 className="font-medium text-gray-900">Related Fields</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {content.researchInsights.relatedFields}
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h5 className="font-medium text-gray-900">Career Connections</h5>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {content.researchInsights.careerConnections}
                          </p>
                        </div>
                        
                        {content.researchInsights.realWorldExamples.length > 0 && (
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h5 className="font-medium text-gray-900">Real-World Examples</h5>
                            <ul className="mt-1 space-y-1">
                              {content.researchInsights.realWorldExamples.map((example, idx) => (
                                <li key={idx} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                                  <ChevronRight size={12} className="mt-0.5 flex-shrink-0" />
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={content.id} className="text-center py-4">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Generating research insights...</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Access Tab */}
        {activeTab === 'mobile' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Mobile Access</h2>
              <p className="text-gray-600 px-4">
                Access EduVision on your mobile device for learning on the go
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="bg-gray-100 p-8 rounded-xl mb-4 inline-block">
                    {/* QR Code Placeholder */}
                    <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode size={64} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">QR Code will appear here</p>
                        <p className="text-xs text-gray-400 mt-1">when app is deployed</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan with your phone's camera to access EduVision
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Smartphone size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Mobile Optimized</h3>
                      <p className="text-sm text-gray-600">
                        Fully responsive design that works perfectly on phones and tablets
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Upload size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Camera Upload</h3>
                      <p className="text-sm text-gray-600">
                        Take photos of book pages directly with your phone camera
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Video size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Watch Anywhere</h3>
                      <p className="text-sm text-gray-600">
                        Generated videos play smoothly on mobile devices
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">How to Access on Mobile:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Open your phone's camera app</li>
                      <li>2. Point it at the QR code above</li>
                      <li>3. Tap the notification to open in browser</li>
                      <li>4. Add to home screen for quick access</li>
                    </ol>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-3">Or share the direct link:</p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <code className="text-sm text-gray-700">
                        {window.location.origin}
                      </code>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(window.location.origin)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Progressive Web App</h3>
                <p className="text-blue-100 mb-4">
                  EduVision works like a native app when added to your home screen
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>Offline Access</strong>
                    <p className="text-blue-100 mt-1">View downloaded content without internet</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>Push Notifications</strong>
                    <p className="text-blue-100 mt-1">Get notified when videos are ready</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>Native Feel</strong>
                    <p className="text-blue-100 mt-1">App-like experience on mobile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;