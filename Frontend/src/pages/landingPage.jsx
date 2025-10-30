import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaCode, FaRocket, FaMagic, FaGithub, FaTwitter, FaLinkedin, FaArrowRight, FaPlay, FaCheck, FaCogs, FaBook, FaLightbulb, FaDownload, FaEye, FaBrain, FaFileCode } from "react-icons/fa";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-switch tabs effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 3);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle manual tab click
  const handleTabClick = (index) => {
    setActiveTab(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually clicks
    
    // Resume auto-play after 10 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(34, 197, 94, 0.08), 
              rgba(59, 130, 246, 0.05) 40%, 
              transparent 70%)`
          }}
        />
        
        {/* Code-like grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />

        {/* Floating API elements */}
        <div className="absolute inset-0 overflow-hidden">
          {['GET', 'POST', 'PUT', 'DELETE', '200', '404', 'JSON'].map((text, i) => (
            <div
              key={text}
              className="absolute text-emerald-400/10 font-mono text-sm pointer-events-none"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                transform: `rotate(${Math.sin(scrollY * 0.001 + i) * 20}deg) translateY(${Math.sin(scrollY * 0.002 + i) * 20}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <FaFileCode className="text-black text-lg" />
              </div>
            </div>
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Apiverse
              </span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center">
            <Link to="/home" className="bg-emerald-400 hover:bg-emerald-300 text-black font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/25">
              Get Started 
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative z-10 min-h-screen flex items-center justify-center px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <FaBrain className="text-emerald-400 text-sm" />
              <span className="text-emerald-400 text-sm font-medium">AI-Powered Documentation</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              <span className="block mb-2">Transform</span>
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-300% animate-gradient">
                Raw API Specs
              </span>
              <span className="block mt-2">Into Magic</span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-xl">
              Developer-first platform that converts your OpenAPI specifications into 
              <span className="text-emerald-400 font-semibold"> beautiful interactive documentation</span>, 
              auto-generated SDKs, and AI-powered explanations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/home" className="group bg-emerald-400 hover:bg-emerald-300 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-400/25 hover:scale-[1.02] flex items-center justify-center space-x-2">
                <span>Start Building</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">0K</div>
                <div className="text-white/60 text-sm">APIs Documented</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">0K</div>
                <div className="text-white/60 text-sm">SDK Downloads</div>
              </div>
            </div>
          </div>

          {/* Interactive Demo with Auto-Switching */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-black/30 p-1 rounded-lg relative">
                {['Raw Spec', 'Beautiful Docs', 'Generated SDK'].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(index)}
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeTab === index 
                        ? 'bg-emerald-400 text-black shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                    {/* Progress indicator for active tab */}
                    {activeTab === index && isAutoPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30 rounded-full">
                        <div className="h-full bg-black/50 rounded-full animate-progress" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Content with smooth transitions */}
              <div className="bg-black/50 rounded-xl p-4 font-mono text-sm min-h-[300px] relative overflow-hidden">
                <div className={`transition-all duration-500 ${activeTab === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-4'}`}>
                  <div className="text-white/80">
                    <div className="text-gray-500 mb-2"># Raw OpenAPI Spec</div>
                    <div className="text-blue-400">openapi: 3.0.0</div>
                    <div className="text-yellow-400">info:</div>
                    <div className="ml-4 text-green-400">title: User API</div>
                    <div className="ml-4 text-green-400">version: 1.0.0</div>
                    <div className="text-yellow-400">paths:</div>
                    <div className="ml-4 text-purple-400">/users:</div>
                    <div className="ml-8 text-emerald-400">get:</div>
                    <div className="ml-12 text-white/60">summary: Get users</div>
                    <div className="ml-12 text-red-400">responses:</div>
                    <div className="ml-16 text-green-400">'200':</div>
                    <div className="ml-20 text-white/60">description: Success</div>
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ${activeTab === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-4'}`}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <FaRocket />
                      <span className="font-sans font-semibold">User API Documentation</span>
                    </div>
                    <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">GET</span>
                        <span className="text-white font-medium">/users</span>
                      </div>
                      <p className="text-white/70 text-sm">Retrieve a list of all users</p>
                      <button className="mt-3 bg-emerald-400 text-black px-3 py-1 rounded text-xs font-medium hover:bg-emerald-300 transition-colors">
                        Try It Live →
                      </button>
                    </div>
                    <div className="text-white/60 text-xs">✨ Auto-generated with AI explanations</div>
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ${activeTab === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-4'}`}>
                  <div className="text-white/80">
                    <div className="text-gray-500 mb-2"># Auto-Generated JavaScript SDK</div>
                    <div className="text-blue-400">import</div> <span className="text-yellow-400">{'{ UserAPI }'}</span> <span className="text-blue-400">from</span> <span className="text-green-400">'@apiverse/user-api'</span>
                    <br /><br />
                    <div className="text-purple-400">const</div> <span className="text-cyan-400">client</span> = <span className="text-blue-400">new</span> <span className="text-yellow-400">UserAPI</span>()
                    <br /><br />
                    <div className="text-gray-500">// Ready to use!</div>
                    <div className="text-purple-400">const</div> <span className="text-cyan-400">users</span> = <span className="text-blue-400">await</span> <span className="text-cyan-400">client</span>.<span className="text-yellow-400">getUsers</span>()
                    <br />
                    <div className="text-emerald-400">console</div>.<span className="text-yellow-400">log</span>(<span className="text-cyan-400">users</span>)
                  </div>
                </div>

                {/* Auto-demo indicator */}
                {isAutoPlaying && (
                  <div className="absolute top-2 right-2">
                    <div className="text-xs text-white/40 flex items-center space-x-1">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                      <span>Auto-demo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Perfect API Docs
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From raw specs to production-ready documentation in minutes, not days
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBook />,
                title: "Beautiful Documentation",
                description: "Transform OpenAPI specs into stunning, interactive documentation that developers actually want to read and use.",
                color: "emerald"
              },
              {
                icon: <FaPlay />,
                title: "Live API Testing",
                description: "Built-in 'Try It' feature lets developers test endpoints directly in the docs with real API calls.",
                color: "blue"
              },
              {
                icon: <FaDownload />,
                title: "Auto-Generated SDKs",
                description: "Instantly generate production-ready SDKs in multiple languages from your API specification.",
                color: "purple"
              },
              {
                icon: <FaBrain />,
                title: "AI-Powered Explanations",
                description: "Smart AI analyzes your API and generates helpful explanations, examples, and integration guides.",
                color: "pink"
              },
              {
                icon: <FaCode />,
                title: "Embeddable Anywhere",
                description: "Embed interactive docs into your existing site, or use our hosted solution with custom domains.",
                color: "cyan"
              },
              {
                icon: <FaRocket />,
                title: "Developer-First",
                description: "Built by developers, for developers. Seamless integration with your existing workflow and tools.",
                color: "yellow"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-500 rounded-xl flex items-center justify-center text-xl text-black mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-32 px-8 bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              From Spec to Spectacular
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                In 3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload Your Spec",
                description: "Drop your OpenAPI/Swagger file or connect your API directly. We support all major formats and versions.",
                icon: <FaFileCode />
              },
              {
                step: "02", 
                title: "Magic",
                description: "Parses api specs, generates examples, writes explanations, and creates beautiful documentation.",
                icon: <FaMagic />
              },
              {
                step: "03",
                title: "Share & Integrate",
                description: "Get embeddable docs, auto-generated SDKs, and a developer portal that makes integration effortless.",
                icon: <FaRocket />
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-20 left-full w-12 h-px bg-gradient-to-r from-emerald-400 to-transparent z-10" />
                )}
                
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-2xl flex items-center justify-center text-2xl text-black mx-auto shadow-2xl shadow-emerald-400/25 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border-2 border-emerald-400 rounded-full flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative z-10 py-32 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Your API Experience?
            </span>
          </h2>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who've already made their APIs more accessible, 
            understandable, and integration-ready.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button className="bg-emerald-400 hover:bg-emerald-300 text-black font-bold px-12 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-400/25 hover:scale-[1.02] text-lg">
              Explore Now
            </button>  
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/[0.02] backdrop-blur-sm border-t border-white/10 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FaFileCode className="text-black text-lg" />
                </div>
                <span className="text-2xl font-bold">Apiverse</span>
              </div>
              <p className="text-white/60 mb-6">
                Transform your API specs into beautiful, interactive documentation.
              </p>
              <div className="flex space-x-4">
                <FaGithub className="text-white/60 hover:text-emerald-400 text-xl cursor-pointer transition-colors" />
                <FaTwitter className="text-white/60 hover:text-emerald-400 text-xl cursor-pointer transition-colors" />
                <FaLinkedin className="text-white/60 hover:text-emerald-400 text-xl cursor-pointer transition-colors" />
              </div>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Examples", "Integrations"]
              },
              {
                title: "Developers", 
                links: ["Documentation", "API Reference", "SDKs", "Community"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Status", "Changelog"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-6 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-white/60 hover:text-emerald-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            <p>&copy; 2025 Apiverse. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 6s ease infinite;
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 3s linear infinite;
        }
        
        .bg-300\\% {
          background-size: 300% 300%;
        }
        
        .bg-400\\% {
          background-size: 400% 400%;
        }
      `}</style>
    </div>)}