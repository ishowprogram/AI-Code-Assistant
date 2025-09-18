import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "Coding Coach",
    "appDescription": "Upload your code for AI-powered analysis and improvement suggestions",
    "uploadCodeFile": "Upload Code File",
    "chooseFileOrDrag": "Choose a file or drag it here",
    "codePreview": "Code Preview (first 10 lines)",
    "analyzeCode": "Analyze Code",
    "analyzing": "Analyzing...",
    "failedToReadFile": "Failed to read file. Please ensure it's a text file.",
    "pleaseUploadCodeFirst": "Please upload a code file first",
    "overallScore": "Overall Score",
    "improvementSuggestions": "Improvement Suggestions",
    "suggestion": "Suggestion:",
    "evaluationGuidelines": "Evaluation Guidelines",
    "descriptiveNaming": "Descriptive naming conventions",
    "appropriateFunctionSize": "Appropriate function size (avoid extremes)",
    "explicitDependencies": "Explicit dependencies",
    "properErrorHandling": "Proper error handling",
    "limitedNesting": "Limited nesting (2-3 levels max)",
    "clearSideEffects": "Clear side effects",
    "noMagicNumbers": "No magic numbers",
    "analyzingYourCode": "Analyzing Your Code",
    "thisMayTakeAMoment": "This may take a moment...",
    "high": "high",
    "medium": "medium",
    "low": "low"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "appTitle": "Entrenador de Código",
    "appDescription": "Sube tu código para análisis y sugerencias de mejora con IA",
    "uploadCodeFile": "Subir Archivo de Código",
    "chooseFileOrDrag": "Elige un archivo o arrástralo aquí",
    "codePreview": "Vista previa del código (primeras 10 líneas)",
    "analyzeCode": "Analizar Código",
    "analyzing": "Analizando...",
    "failedToReadFile": "Error al leer el archivo. Asegúrate de que sea un archivo de texto.",
    "pleaseUploadCodeFirst": "Por favor sube un archivo de código primero",
    "overallScore": "Puntuación General",
    "improvementSuggestions": "Sugerencias de Mejora",
    "suggestion": "Sugerencia:",
    "evaluationGuidelines": "Pautas de Evaluación",
    "descriptiveNaming": "Convenciones de nomenclatura descriptiva",
    "appropriateFunctionSize": "Tamaño apropiado de función (evitar extremos)",
    "explicitDependencies": "Dependencias explícitas",
    "properErrorHandling": "Manejo adecuado de errores",
    "limitedNesting": "Anidamiento limitado (máximo 2-3 niveles)",
    "clearSideEffects": "Efectos secundarios claros",
    "noMagicNumbers": "Sin números mágicos",
    "analyzingYourCode": "Analizando Tu Código",
    "thisMayTakeAMoment": "Esto puede tomar un momento...",
    "high": "alto",
    "medium": "medio",
    "low": "bajo"
  }
  /* LOCALE_PLACEHOLDER_END */
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale: string): string => {
  if ((TRANSLATIONS as any)[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key: string): string => (TRANSLATIONS as any)[locale]?.[key] || (TRANSLATIONS as any)['en-US'][key] || key;

export default function CodingCoach() {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const customStyles = `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes count-up {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .animate-fade-in { animation: fade-in 0.8s ease-out; }
    .animate-slide-up { animation: slide-up 0.8s ease-out; }
    .animate-slide-up-delay { animation: slide-up 0.8s ease-out 0.3s both; }
    .animate-slide-up-delay-2 { animation: slide-up 0.8s ease-out 0.6s both; }
    .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
    .animate-fade-in-up { animation: slide-up 0.5s ease-out; }
    .animate-fade-in-delay { animation: fade-in 0.8s ease-out 0.5s both; }
    .animate-scale-in { animation: scale-in 0.5s ease-out; }
    .animate-count-up { animation: count-up 0.8s ease-out 0.3s both; }
    .animate-shake { animation: shake 0.6s ease-out; }
    .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
    .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
  `;

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      'py': 'Python',
      'js': 'JavaScript',
      'jsx': 'React/JavaScript',
      'ts': 'TypeScript',
      'tsx': 'React/TypeScript',
      'java': 'Java',
      'c': 'C',
      'cpp': 'C++',
      'cc': 'C++',
      'cxx': 'C++',
      'cs': 'C#',
      'rb': 'Ruby',
      'go': 'Go',
      'php': 'PHP',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'rs': 'Rust',
      'r': 'R',
      'scala': 'Scala',
      'sh': 'Shell/Bash',
      'bash': 'Bash',
      'ps1': 'PowerShell',
      'lua': 'Lua',
      'dart': 'Dart',
      'elm': 'Elm',
      'ex': 'Elixir',
      'exs': 'Elixir',
      'erl': 'Erlang',
      'hrl': 'Erlang',
      'fs': 'F#',
      'fsx': 'F#',
      'clj': 'Clojure',
      'cljs': 'ClojureScript',
      'hs': 'Haskell',
      'jl': 'Julia',
      'ml': 'OCaml',
      'nim': 'Nim',
      'pas': 'Pascal',
      'pl': 'Perl',
      'pm': 'Perl',
      'v': 'V',
      'vb': 'Visual Basic',
      'zig': 'Zig'
    };
    return languageMap[ext] || '';
  };

  const generateMockAnalysis = (code: string, language: string) => {
    const lines = code.split('\n');
    const issues: any[] = [];
    let score = 85; // Start with a good score

    // 1) File length
    if (lines.length > 300) {
      issues.push({
        category: "Code Structure",
        issue: `Very large file (${lines.length} lines).`,
        suggestion: "Split into cohesive modules and extract helpers to reduce cognitive load.",
        severity: "high",
        lineNumber: null,
        codeSnippet: null,
        impact: "Smaller files are easier to understand, review, and test.",
        example: "// before: one giant file\n// after: utils/date.ts, services/api.ts, components/Button.tsx"
      });
      score -= 10;
    } else if (lines.length > 120) {
      issues.push({
        category: "Code Structure",
        issue: `Large file (${lines.length} lines). Consider splitting into modules.`,
        suggestion: "Extract logical sections into separate files and functions.",
        severity: "medium",
        lineNumber: null,
        codeSnippet: null,
        impact: "Improves maintainability and navigability.",
        example: null
      });
      score -= 5;
    }

    // 2) Magic numbers with location hints
    const magicNumberRegex = /(^|[^A-Za-z_])([0-9]{2,}|[0-9]+\.[0-9]+)/g;
    lines.forEach((ln, i) => {
      let match;
      while ((match = magicNumberRegex.exec(ln)) !== null) {
        // Ignore typical JS/TS common literals like 1000 used for ms? Keep simple: report but low severity under 3 occurrences per line
        const value = match[2];
        issues.push({
          category: "Code Quality",
          issue: `Magic number '${value}' detected.`,
          suggestion: "Extract to a named constant (e.g., MAX_RETRIES, TIMEOUT_MS).",
          severity: "low",
          lineNumber: i + 1,
          codeSnippet: ln.trim(),
          impact: "Named constants convey intent and simplify future changes.",
          example: `const TIMEOUT_MS = ${value};\nfetch(url, { signal, timeout: TIMEOUT_MS });`
        });
      }
    });
    if (issues.filter(it => it.category === 'Code Quality').length >= 5) {
      score -= 6;
    } else if (issues.filter(it => it.category === 'Code Quality').length >= 2) {
      score -= 3;
    }

    // 3) Long lines
    lines.forEach((ln, i) => {
      if (ln.length > 100) {
        issues.push({
          category: "Readability",
          issue: `Line exceeds 100 chars (${ln.length}).`,
          suggestion: "Break expressions, wrap parameters, or extract variables.",
          severity: "low",
          lineNumber: i + 1,
          codeSnippet: ln.trim(),
          impact: "Shorter lines reduce horizontal scrolling and ease review.",
          example: "const result = veryLongFunction(\n  arg1,\n  arg2,\n  arg3\n);"
        });
      }
    });
    if (issues.some(it => it.category === 'Readability')) score -= 2;

    // 4) Rough nesting/cyclomatic complexity estimate for JS/TS-like code
    const branchKeywords = /(if|for|while|case\s+|catch|&&|\|\||\?\:)/g;
    let complexity = 1;
    lines.forEach(ln => {
      const matches = ln.match(branchKeywords);
      if (matches) complexity += matches.length;
    });
    if (complexity > 20) {
      issues.push({
        category: "Complexity",
        issue: `High cyclomatic complexity (~${complexity}).`,
        suggestion: "Decompose into smaller functions and use early returns to flatten logic.",
        severity: "high",
        lineNumber: null,
        codeSnippet: null,
        impact: "High complexity increases bug risk and makes testing harder.",
        example: "function isEligible(user) {\n  if (!user) return false;\n  if (!user.active) return false;\n  return user.age > 18;\n}"
      });
      score -= 12;
    } else if (complexity > 12) {
      issues.push({
        category: "Complexity",
        issue: `Elevated cyclomatic complexity (~${complexity}).`,
        suggestion: "Extract helpers and reduce branching depth.",
        severity: "medium",
        lineNumber: null,
        codeSnippet: null,
        impact: "Leaner functions are easier to reason about.",
        example: null
      });
      score -= 6;
    }

    // 5) JS/TS specific: detect 'var', console.log, missing const/let
    const isJsLike = /javascript|typescript|react/i.test(language);
    if (isJsLike) {
      lines.forEach((ln, i) => {
        if (/\bvar\b/.test(ln)) {
          issues.push({
            category: "Modern JavaScript",
            issue: "Usage of 'var' detected.",
            suggestion: "Use 'const' by default; 'let' only when reassignment is needed.",
            severity: "medium",
            lineNumber: i + 1,
            codeSnippet: ln.trim(),
            impact: "Block scoping prevents accidental hoisting bugs.",
            example: "const value = 1; // instead of var value = 1;"
          });
          score -= 2;
        }
        if (/console\.log\(/.test(ln)) {
          issues.push({
            category: "Diagnostics",
            issue: "console.log found. Consider structured logging or remove in production.",
            suggestion: "Guard logs behind env checks or use a logger with levels.",
            severity: "low",
            lineNumber: i + 1,
            codeSnippet: ln.trim(),
            impact: "Uncontrolled logging can leak data and clutter output.",
            example: "if (process.env.NODE_ENV !== 'production') console.debug(data);"
          });
        }
      });
      if (!/\b(const|let)\b/.test(code)) {
        issues.push({
          category: "Modern JavaScript",
          issue: "No 'const' or 'let' detected.",
          suggestion: "Prefer 'const' for immutability and safer scoping.",
          severity: "medium",
          lineNumber: null,
          codeSnippet: null,
          impact: "Immutability reduces unintended side effects.",
          example: "const count = 0; let total = 0;"
        });
        score -= 4;
      }
    }

    // 6) Empty catch blocks
    lines.forEach((ln, i) => {
      if (/catch\s*\(.*\)\s*\{\s*\}/.test(ln)) {
        issues.push({
          category: "Error Handling",
          issue: "Empty catch block detected.",
          suggestion: "Log, wrap, or rethrow the error with context.",
          severity: "high",
          lineNumber: i + 1,
          codeSnippet: ln.trim(),
          impact: "Swallowing errors hides failures and complicates debugging.",
          example: "} catch (err) {\n  logger.error('Operation failed', { err });\n  throw err;\n}"
        });
        score -= 6;
      }
    });

    // Bound score and build summary
    score = Math.max(0, Math.min(100, score));
    let summary = "Good code with room for improvement.";
    if (score >= 90) summary = "Excellent code quality!";
    else if (score >= 80) summary = "Good code with minor improvements possible.";
    else if (score >= 70) summary = "Code needs some improvements for better maintainability.";
    else summary = "Code requires significant improvements for better quality.";

    return { score, summary, improvements: issues };
  };

  type FileInputChangeEvent = { target: { files?: FileList | null } };
  const handleFileUpload = async (e: FileInputChangeEvent) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setError('');
    try {
      const text = await uploadedFile.text();
      setCode(text);
    } catch (err) {
      setError(t('failedToReadFile'));
    }
  };

  const analyzeCode = async () => {
    if (!code) {
      setError(t('pleaseUploadCodeFirst'));
      return;
    }
    setLoading(true);
    setError('');

    const language = file ? getLanguageFromExtension(file.name) : '';
    const expertTitle = language ? `${language} code review expert` : 'code review expert';
    const languageContext = language ? 
      `\nIMPORTANT: Do not flag issues that are widely used and accepted patterns in ${language}, even if they technically violate the general criteria. Consider ${language}-specific idioms and best practices.` : '';

    const prompt = `You are a ${expertTitle}. Please respond in ${locale} language. Analyze the following code and provide:
1. An overall score out of 100
2. Specific feedback on these criteria:
   - Descriptive names (classes, functions, variables)
   - Function size (avoid 200+ lines, but also avoid <5 lines if only called once)
   - Explicit dependencies (avoid global state/hidden dependencies)
   - Error handling (avoid empty try/catch blocks)
   - Nesting levels (2-3 max for readability)
   - Side effects clarity
   - Magic numbers usage
${languageContext}

Respond with ONLY a valid JSON object in this exact format:
{
  "score": number,
  "summary": "brief overall assessment",
  "improvements": [
    {
      "category": "category name",
      "issue": "specific issue description",
      "suggestion": "how to fix it",
      "severity": "high|medium|low",
      "lineNumber": number or null,
      "codeSnippet": "the problematic code line/snippet" or null
    }
  ]
}

Include lineNumber and codeSnippet when you can identify the specific location of an issue.

Code to analyze:
\`\`\`
${code}
\`\`\`

DO NOT include any text outside the JSON object.`;

    try {
      // Use Google Gemini API for code analysis (via env var)
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
      if (!apiKey) {
        console.warn('VITE_GEMINI_API_KEY not set. Using local heuristic analysis.');
        const mockAnalysis = generateMockAnalysis(code, language);
        setAnalysis(mockAnalysis);
        return;
      }

      console.log('Sending request to Gemini API...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
        })
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      let responseText = data.candidates[0].content.parts?.[0]?.text ?? '';
      console.log('Raw response text:', responseText);
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      try {
        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);
        setAnalysis(result);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Response text that failed to parse:', responseText);
        const mockAnalysis = generateMockAnalysis(code, language);
        setAnalysis(mockAnalysis);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      
      // If the API fails, fall back to mock analysis
      console.log('Falling back to mock analysis...');
      try {
        const mockAnalysis = generateMockAnalysis(code, language);
        setAnalysis(mockAnalysis);
        setError(''); // Clear any previous errors
      } catch (fallbackError) {
        console.error('Fallback analysis also failed:', fallbackError);
        setError('Failed to analyze code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return <span className="text-xl">🚨</span>;
    if (severity === 'medium') return <span className="text-xl">⚠️</span>;
    return <span className="text-xl">ℹ️</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-bounce-slow text-4xl">💻</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent animate-slide-up">
              {t('appTitle')}
            </h1>
            <div className="animate-bounce-slow text-3xl">⚡</div>
          </div>
          <p className="text-blue-200/80 animate-slide-up-delay">{t('appDescription')}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 via-slate-800/60 to-blue-800/40 backdrop-blur-sm rounded-xl p-6 mb-6 border border-blue-500/30 shadow-xl animate-slide-up-delay-2 hover:border-blue-400/50 transition-all duration-300 hover:shadow-blue-500/20">
          <label className="block mb-4">
            <span className="text-sm font-medium text-blue-200 mb-2 block flex items-center gap-2">📁 {t('uploadCodeFile')}</span>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.rb,.go,.php,.swift,.kt"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="group flex items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-blue-400/40 rounded-xl cursor-pointer hover:border-blue-400/80 hover:bg-blue-500/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <span className="text-2xl group-hover:animate-bounce">📤</span>
                <span className="text-blue-100 group-hover:text-blue-300 transition-colors">
                  {file ? `${file.name} ✅` : t('chooseFileOrDrag')}
                </span>
              </label>
            </div>
          </label>

          {code && (
            <div className="mt-4 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg animate-pulse">👀</span>
                <span className="text-sm text-blue-200">{t('codePreview')}</span>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <pre className="bg-gradient-to-br from-slate-900/80 to-blue-950/60 p-4 rounded-lg text-xs overflow-x-auto max-h-40 text-blue-100 border border-blue-500/20 shadow-inner">
                  {code.split('\n').slice(0, 10).join('\n')}
                  {code.split('\n').length > 10 && '\n...'}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}

          <button
            onClick={analyzeCode}
            disabled={!code || loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 disabled:from-gray-700 disabled:via-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin text-xl">⚙️</span>
                {t('analyzing')}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">🔍 {t('analyzeCode')} 🚀</div>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 backdrop-blur-sm border border-red-500/40 text-red-300 p-4 rounded-xl mb-6 animate-shake shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl animate-pulse">❌</span>
              {error}
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-blue-900/60 via-slate-800/70 to-blue-800/60 backdrop-blur-sm rounded-xl p-8 border border-blue-500/40 shadow-2xl hover:border-blue-400/60 transition-all duration-500 hover:shadow-blue-500/20">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center justify-center gap-2">📊 {t('overallScore')}</h2>
                <div className={`text-7xl font-bold ${getScoreColor(analysis.score)} animate-count-up drop-shadow-lg flex items-center justify-center gap-2`}>
                  {analysis.score >= 80 ? '🏆' : analysis.score >= 60 ? '⭐' : '📈'} {analysis.score}/100
                </div>
                <div className="w-32 h-2 bg-slate-700/50 rounded-full mx-auto mt-6 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      analysis.score >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-300' :
                      analysis.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-amber-300' :
                      'bg-gradient-to-r from-red-400 to-orange-300'
                    }`}
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
                <p className="text-blue-200 mt-4 animate-fade-in-delay">{analysis.summary}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 via-slate-800/60 to-blue-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-xl hover:border-blue-400/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">💡 {t('improvementSuggestions')}</h3>
              <div className="space-y-4">
                {analysis.improvements.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-slate-900/60 to-blue-950/40 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="animate-pulse-slow text-xl">
                        {getSeverityIcon(item.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-blue-300 hover:text-blue-200 transition-colors">{item.category}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 ${
                            item.severity === 'high' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                            item.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          }`}>
                            {t(item.severity)}
                          </span>
                        </div>
                        <p className="text-sm text-blue-100 mb-3 leading-relaxed">{item.issue}</p>
                        {item.codeSnippet && (
                          <div className="mb-3 animate-fade-in">
                            <div className="relative overflow-hidden rounded-lg">
                              <pre className="bg-gradient-to-br from-slate-950/80 to-blue-950/60 p-3 rounded-lg text-xs overflow-x-auto text-blue-200 border border-blue-500/20 shadow-inner">
                                <code>{item.codeSnippet}</code>
                              </pre>
                              <div className="absolute top-2 right-2"><span className="text-xs">🔍</span></div>
                            </div>
                          </div>
                        )}
                        {item.impact && (
                          <div className="mb-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/20 rounded-lg p-3">
                            <p className="text-xs text-blue-300">
                              <span className="font-medium text-blue-200 flex items-center gap-1">📈 Impact:</span>
                              <span className="mt-1 block">{item.impact}</span>
                            </p>
                          </div>
                        )}
                        {item.example && (
                          <div className="mb-3 animate-fade-in">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-green-300">✨ Improved Code:</span>
                            </div>
                            <div className="relative overflow-hidden rounded-lg">
                              <pre className="bg-gradient-to-br from-green-950/40 to-green-900/20 p-3 rounded-lg text-xs overflow-x-auto text-green-200 border border-green-500/30 shadow-inner">
                                <code>{item.example}</code>
                              </pre>
                              <div className="absolute top-2 right-2"><span className="text-xs">✅</span></div>
                            </div>
                          </div>
                        )}
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-lg p-3">
                          <p className="text-sm text-green-300">
                            <span className="font-medium text-green-200 flex items-center gap-1">💡 {t('suggestion')}</span>
                            <span className="mt-1 block">{item.suggestion}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 via-slate-800/40 to-blue-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 shadow-lg animate-fade-in-delay">
              <h4 className="text-lg font-medium text-blue-300 mb-4 flex items-center gap-2">📋 {t('evaluationGuidelines')}</h4>
              <ul className="text-sm text-blue-200 space-y-2">
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">🏷️</span>{t('descriptiveNaming')}</li>
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">📏</span>{t('appropriateFunctionSize')}</li>
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">🔗</span>{t('explicitDependencies')}</li>
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">🛡️</span>{t('properErrorHandling')}</li>
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">🎯</span>{t('limitedNesting')}</li>
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">👁️</span>{t('clearSideEffects')}</li>
                <li className="flex items-center gap-2 hover:text-blue-100 transition-colors"><span className="text-lg">🔢</span>{t('noMagicNumbers')}</li>
              </ul>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-950/90 via-slate-900/90 to-blue-900/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-900/80 via-slate-800/80 to-blue-800/80 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/40 text-center shadow-2xl animate-scale-in">
              <div className="relative mb-8">
                <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto drop-shadow-lg" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300/20 rounded-full animate-ping mx-auto"></div>
              </div>
              <h3 className="text-2xl font-medium mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{t('analyzingYourCode')}</h3>
              <p className="text-blue-200 animate-pulse">{t('thisMayTakeAMoment')}</p>
              <div className="flex justify-center gap-1 mt-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


